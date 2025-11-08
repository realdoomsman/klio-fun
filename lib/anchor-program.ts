import { Connection, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js'
import { AnchorProvider, Program, Wallet, BN } from '@coral-xyz/anchor'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token'
import { FateFun } from './types/fate_fun'
import idl from './idl/fate_fun.json'

const PROGRAM_ID = new PublicKey('85kBatQcCu7ZFy5YZYBVWa1HKGaWVwiA9jaP9qz4pump')

export class FateFunProgram {
  private program: Program<FateFun>
  private provider: AnchorProvider

  constructor(connection: Connection, wallet: Wallet) {
    this.provider = new AnchorProvider(connection, wallet, {})
    this.program = new Program(idl as FateFun, PROGRAM_ID, this.provider)
  }

  async createPrediction(
    eventDescription: string,
    deadline: Date,
    oracleSource: string,
    startingOdds?: number
  ) {
    const creator = this.provider.wallet.publicKey
    const createdAt = Math.floor(Date.now() / 1000)
    const deadlineTimestamp = Math.floor(deadline.getTime() / 1000)

    // Generate PDAs
    const [predictionPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from('prediction'),
        creator.toBuffer(),
        Buffer.from(createdAt.toString().padStart(8, '0'), 'hex')
      ],
      this.program.programId
    )

    const [yesMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('yes_mint'), predictionPda.toBuffer()],
      this.program.programId
    )

    const [noMintPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('no_mint'), predictionPda.toBuffer()],
      this.program.programId
    )

    const [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from('vault'), predictionPda.toBuffer()],
      this.program.programId
    )

    try {
      const tx = await this.program.methods
        .createPrediction(
          eventDescription,
          new BN(deadlineTimestamp),
          oracleSource,
          startingOdds ? new BN(startingOdds) : null
        )
        .accounts({
          prediction: predictionPda,
          yesMint: yesMintPda,
          noMint: noMintPda,
          vault: vaultPda,
          creator: creator,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: PublicKey.default, // Rent sysvar
        })
        .rpc()

      return {
        signature: tx,
        predictionAddress: predictionPda.toString(),
        yesMint: yesMintPda.toString(),
        noMint: noMintPda.toString(),
        vault: vaultPda.toString(),
      }
    } catch (error) {
      console.error('Error creating prediction:', error)
      throw error
    }
  }

  async buyTokens(
    predictionAddress: string,
    side: 'yes' | 'no',
    solAmount: number
  ) {
    const predictionPda = new PublicKey(predictionAddress)
    const user = this.provider.wallet.publicKey
    const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL)

    // Get prediction account to find mints
    const predictionAccount = await this.program.account.prediction.fetch(predictionPda)
    
    const yesMint = predictionAccount.yesMint
    const noMint = predictionAccount.noMint
    const vault = predictionAccount.vault
    const creator = predictionAccount.creator

    // Get user token accounts
    const userYesAccount = await getAssociatedTokenAddress(yesMint, user)
    const userNoAccount = await getAssociatedTokenAddress(noMint, user)

    try {
      const tx = await this.program.methods
        .buyTokens(side === 'yes', new BN(lamports))
        .accounts({
          prediction: predictionPda,
          yesMint: yesMint,
          noMint: noMint,
          vault: vault,
          creator: creator,
          userYesAccount: userYesAccount,
          userNoAccount: userNoAccount,
          user: user,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: PublicKey.default,
        })
        .rpc()

      return {
        signature: tx,
        tokensReceived: 0, // Will be calculated from events
      }
    } catch (error) {
      console.error('Error buying tokens:', error)
      throw error
    }
  }

  async resolvePrediction(predictionAddress: string, outcome: boolean) {
    const predictionPda = new PublicKey(predictionAddress)
    const creator = this.provider.wallet.publicKey

    try {
      const tx = await this.program.methods
        .resolvePrediction(outcome)
        .accounts({
          prediction: predictionPda,
          creator: creator,
        })
        .rpc()

      return tx
    } catch (error) {
      console.error('Error resolving prediction:', error)
      throw error
    }
  }

  async claimWinnings(predictionAddress: string) {
    const predictionPda = new PublicKey(predictionAddress)
    const user = this.provider.wallet.publicKey

    // Get prediction account
    const predictionAccount = await this.program.account.prediction.fetch(predictionPda)
    
    const yesMint = predictionAccount.yesMint
    const noMint = predictionAccount.noMint
    const vault = predictionAccount.vault

    // Get user token accounts
    const userYesAccount = await getAssociatedTokenAddress(yesMint, user)
    const userNoAccount = await getAssociatedTokenAddress(noMint, user)

    try {
      const tx = await this.program.methods
        .claimWinnings()
        .accounts({
          prediction: predictionPda,
          yesMint: yesMint,
          noMint: noMint,
          vault: vault,
          userYesAccount: userYesAccount,
          userNoAccount: userNoAccount,
          user: user,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc()

      return tx
    } catch (error) {
      console.error('Error claiming winnings:', error)
      throw error
    }
  }

  async getPrediction(predictionAddress: string) {
    try {
      const predictionPda = new PublicKey(predictionAddress)
      const account = await this.program.account.prediction.fetch(predictionPda)
      return account
    } catch (error) {
      console.error('Error fetching prediction:', error)
      throw error
    }
  }

  async getAllPredictions() {
    try {
      const predictions = await this.program.account.prediction.all()
      return predictions.map(p => ({
        address: p.publicKey.toString(),
        account: p.account
      }))
    } catch (error) {
      console.error('Error fetching all predictions:', error)
      return []
    }
  }
}

export function createFateFunProgram(connection: Connection, wallet: Wallet) {
  return new FateFunProgram(connection, wallet)
}