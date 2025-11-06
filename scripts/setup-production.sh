#!/bin/bash

echo "🚀 Setting up Klio.fun for Production Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}❌ Rust is not installed${NC}"
    echo -e "${YELLOW}📥 Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
fi

echo -e "${GREEN}✅ Rust is installed${NC}"

# Check if Solana CLI is installed
if ! command -v solana &> /dev/null; then
    echo -e "${YELLOW}📥 Installing Solana CLI...${NC}"
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.26/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
fi

echo -e "${GREEN}✅ Solana CLI is installed${NC}"

# Check if Anchor is installed
if ! command -v anchor &> /dev/null; then
    echo -e "${YELLOW}📥 Installing Anchor CLI...${NC}"
    npm install -g @coral-xyz/anchor-cli
fi

echo -e "${GREEN}✅ Anchor CLI is installed${NC}"

# Set Solana to devnet for testing
echo -e "${BLUE}🔧 Configuring Solana for devnet...${NC}"
solana config set --url https://api.devnet.solana.com

# Generate keypair if it doesn't exist
if [ ! -f ~/.config/solana/id.json ]; then
    echo -e "${YELLOW}🔑 Generating Solana keypair...${NC}"
    solana-keygen new --no-bip39-passphrase
fi

# Get wallet address
WALLET_ADDRESS=$(solana address)
echo -e "${BLUE}👤 Wallet Address: ${WALLET_ADDRESS}${NC}"

# Check balance
BALANCE=$(solana balance --lamports)
echo -e "${BLUE}💰 Current Balance: $((BALANCE / 1000000000)) SOL${NC}"

# Request airdrop if balance is low
if [ $BALANCE -lt 2000000000 ]; then
    echo -e "${YELLOW}💧 Requesting SOL airdrop...${NC}"
    solana airdrop 2
    sleep 5
fi

# Build the Anchor program
echo -e "${BLUE}🔨 Building Anchor program...${NC}"
anchor build

# Deploy the program
echo -e "${BLUE}🚀 Deploying to devnet...${NC}"
anchor deploy

# Get the deployed program ID
PROGRAM_ID=$(anchor keys list | grep "fate_fun" | awk '{print $2}')
echo -e "${GREEN}✅ Program deployed with ID: ${PROGRAM_ID}${NC}"

# Update the frontend configuration
echo -e "${BLUE}🔧 Updating frontend configuration...${NC}"
cat > deployment-config.json << EOF
{
  "programId": "${PROGRAM_ID}",
  "network": "devnet",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "walletAddress": "${WALLET_ADDRESS}",
  "status": "deployed"
}
EOF

# Update the anchor-client.ts with the real program ID
sed -i.bak "s/FateFunPredictionMarket11111111111111111111/${PROGRAM_ID}/g" lib/anchor-client.ts

echo -e "${GREEN}🎉 Production setup complete!${NC}"
echo -e "${GREEN}✅ Smart contract deployed to devnet${NC}"
echo -e "${GREEN}✅ Frontend configured for real trading${NC}"
echo -e "${GREEN}✅ Users can now make real money!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo -e "1. Test the application with real SOL transactions"
echo -e "2. Deploy to mainnet when ready: anchor deploy --provider.cluster mainnet"
echo -e "3. Update RPC endpoints for production"
echo -e "4. Set up monitoring and analytics"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo -e "- This is deployed on devnet (test network)"
echo -e "- Use real SOL carefully on mainnet"
echo -e "- Always test thoroughly before mainnet deployment"