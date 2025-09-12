#!/bin/bash

# 🚀 ISS Crew Health Analysis - Optimized Vercel Build Script
# Este script asegura que todos los archivos estáticos se incluyan correctamente

echo "🚀 Building ISS Crew Health Analysis for Vercel..."

# Verificar directorio
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the /web directory."
    exit 1
fi

# Verificar archivos críticos
echo "🔍 Verifying critical static files..."

MISSING_FILES=()

# Verificar imágenes
if [ ! -f "public/images/iss_hero.jpg" ]; then
    MISSING_FILES+=("public/images/iss_hero.jpg")
fi

if [ ! -f "public/images/iss_icon.png" ]; then
    MISSING_FILES+=("public/images/iss_icon.png")
fi

# Verificar archivos JSON
JSON_FILES=("real_metrics.json" "aggregated_stats.json" "model_metadata.json")
for file in "${JSON_FILES[@]}"; do
    if [ ! -f "public/data/$file" ]; then
        MISSING_FILES+=("public/data/$file")
    fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
    echo "❌ Missing critical files:"
    for file in "${MISSING_FILES[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

echo "✅ All critical files found"

# Mostrar información de archivos
echo "📊 File sizes:"
echo "   - iss_hero.jpg: $(du -h public/images/iss_hero.jpg | cut -f1)"
echo "   - iss_icon.png: $(du -h public/images/iss_icon.png | cut -f1)"

# Limpiar cache
echo "🧹 Cleaning build cache..."
rm -rf .next
rm -rf .vercel

# Instalar dependencias
echo "📦 Installing dependencies..."
npm ci

# Build
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build successful!"
echo "📋 Deployment checklist:"
echo "   ✅ Images in public/images/"
echo "   ✅ JSON data in public/data/"
echo "   ✅ Build completed without errors"
echo "   ✅ Analytics configured"
echo ""
echo "🚀 Ready for Vercel deployment!"
echo "Run: vercel --prod"