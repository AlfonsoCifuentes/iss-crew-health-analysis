# 🚀 Deploy to Vercel

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/iss-crew-health-analysis)

## Manual Deploy Steps

### 1. Prerequisites
- GitHub account
- Vercel account (can sign up with GitHub)

### 2. Repository Setup
```bash
git add .
git commit -m "feat: ready for Vercel deployment"
git push origin main
```

### 3. Vercel Configuration
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 4. Environment Variables
Set the following in Vercel dashboard:
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=ISS Crew Health Analysis
NODE_ENV=production
```

### 5. Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Build Verification

The project builds successfully with:
- ✅ Next.js 15+ with App Router
- ✅ TypeScript (strict mode)
- ✅ Tailwind CSS
- ✅ All pages pre-rendered as static content
- ✅ Optimized bundle sizes
- ✅ Performance optimized

## Post-Deploy Checklist

- [ ] Site loads correctly on mobile and desktop
- [ ] All navigation links work
- [ ] Charts render properly
- [ ] Simulators function correctly
- [ ] SEO metadata appears in page source
- [ ] Performance score > 90 (Lighthouse)
- [ ] Accessibility score > 90 (axe-core)

## Monitoring

After deployment, monitor:
- Core Web Vitals in Vercel Analytics
- Error rates in Vercel Functions
- Build times and deployment success

## Troubleshooting

### Common Issues:
1. **Build fails**: Check dependencies in `package.json`
2. **Images not loading**: Verify paths in `next.config.ts`
3. **404 errors**: Check file structure matches routes
4. **Slow performance**: Enable Vercel Analytics for insights
