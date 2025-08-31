#!/bin/bash

# 🔓 Make Repository Public for Free GitHub Pages
# This script helps you make your repository public to enable free GitHub Pages

echo "🔓 Making Repository Public for Free GitHub Pages"
echo "================================================"
echo ""

echo "📋 Current Issue:"
echo "• Private repositories require GitHub Pro ($4/month) for GitHub Pages"
echo "• Public repositories get FREE GitHub Pages"
echo ""

echo "✅ Benefits of Making Public:"
echo "• FREE GitHub Pages hosting"
echo "• Only code is public (not sensitive data)"
echo "• Can make private again anytime"
echo "• Immediate GitHub Pages activation"
echo ""

echo "📋 Steps to Make Repository Public:"
echo ""
echo "1. Go to: https://github.com/lelong71/flashcard-app/settings"
echo ""
echo "2. Scroll down to 'Danger Zone'"
echo ""
echo "3. Click 'Change repository visibility'"
echo ""
echo "4. Select 'Make public'"
echo ""
echo "5. Type 'lelong71/flashcard-app' to confirm"
echo ""
echo "6. Click 'I understand, change repository visibility'"
echo ""

read -p "Press Enter when you've made the repository public..."

echo ""
echo "🔄 Redeploying to GitHub Pages..."
npm run build
gh-pages -d build

echo ""
echo "✅ Your app should now be available at:"
echo "   https://lelong71.github.io/flashcard-app/"
echo ""
echo "⏰ Wait 2-5 minutes for deployment to complete."
echo ""
echo "🎉 Congratulations! You now have FREE GitHub Pages hosting!"
