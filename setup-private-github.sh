#!/bin/bash

# 🔒 GitHub Private Repository Setup Script
# This script helps you set up a private GitHub repository for your flashcard app

echo "🔒 Setting up Private GitHub Repository"
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git repository already exists"
fi

# Build the app
echo "📦 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Exiting."
    exit 1
fi

echo "✅ Build successful!"
echo ""

# Get repository name
read -p "Enter your GitHub username: " username
read -p "Enter repository name (default: flashcard-app): " repo_name
repo_name=${repo_name:-flashcard-app}

echo ""
echo "🔗 Repository will be: https://github.com/$username/$repo_name"
echo ""

# Add and commit files
echo "📝 Adding files to git..."
git add .
git commit -m "Initial commit: Flashcard app"

# Set up remote
echo "🔗 Setting up remote repository..."
git branch -M main
git remote add origin https://github.com/$username/$repo_name.git

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://github.com/new"
echo "2. Repository name: $repo_name"
echo "3. Make sure 'Private' is checked ✅"
echo "4. Click 'Create repository'"
echo "5. Run this command to push:"
echo "   git push -u origin main"
echo ""
echo "6. Deploy to GitHub Pages:"
echo "   npm install -g gh-pages"
echo "   gh-pages -d build"
echo ""
echo "7. Add collaborators (optional):"
echo "   Settings → Collaborators → Add people"
echo ""

read -p "Press Enter when you've created the repository on GitHub..."

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🌐 Your private repository: https://github.com/$username/$repo_name"
    echo ""
    echo "📋 To deploy to GitHub Pages:"
    echo "npm install -g gh-pages"
    echo "gh-pages -d build"
    echo ""
    echo "🔗 GitHub Pages URL will be:"
    echo "https://$username.github.io/$repo_name/"
    echo ""
    echo "👥 To add collaborators:"
    echo "1. Go to repository settings"
    echo "2. Collaborators → Add people"
    echo "3. Enter their GitHub username"
    echo ""
    echo "🔒 Your flashcard app is now private and secure!"
else
    echo "❌ Failed to push to GitHub. Please check your repository URL."
fi
