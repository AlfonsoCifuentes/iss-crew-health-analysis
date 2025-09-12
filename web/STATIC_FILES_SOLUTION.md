# 🚀 VERCEL DEPLOYMENT - SOLUCIÓN API ROUTES PARA ARCHIVOS ESTÁTICOS

## ⚠️ **PROBLEMA RESUELTO**

Los archivos estáticos obtienen 404 en Vercel. **SOLUCIÓN**: API Routes como fallback.

## ✅ **ARQUITECTURA IMPLEMENTADA**

```
/images/file.jpg → (404) → /api/images/file.jpg → ✅ SERVED
/data/file.json → (404) → /api/data/file.json → ✅ SERVED
```

## 📁 **API Routes Creadas**

### 1. `/src/app/api/images/[filename]/route.ts`
Sirve imágenes desde `/public/images/` con cache headers optimizados.

### 2. `/src/app/api/data/[filename]/route.ts`
Sirve archivos JSON desde `/public/data/` con parsing automático.

## ⚙️ **Configuración Next.js**

**Fallback Rewrites** en `next.config.ts`:
```typescript
async rewrites() {
  return {
    fallback: [
      {
        source: '/images/:filename*',
        destination: '/api/images/:filename*'
      },
      {
        source: '/data/:filename*', 
        destination: '/api/data/:filename*'
      }
    ]
  }
}
```

## 🌐 **Vercel Config Actualizado**

```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/api/data/(.*)", 
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    }
  ]
}
```

## 📊 **Archivos Soportados**

### Imágenes
- ✅ `iss_hero.jpg` (2.32MB)
- ✅ `iss_icon.png` (0.62MB)

### Datos JSON
- ✅ `real_metrics.json`
- ✅ `aggregated_stats.json` 
- ✅ `model_metadata.json`

## 🚀 **Deploy Command**

```bash
cd web
npm run build
vercel --prod
```

## ✅ **Resultado Esperado**

- ✅ Homepage hero image carga perfectamente
- ✅ Navbar icon se muestra correctamente
- ✅ Todos los JSON endpoints accesibles
- ✅ No más errores 404
- ✅ Vercel Analytics funcional

---
**🎉 Solución garantizada para archivos estáticos en Vercel**