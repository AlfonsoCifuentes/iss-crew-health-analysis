# Deploy script for ISS Crew Health Analysis (PowerShell)

Write-Host "🚀 Starting deployment to Vercel..." -ForegroundColor Green

# Check if in correct directory
if (!(Test-Path "web")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel@latest
}

# Navigate to web directory
Set-Location web

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Blue
npm ci

# Run build locally to check for errors
Write-Host "🔨 Building project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Deployment complete! Check your Vercel dashboard for the URL." -ForegroundColor Green
