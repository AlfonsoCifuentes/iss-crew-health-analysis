# 🚀 ISS Crew Health Analysis - Deploy Guide

## 📦 Deploy to Vercel - Step by Step

### 🔑 Prerequisites
- Vercel CLI installed ✅ 
- GitHub repository with code
- Vercel account (free tier is sufficient)

### 🚀 Deploy Commands

#### Option 1: Automated Deploy via CLI
```bash
# 1. Login to Vercel
vercel login

# 2. Deploy from project directory
vercel

# 3. Follow the prompts:
#    - Set up and deploy? [Y/n] Y
#    - Which scope? Select your account
#    - Link to existing project? [y/N] N
#    - What's your project's name? iss-crew-health-analysis
#    - In which directory is your code located? ./
#    - Want to override settings? [y/N] N
```

#### Option 2: GitHub Integration (Recommended)
1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project" 
4. Select your GitHub repo: `iss-crew-health-analysis`
5. Configure:
   - Framework Preset: Next.js
   - Root Directory: `web/`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`
6. Click "Deploy"

### ⚡ Production URL
Once deployed, your site will be available at:
- `https://iss-crew-health-analysis.vercel.app` (or similar)

### 🔧 Environment Variables (Optional)
Add these in Vercel Dashboard → Project Settings → Environment Variables:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=ISS Crew Health Analysis
```

### 🎯 Custom Domain (Optional)
1. Go to Vercel Dashboard → Project → Settings → Domains
2. Add your custom domain
3. Configure DNS with your domain provider

### 📊 Performance Monitoring
- Vercel Analytics automatically enabled
- Core Web Vitals tracked
- Real User Monitoring (RUM) available

### 🔄 CI/CD Pipeline
- Automatic deployments on Git push
- Preview deployments for pull requests
- Rollback capabilities

---

## 📋 Post-Deploy Checklist

- [ ] Site loads correctly on desktop
- [ ] Site is mobile-responsive  
- [ ] All routes work (/, /dashboard, /astronauts, /simulators, etc.)
- [ ] Charts render properly
- [ ] Navigation works smoothly
- [ ] Images load correctly
- [ ] Performance score > 90 (Lighthouse)
- [ ] SEO score > 90 (Lighthouse)

### 🐛 Troubleshooting

**Build Errors:**
- Check `npm run build` works locally
- Verify all imports are correct
- Check TypeScript errors

**Runtime Errors:**
- Check Vercel function logs
- Verify environment variables
- Check browser console

**Performance Issues:**
- Optimize images
- Check bundle size (`npm run analyze`)
- Enable Vercel Speed Insights

---

## 🎉 SUCCESS!

Your ISS Crew Health Analysis is now live! 🚀

**Next Steps:**
1. Share the URL
2. Monitor performance with Vercel Analytics  
3. Set up custom domain (optional)
4. Enable advanced monitoring (optional)
