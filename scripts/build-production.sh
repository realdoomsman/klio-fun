#!/bin/bash

echo "🚀 Building Klio.fun for Production"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js is available${NC}"

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm ci --production=false

# Run type checking
echo -e "${BLUE}🔍 Running type checks...${NC}"
npx tsc --noEmit

# Run linting
echo -e "${BLUE}🧹 Running linter...${NC}"
npm run lint

# Build the application
echo -e "${BLUE}🔨 Building application...${NC}"
npm run build

# Create production configuration
echo -e "${BLUE}⚙️ Creating production config...${NC}"
cat > .env.production << EOF
NEXT_PUBLIC_SOLANA_NETWORK=mainnet
NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_APP_NAME=Klio.fun
NEXT_PUBLIC_APP_DESCRIPTION=Decentralized Prediction Markets on Solana
EOF

# Create deployment info
cat > deployment-info.json << EOF
{
  "name": "Klio.fun",
  "version": "1.0.0",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "network": "production-ready",
  "features": {
    "walletIntegration": true,
    "realTrading": true,
    "portfolioTracking": true,
    "marketCreation": true,
    "mobileResponsive": true,
    "professionalUI": true
  },
  "revenue": {
    "tradingFees": "2%",
    "creationFee": "0.01 SOL",
    "platformFee": "5%"
  }
}
EOF

echo -e "${GREEN}🎉 Production build complete!${NC}"
echo ""
echo -e "${BLUE}📋 Build artifacts:${NC}"
echo "- .next/ (Next.js build)"
echo "- .env.production (environment config)"
echo "- deployment-info.json (deployment metadata)"
echo ""
echo -e "${YELLOW}🚀 Ready for deployment to:${NC}"
echo "- Vercel (recommended)"
echo "- Netlify"
echo "- AWS/GCP/Azure"
echo "- Custom server"
echo ""
echo -e "${GREEN}💰 Revenue features enabled:${NC}"
echo "- Real SOL trading"
echo "- Market creation fees"
echo "- Trading commissions"
echo "- Portfolio tracking"
echo ""
echo -e "${BLUE}🌐 Next steps:${NC}"
echo "1. Deploy to hosting platform"
echo "2. Configure custom domain"
echo "3. Set up analytics"
echo "4. Launch marketing campaign"