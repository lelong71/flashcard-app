#!/bin/bash

# 🔧 GitHub Pages Troubleshooting Script
# This script helps diagnose and fix GitHub Pages issues

echo "🔧 GitHub Pages Troubleshooting"
echo "=============================="
echo ""

echo "📋 Current Status:"
echo "Repository: https://github.com/lelong71/flashcard-app"
echo "Expected URL: https://lelong71.github.io/flashcard-app/"
echo ""

echo "🔍 Checking deployment status..."
echo ""

# Check if gh-pages branch exists
if git ls-remote --heads origin gh-pages | grep -q gh-pages; then
    echo "✅ gh-pages branch exists"
else
    echo "❌ gh-pages branch not found"
fi

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build directory exists"
    echo "   Size: $(du -sh build | cut -f1)"
else
    echo "❌ Build directory missing"
fi

echo ""
echo "📋 Manual Steps to Fix GitHub Pages:"
echo ""
echo "1. Go to: https://github.com/lelong71/flashcard-app/settings/pages"
echo ""
echo "2. Under 'Source', make sure:"
echo "   • Source: 'Deploy from a branch'"
echo "   • Branch: 'gh-pages'"
echo "   • Folder: '/ (root)'"
echo ""
echo "3. Click 'Save'"
echo ""
echo "4. Wait 2-5 minutes for deployment"
echo ""
echo "5. Check status at: https://github.com/lelong71/flashcard-app/actions"
echo ""

echo "🔄 Redeploying..."
npm run build
gh-pages -d build

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 Your app should be available at:"
echo "   https://lelong71.github.io/flashcard-app/"
echo ""
echo "⏰ If it's still not working, wait 2-5 minutes and try again."
echo ""
echo "🔗 Alternative URLs to try:"
echo "   https://lelong71.github.io/flashcard-app/index.html"
echo "   https://lelong71.github.io/flashcard-app/#/"
echo ""
echo "📞 If still not working, check:"
echo "   • Repository settings: https://github.com/lelong71/flashcard-app/settings"
echo "   • Actions tab: https://github.com/lelong71/flashcard-app/actions"
echo "   • GitHub status: https://www.githubstatus.com/"
