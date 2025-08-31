#!/bin/bash

# 📦 Cait's Flashcard App Deployment Script
# This script builds and prepares your flashcard app for static deployment

echo "🚀 Building Cait's Flashcard App..."

# Build the app
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📁 Your static bundle is ready in the 'build/' folder"
    echo ""
    echo "🎯 Delivery Options:"
    echo "1. Zip the 'build/' folder and share"
    echo "2. Serve locally: cd build && python -m http.server 8000"
    echo "3. Deploy to GitHub Pages: npm install -g gh-pages && gh-pages -d build"
    echo ""
    echo "📋 For users:"
    echo "- Extract the zip file"
    echo "- Open 'index.html' in any browser"
    echo "- Or use a simple server to avoid CORS issues"
    echo ""
    echo "🌐 Test locally: http://localhost:8000 (if server is running)"
else
    echo "❌ Build failed! Check for errors above."
    exit 1
fi
