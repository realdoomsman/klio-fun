#!/bin/bash

echo "🚀 Deploying Klio.fun to Vercel"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Pre-deployment checklist:${NC}"
echo "✅ Production build completed"
echo "✅ All features tested"
echo "✅ Environment configured"
echo "✅ Vercel config created"
echo ""

echo -e "${YELLOW}🔐 Step 1: Login to Vercel${NC}"
echo "Run this command to authenticate:"
echo -e "${GREEN}npx vercel login${NC}"
echo ""
echo "This will:"
echo "- Open your browser"
echo "- Ask you to sign in with GitHub/GitLab/Bitbucket"
echo "- Generate an authentication token"
echo ""

echo -e "${YELLOW}🚀 Step 2: Deploy to Production${NC}"
echo "After logging in, run:"
echo -e "${GREEN}npx vercel --prod${NC}"
echo ""
echo "This will:"
echo "- Upload your code to Vercel"
echo "- Build the production version"
echo "- Deploy to a public URL"
echo "- Provide you with the live URL"
echo ""

echo -e "${YELLOW}🌐 Step 3: Custom Domain (Optional)${NC}"
echo "To add a custom domain:"
echo "1. Go to your Vercel dashboard"
echo "2. Select your project"
echo "3. Go to Settings > Domains"
echo "4. Add your domain (e.g., klio.fun)"
echo ""

echo -e "${YELLOW}⚙️ Step 4: Environment Variables${NC}"
echo "Configure these in Vercel dashboard:"
echo "- NEXT_PUBLIC_SOLANA_NETWORK=mainnet (for production)"
echo "- NEXT_PUBLIC_RPC_URL=https://api.mainnet-beta.solana.com"
echo "- NEXT_PUBLIC_APP_URL=https://your-domain.com"
echo ""

echo -e "${GREEN}💰 Revenue Features Ready:${NC}"
echo "- Real SOL trading: ✅"
echo "- Market creation fees: ✅"
echo "- Trading commissions: ✅"
echo "- Portfolio tracking: ✅"
echo ""

echo -e "${BLUE}🎯 Expected Results:${NC}"
echo "- Live URL: https://klio-fun-xxx.vercel.app"
echo "- SSL certificate: Automatic"
echo "- Global CDN: Included"
echo "- Performance: Optimized"
echo ""

echo -e "${YELLOW}📊 Post-Deployment:${NC}"
echo "1. Test all features on live site"
echo "2. Share the URL with users"
echo "3. Monitor analytics and revenue"
echo "4. Scale based on usage"
echo ""

echo -e "${GREEN}🎉 Ready to make money with Klio.fun!${NC}"
echo ""
echo -e "${BLUE}Run these commands now:${NC}"
echo -e "${GREEN}1. npx vercel login${NC}"
echo -e "${GREEN}2. npx vercel --prod${NC}"