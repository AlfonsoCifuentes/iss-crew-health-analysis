#!/bin/bash

# 🚀 ISS Crew Health Analysis - Vercel Deployment Script with Image Fix
# Este script asegura que las imágenes se desplieguen correctamente en Vercel

echo "🚀 Starting ISS Crew Health Analysis deployment..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the /web directory."
    exit 1
fi

# Verificar que las imágenes existen
echo "🔍 Checking required images..."

if [ ! -f "public/images/iss_hero.jpg" ]; then
    echo "❌ Error: iss_hero.jpg not found in public/images/"
    exit 1
fi

if [ ! -f "public/images/iss_icon.png" ]; then
    echo "❌ Error: iss_icon.png not found in public/images/"
    exit 1
fi

echo "✅ All required images found"

# Build del proyecto
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

# Deploy a Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🖼️  Images should now load correctly on Vercel"
    echo "📝 Verify the following after deployment:"
    echo "   - Homepage hero image displays correctly"
    echo "   - Navbar ISS icon displays correctly"
    echo "   - /images/iss_hero.jpg is accessible"
    echo "   - /images/iss_icon.png is accessible"
else
    echo "❌ Deployment failed"
    exit 1
fi

echo "🎉 ISS Crew Health Analysis deployment completed!"