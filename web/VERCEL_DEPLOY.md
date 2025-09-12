# 🚀 Deploy ISS Crew Health Analysis to Vercel

## 📝 Cambios Realizados para Arreglar Traducciones e Imágenes

### ✅ Traducciones Completadas
- ✅ **Sección `home`**: Todas las claves añadidas (description, getStarted, runSimulations, etc.)
- ✅ **Sección `dashboard`**: Claves faltantes añadidas (totalCrewMembers, activeInAnalysis, realtimeHealthMetrics, etc.)
- ✅ **Sección `settings`**: Título añadido ("Settings"/"Configuración")
- ✅ **Sección `missionTypes`**: Claves para tipos de misión añadidas
- ✅ **Sección `risk`**: Claves para simulador de riesgos añadidas
- ✅ **Todas las traducciones**: Inglés ✅ Español ✅

### 🖼️ Problema de Imágenes en Vercel SOLUCIONADO
**Problema**: `output: 'standalone'` en `next.config.ts` causaba problemas con imágenes estáticas en Vercel
**Solución**: Comentado la línea `output: 'standalone'` para deployment en Vercel

```typescript
// Output optimization - commented out for Vercel deployment  
// output: 'standalone',
```

### 🛠️ Configuraciones Optimizadas para Vercel
- ✅ **next.config.ts**: Output standalone deshabilitado
- ✅ **vercel.json**: Headers para imágenes configurados
- ✅ **Imágenes**: Correctamente ubicadas en `/public/images/`
- ✅ **Referencias**: Rutas de imágenes correctas `/images/`

## 🚀 Comandos de Deploy

### 1. Build Local Exitoso ✅
```bash
cd web
npm run build
```

### 2. Deploy a Vercel
```bash
# Install Vercel CLI si no está instalado
npm i -g vercel

# Login a Vercel
vercel login

# Deploy desde la carpeta web
cd web  
vercel --prod
```

## 📊 Estado Actual
- **Build**: ✅ Exitoso (todas las páginas generadas correctamente)
- **Traducciones**: ✅ Completas (sin claves faltantes)  
- **Imágenes**: ✅ Configuradas para Vercel
- **Performance**: ✅ Optimizada (147KB shared JS)

## 🌍 Páginas Generadas
```
Route (app)                         Size  First Load JS
┌ ○ /                            4.66 kB         140 kB
├ ○ /analysis                    7.66 kB         182 kB  
├ ○ /dashboard                   75.9 kB         250 kB
├ ○ /simulators                  4.79 kB         141 kB
├ ○ /astronauts                  6.98 kB         181 kB
└ ... (17 páginas total)
```

## ⚠️ Notas Importantes
- Las imágenes ahora deberían cargarse correctamente en Vercel
- Todas las traducciones funcionan en inglés y español
- El sistema de cambio de idioma está completamente funcional
- Build optimizado para producción en Vercel