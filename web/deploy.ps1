# ISS Crew Health Analysis - Deploy Script (PowerShell)
# Run this script from the web/ directory

Write-Host "ISS Crew Health Analysis - Deploy Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Make sure you're in the web directory." -ForegroundColor Red
    exit 1
}

Write-Host "Building the project..." -ForegroundColor Yellow
& npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed. Please fix build errors first." -ForegroundColor Red
    exit 1
}

Write-Host "Build successful!" -ForegroundColor Green
Write-Host ""

Write-Host "Now login to Vercel and deploy:" -ForegroundColor Cyan
Write-Host "   1. Run: vercel login" -ForegroundColor White
Write-Host "   2. Run: vercel" -ForegroundColor White  
Write-Host "   3. Follow the prompts" -ForegroundColor White
Write-Host ""

Write-Host "Project Configuration:" -ForegroundColor Cyan
Write-Host "   - Framework: Next.js" -ForegroundColor White
Write-Host "   - Build Command: npm run build" -ForegroundColor White
Write-Host "   - Output Directory: .next" -ForegroundColor White
Write-Host "   - Install Command: npm ci" -ForegroundColor White
Write-Host ""

Write-Host "Expected URL: https://iss-crew-health-analysis.vercel.app" -ForegroundColor Magenta
Write-Host ""
Write-Host "Ready to deploy!" -ForegroundColor Green
