# 🖼️ VERCEL STATIC FILES - DEPLOYMENT GUIDE

## ⚠️ **PROBLEMA IDENTIFICADO**

Los archivos 404 en Vercel indican que los archivos estáticos no se están sirviendo correctamente. Esto puede deberse a:

1. **Configuración de rutas incorrecta**
2. **Tamaño de archivos (iss_hero.jpg = 2.32MB)**
3. **Configuración de Next.js images**
4. **Missing Vercel Analytics setup**

## 🔧 **SOLUCIONES IMPLEMENTADAS**

### 1. **vercel.json Actualizado**
```json
{
  "routes": [
    {
      "src": "/images/(.*)",
      "dest": "/images/$1"
    },
    {
      "src": "/data/(.*)",
      "dest": "/data/$1"
    }
  ]
}
```

### 2. **Headers para Archivos Estáticos**
```json
{
  "source": "/data/(.*)",
  "headers": [
    {
      "key": "Content-Type",
      "value": "application/json"
    }
  ]
}
```

### 3. **next.config.ts Optimizado**
```typescript
images: {
  unoptimized: false,  // Re-enable optimization
  loader: 'default',
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true
}
```

## 📋 **ARCHIVOS VERIFICADOS**

- ✅ `/public/images/iss_hero.jpg` (2.32 MB)
- ✅ `/public/images/iss_icon.png` (0.62 MB)
- ✅ `/public/data/real_metrics.json`
- ✅ `/public/data/aggregated_stats.json`
- ✅ `/public/data/model_metadata.json`

## 🚀 **PRÓXIMOS PASOS**

1. **Deploy con nuevas configuraciones**
2. **Verificar URLs directas**:
   - `https://tu-dominio.vercel.app/images/iss_hero.jpg`
   - `https://tu-dominio.vercel.app/data/real_metrics.json`
3. **Si persiste el error**: Considerar optimizar imagen hero (< 1MB)

## 🔍 **TROUBLESHOOTING**

Si los archivos siguen dando 404:

### Opción A: Optimizar Imagen Hero
```bash
# Reducir tamaño de imagen
convert iss_hero.jpg -quality 85 -resize 1920x1080 iss_hero_optimized.jpg
```

### Opción B: CDN Externo
Considerar usar un CDN externo para imágenes grandes.

### Opción C: Verificar Vercel Dashboard
- Confirmar que el proyecto tiene Analytics habilitado
- Verificar que los archivos se están subiendo correctamente

---
*Run: `vercel --prod` con estas configuraciones*