#!/bin/bash
# ISS Crew Health Analysis - Deploy Script

echo "🚀 ISS Crew Health Analysis - Deploy Script"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the web directory."
    exit 1
fi

echo "📦 Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix build errors first."
    exit 1
fi

echo "✅ Build successful!"
echo ""
echo "🔑 Now login to Vercel and deploy:"
echo "   1. Run: vercel login"
echo "   2. Run: vercel"
echo "   3. Follow the prompts"
echo ""
echo "📊 Project Configuration:"
echo "   - Framework: Next.js"
echo "   - Build Command: npm run build"
echo "   - Output Directory: .next"
echo "   - Install Command: npm ci"
echo ""
echo "🎯 Expected URL: https://iss-crew-health-analysis.vercel.app"
echo ""
echo "Ready to deploy! 🚀"
