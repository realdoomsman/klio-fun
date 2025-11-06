use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint, MintTo, Burn};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("FateFunPredictionMarket11111111111111111111");

#[program]
pub mod fate_fun {
    use super::*;

    pub fn create_prediction(
        ctx: Context<CreatePrediction>,
        event_description: String,
        deadline: i64,
        oracle_source: String,
        starting_odds: Option<u64>, // basis points (5000 = 50%)
    ) -> Result<()> {
        let prediction = &mut ctx.accounts.prediction;
        let clock = Clock::get()?;

        require!(deadline > clock.unix_timestamp, ErrorCode::InvalidDeadline);
        require!(event_description.len() <= 280, ErrorCode::DescriptionTooLong);

        prediction.creator = ctx.accounts.creator.key();
        prediction.event_description = event_description;
        prediction.deadline = deadline;
        prediction.oracle_source = oracle_source;
        prediction.created_at = clock.unix_timestamp;
        prediction.total_volume = 0;
        prediction.yes_supply = 0;
        prediction.no_supply = 0;
        prediction.resolved = false;
        prediction.outcome = None;
        prediction.starting_odds = starting_odds.unwrap_or(5000); // Default 50%
        prediction.yes_mint = ctx.accounts.yes_mint.key();
        prediction.no_mint = ctx.accounts.no_mint.key();
        prediction.vault = ctx.accounts.vault.key();

        emit!(PredictionCreated {
            prediction: prediction.key(),
            creator: prediction.creator,
            event_description: prediction.event_description.clone(),
            deadline: prediction.deadline,
        });

        Ok(())
    }

    pub fn buy_tokens(
        ctx: Context<BuyTokens>,
        side: bool, // true = yes, false = no
        sol_amount: u64,
    ) -> Result<()> {
        // Get immutable references first
        let prediction_key = ctx.accounts.prediction.key();
        let user_key = ctx.accounts.user.key();
        
        // Check constraints
        require!(!ctx.accounts.prediction.resolved, ErrorCode::MarketResolved);
        
        let clock = Clock::get()?;
        require!(clock.unix_timestamp < ctx.accounts.prediction.deadline, ErrorCode::DeadlinePassed);
        require!(sol_amount > 0, ErrorCode::InvalidAmount);

        // Calculate tokens using bonding curve
        let base_liquidity = 1000u64;
        let total_supply = ctx.accounts.prediction.yes_supply + ctx.accounts.prediction.no_supply + base_liquidity;
        let current_supply = if side { ctx.accounts.prediction.yes_supply } else { ctx.accounts.prediction.no_supply };
        
        // Price in lamports per token (scaled by 1e6 for precision)
        let price_per_token = ((current_supply + base_liquidity / 2) * 1_000_000) / total_supply;
        let tokens_to_mint = (sol_amount * 1_000_000) / std::cmp::max(price_per_token, 1);

        // Transfer SOL: 98% to vault, 2% to creator
        let vault_amount = (sol_amount * 98) / 100;
        let creator_fee = sol_amount - vault_amount;

        // Transfer to vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, vault_amount)?;

        // Transfer creator fee
        if creator_fee > 0 {
            let cpi_context = CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.user.to_account_info(),
                    to: ctx.accounts.creator.to_account_info(),
                },
            );
            anchor_lang::system_program::transfer(cpi_context, creator_fee)?;
        }

        // Mint tokens to user
        let creator_key = ctx.accounts.prediction.creator;
        let created_at = ctx.accounts.prediction.created_at;
        
        let seeds = &[
            b"prediction",
            creator_key.as_ref(),
            &created_at.to_le_bytes(),
            &[ctx.bumps.prediction],
        ];
        let signer = &[&seeds[..]];

        let mint_account = if side { 
            ctx.accounts.yes_mint.to_account_info() 
        } else { 
            ctx.accounts.no_mint.to_account_info() 
        };
        
        let user_account = if side {
            ctx.accounts.user_yes_account.to_account_info()
        } else {
            ctx.accounts.user_no_account.to_account_info()
        };

        let mint_to_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: mint_account,
                to: user_account,
                authority: ctx.accounts.prediction.to_account_info(),
            },
            signer,
        );

        token::mint_to(mint_to_ctx, tokens_to_mint)?;

        // Update prediction state (now we can get mutable reference)
        let prediction = &mut ctx.accounts.prediction;
        if side {
            prediction.yes_supply += tokens_to_mint;
        } else {
            prediction.no_supply += tokens_to_mint;
        }
        prediction.total_volume += sol_amount;

        emit!(TokensPurchased {
            prediction: prediction_key,
            user: user_key,
            side,
            sol_amount,
            tokens_received: tokens_to_mint,
            price: price_per_token,
        });

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let prediction = &ctx.accounts.prediction;
        require!(prediction.resolved, ErrorCode::MarketNotResolved);
        
        let outcome = prediction.outcome.unwrap();
        let user_tokens = if outcome {
            ctx.accounts.user_yes_account.amount
        } else {
            ctx.accounts.user_no_account.amount
        };

        require!(user_tokens > 0, ErrorCode::NoWinningTokens);

        let total_winning_supply = if outcome { 
            prediction.yes_supply 
        } else { 
            prediction.no_supply 
        };
        
        // Calculate payout: (user_tokens / total_winning_supply) * vault_balance * 0.95
        let vault_balance = ctx.accounts.vault.lamports();
        let platform_fee = vault_balance / 20; // 5% platform fee
        let available_payout = vault_balance - platform_fee;
        
        let user_payout = ((user_tokens as u128 * available_payout as u128) / total_winning_supply as u128) as u64;

        // Transfer payout from vault to user
        **ctx.accounts.vault.to_account_info().try_borrow_mut_lamports()? -= user_payout;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += user_payout;

        // Burn the winning tokens
        let burn_ctx = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: if outcome {
                    ctx.accounts.yes_mint.to_account_info()
                } else {
                    ctx.accounts.no_mint.to_account_info()
                },
                from: if outcome {
                    ctx.accounts.user_yes_account.to_account_info()
                } else {
                    ctx.accounts.user_no_account.to_account_info()
                },
                authority: ctx.accounts.user.to_account_info(),
            },
        );
        token::burn(burn_ctx, user_tokens)?;

        emit!(WinningsClaimed {
            prediction: prediction.key(),
            user: ctx.accounts.user.key(),
            tokens_burned: user_tokens,
            payout: user_payout,
        });

        Ok(())
    }

    pub fn resolve_prediction(ctx: Context<ResolvePrediction>, outcome: bool) -> Result<()> {
        let prediction = &mut ctx.accounts.prediction;
        let clock = Clock::get()?;

        require!(clock.unix_timestamp >= prediction.deadline, ErrorCode::DeadlineNotReached);
        require!(!prediction.resolved, ErrorCode::AlreadyResolved);
        require!(ctx.accounts.resolver.key() == prediction.creator, ErrorCode::UnauthorizedResolver);

        prediction.resolved = true;
        prediction.outcome = Some(outcome);

        emit!(PredictionResolved {
            prediction: prediction.key(),
            outcome,
        });

        Ok(())
    }
}

// Helper functions for bonding curve
fn calculate_yes_price(yes_supply: u64, no_supply: u64) -> u64 {
    // Simple bonding curve: price = yes_supply / (yes_supply + no_supply + 1000)
    // Returns price in basis points (0-10000)
    let total_supply = yes_supply + no_supply + 1000; // Add base liquidity
    (yes_supply * 10000) / total_supply
}

fn calculate_no_price(yes_supply: u64, no_supply: u64) -> u64 {
    let total_supply = yes_supply + no_supply + 1000;
    (no_supply * 10000) / total_supply
}

#[derive(Accounts)]
pub struct CreatePrediction<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + 32 + 280 + 8 + 100 + 8 + 8 + 8 + 8 + 1 + 1 + 8 + 32 + 32 + 32,
        seeds = [b"prediction", creator.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub prediction: Account<'info, Prediction>,
    
    #[account(
        init,
        payer = creator,
        mint::decimals = 6,
        mint::authority = prediction,
        seeds = [b"yes_mint", prediction.key().as_ref()],
        bump
    )]
    pub yes_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = creator,
        mint::decimals = 6,
        mint::authority = prediction,
        seeds = [b"no_mint", prediction.key().as_ref()],
        bump
    )]
    pub no_mint: Account<'info, Mint>,
    
    /// CHECK: Vault account for holding SOL
    #[account(
        mut,
        seeds = [b"vault", prediction.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTokens<'info> {
    #[account(
        mut,
        seeds = [b"prediction", prediction.creator.as_ref(), &prediction.created_at.to_le_bytes()],
        bump
    )]
    pub prediction: Account<'info, Prediction>,
    
    #[account(
        mut,
        seeds = [b"yes_mint", prediction.key().as_ref()],
        bump
    )]
    pub yes_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        seeds = [b"no_mint", prediction.key().as_ref()],
        bump
    )]
    pub no_mint: Account<'info, Mint>,
    
    /// CHECK: Vault for SOL storage
    #[account(
        mut,
        seeds = [b"vault", prediction.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    /// CHECK: Creator receives fees
    #[account(mut)]
    pub creator: AccountInfo<'info>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = yes_mint,
        associated_token::authority = user
    )]
    pub user_yes_account: Account<'info, TokenAccount>,
    
    #[account(
        init_if_needed,
        payer = user,
        associated_token::mint = no_mint,
        associated_token::authority = user
    )]
    pub user_no_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        mut,
        seeds = [b"prediction", prediction.creator.as_ref(), &prediction.created_at.to_le_bytes()],
        bump
    )]
    pub prediction: Account<'info, Prediction>,
    
    #[account(
        mut,
        seeds = [b"yes_mint", prediction.key().as_ref()],
        bump
    )]
    pub yes_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        seeds = [b"no_mint", prediction.key().as_ref()],
        bump
    )]
    pub no_mint: Account<'info, Mint>,
    
    /// CHECK: Vault holding SOL payouts
    #[account(
        mut,
        seeds = [b"vault", prediction.key().as_ref()],
        bump
    )]
    pub vault: AccountInfo<'info>,
    
    #[account(mut)]
    pub user_yes_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user_no_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ResolvePrediction<'info> {
    #[account(mut)]
    pub prediction: Account<'info, Prediction>,
    pub resolver: Signer<'info>,
}

#[account]
pub struct Prediction {
    pub creator: Pubkey,
    pub event_description: String,
    pub deadline: i64,
    pub oracle_source: String,
    pub created_at: i64,
    pub total_volume: u64,
    pub yes_supply: u64,
    pub no_supply: u64,
    pub resolved: bool,
    pub outcome: Option<bool>,
    pub starting_odds: u64,
    pub yes_mint: Pubkey,
    pub no_mint: Pubkey,
    pub vault: Pubkey,
}

#[event]
pub struct PredictionCreated {
    pub prediction: Pubkey,
    pub creator: Pubkey,
    pub event_description: String,
    pub deadline: i64,
}

#[event]
pub struct TokensPurchased {
    pub prediction: Pubkey,
    pub user: Pubkey,
    pub side: bool, // true = yes, false = no
    pub sol_amount: u64,
    pub tokens_received: u64,
    pub price: u64,
}

#[event]
pub struct WinningsClaimed {
    pub prediction: Pubkey,
    pub user: Pubkey,
    pub tokens_burned: u64,
    pub payout: u64,
}

#[event]
pub struct PredictionResolved {
    pub prediction: Pubkey,
    pub outcome: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub enum TradeSide {
    Yes,
    No,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid deadline - must be in the future")]
    InvalidDeadline,
    #[msg("Description too long - max 280 characters")]
    DescriptionTooLong,
    #[msg("Market already resolved")]
    MarketResolved,
    #[msg("Deadline has passed")]
    DeadlinePassed,
    #[msg("Deadline not reached yet")]
    DeadlineNotReached,
    #[msg("Prediction already resolved")]
    AlreadyResolved,
    #[msg("Unauthorized resolver")]
    UnauthorizedResolver,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Market not resolved")]
    MarketNotResolved,
    #[msg("No winning tokens to claim")]
    NoWinningTokens,
}