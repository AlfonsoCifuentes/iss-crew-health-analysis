# 🚀 ISS Crew Health Analysis - Vercel Deployment Script with Image Fix
# Este script asegura que las imágenes se desplieguen correctamente en Vercel

Write-Host "🚀 Starting ISS Crew Health Analysis deployment..." -ForegroundColor Cyan

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Make sure you're in the /web directory." -ForegroundColor Red
    exit 1
}

# Verificar que las imágenes existen
Write-Host "🔍 Checking required images..." -ForegroundColor Yellow

if (!(Test-Path "public/images/iss_hero.jpg")) {
    Write-Host "❌ Error: iss_hero.jpg not found in public/images/" -ForegroundColor Red
    exit 1
}

if (!(Test-Path "public/images/iss_icon.png")) {
    Write-Host "❌ Error: iss_icon.png not found in public/images/" -ForegroundColor Red
    exit 1
}

Write-Host "✅ All required images found" -ForegroundColor Green

# Build del proyecto
Write-Host "🔨 Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed" -ForegroundColor Red
    exit 1
}

# Deploy a Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host "🖼️  Images should now load correctly on Vercel" -ForegroundColor Green
    Write-Host "📝 Verify the following after deployment:" -ForegroundColor Yellow
    Write-Host "   - Homepage hero image displays correctly" -ForegroundColor White
    Write-Host "   - Navbar ISS icon displays correctly" -ForegroundColor White
    Write-Host "   - /images/iss_hero.jpg is accessible" -ForegroundColor White
    Write-Host "   - /images/iss_icon.png is accessible" -ForegroundColor White
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 ISS Crew Health Analysis deployment completed!" -ForegroundColor Cyan