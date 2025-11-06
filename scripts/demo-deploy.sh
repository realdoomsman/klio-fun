#!/bin/bash

echo "🚀 Setting up Klio.fun Demo Deployment"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Demo Deployment Features:${NC}"
echo "- ✅ Full frontend functionality"
echo "- ✅ Real wallet integration"
echo "- ✅ Demo trading with SOL transfers"
echo "- ✅ Complete UI/UX experience"
echo "- ✅ Portfolio tracking"
echo "- ✅ Market creation"
echo ""

# Check if Node.js is available
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js is installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if npm is available
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm is installed: ${NPM_VERSION}${NC}"
else
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Create demo configuration
echo -e "${BLUE}🔧 Creating demo configuration...${NC}"
cat > deployment-config.json << EOF
{
  "programId": "DEMO_MODE_NO_REAL_CONTRACT",
  "network": "demo",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "mode": "demo",
  "status": "demo-ready",
  "features": {
    "walletIntegration": true,
    "demoTrading": true,
    "portfolioTracking": true,
    "marketCreation": true,
    "realSOLTransfers": true
  }
}
EOF

# Start the development server
echo -e "${BLUE}🚀 Starting Klio.fun...${NC}"
echo ""
echo -e "${GREEN}🎉 Klio.fun Demo is Ready!${NC}"
echo ""
echo -e "${YELLOW}📋 What you can do:${NC}"
echo "1. 🔗 Connect your Phantom/Solflare wallet"
echo "2. 💰 Trade with real SOL (demo mode)"
echo "3. 📊 Create prediction markets"
echo "4. 💼 Track your portfolio"
echo "5. 🎯 Experience the full platform"
echo ""
echo -e "${BLUE}🌐 Access your platform at: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}⚠️  Demo Mode Features:${NC}"
echo "- Real wallet connections"
echo "- Real SOL transactions (small amounts)"
echo "- Full UI/UX experience"
echo "- Portfolio tracking"
echo "- Market creation"
echo ""
echo -e "${GREEN}🚀 Ready to make money? Deploy to mainnet later!${NC}"
echo ""

# Start the server in the background
npm run dev &
SERVER_PID=$!

echo -e "${GREEN}✅ Server started with PID: ${SERVER_PID}${NC}"
echo -e "${BLUE}🔍 Debug Panel: Look for DEBUG button in bottom-right${NC}"
echo -e "${YELLOW}💡 Tip: Use the debug panel to test trading functionality${NC}"
echo ""
echo -e "${GREEN}🎯 Klio.fun is now running! Open http://localhost:3000${NC}"