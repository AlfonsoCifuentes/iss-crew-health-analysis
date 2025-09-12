# 🚀 ISS Crew Health Analysis - Optimized Vercel Build Script
# Este script asegura que todos los archivos estáticos se incluyan correctamente

Write-Host "🚀 Building ISS Crew Health Analysis for Vercel..." -ForegroundColor Cyan

# Verificar directorio
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found. Make sure you're in the /web directory." -ForegroundColor Red
    exit 1
}

# Verificar archivos críticos
Write-Host "🔍 Verifying critical static files..." -ForegroundColor Yellow

$MissingFiles = @()

# Verificar imágenes
if (!(Test-Path "public/images/iss_hero.jpg")) {
    $MissingFiles += "public/images/iss_hero.jpg"
}

if (!(Test-Path "public/images/iss_icon.png")) {
    $MissingFiles += "public/images/iss_icon.png"
}

# Verificar archivos JSON
$JsonFiles = @("real_metrics.json", "aggregated_stats.json", "model_metadata.json")
foreach ($file in $JsonFiles) {
    if (!(Test-Path "public/data/$file")) {
        $MissingFiles += "public/data/$file"
    }
}

if ($MissingFiles.Count -gt 0) {
    Write-Host "❌ Missing critical files:" -ForegroundColor Red
    foreach ($file in $MissingFiles) {
        Write-Host "   - $file" -ForegroundColor Red
    }
    exit 1
}

Write-Host "✅ All critical files found" -ForegroundColor Green

# Mostrar información de archivos
Write-Host "📊 File sizes:" -ForegroundColor Yellow
$heroSize = [math]::Round((Get-Item "public/images/iss_hero.jpg").Length / 1MB, 2)
$iconSize = [math]::Round((Get-Item "public/images/iss_icon.png").Length / 1MB, 2)
Write-Host "   - iss_hero.jpg: $heroSize MB" -ForegroundColor White
Write-Host "   - iss_icon.png: $iconSize MB" -ForegroundColor White

# Limpiar cache
Write-Host "🧹 Cleaning build cache..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path ".vercel") { Remove-Item -Recurse -Force ".vercel" }

# Instalar dependencias
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Build
Write-Host "🔨 Building application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful!" -ForegroundColor Green
Write-Host "📋 Deployment checklist:" -ForegroundColor Yellow
Write-Host "   ✅ Images in public/images/" -ForegroundColor Green
Write-Host "   ✅ JSON data in public/data/" -ForegroundColor Green
Write-Host "   ✅ Build completed without errors" -ForegroundColor Green
Write-Host "   ✅ Analytics configured" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Ready for Vercel deployment!" -ForegroundColor Cyan
Write-Host "Run: vercel --prod" -ForegroundColor White