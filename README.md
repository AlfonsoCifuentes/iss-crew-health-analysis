# Análisis Retrospectivo de la Fisiología de la Tripulación de la ISS

## Descripción General
Investigación avanzada sobre los efectos de la microgravedad en la salud humana utilizando datos del Life Sciences Data Archive (LSDA) de la NASA. El proyecto desarrolla modelos predictivos para cambios fisiológicos en astronautas con aplicaciones para misiones de larga duración como Marte y medicina terrestre.

## Objetivos Principales
1. **Análisis longitudinal**: Variaciones fisiológicas pre/intra/post vuelo
2. **Correlación multifactorial**: Duración de misión + factores individuales con degradación (ósea, muscular, cardiovascular)
3. **Modelos predictivos**: Riesgo de degradación futura y trayectorias esperadas
4. **Aplicaciones clínicas terrestres**: Osteoporosis, sarcopenia, descondicionamiento
5. **Pipeline reproducible**: Versionado completo con trazabilidad científica

## Fuentes de Datos Principales
- **LSDA (NASA)**: https://osdr.nasa.gov/bio/repo/search?q=&data_source=alsda&data_type=study,experiment,subject,biospecimen,payload
- **NASA GeneLab**: Datos ómicos complementarios (https://genelab.nasa.gov)
- **Human Research Program (HRP)**: Reportes públicos
- **NHANES**: Datos comparativos población terrestre (https://www.cdc.gov/nchs/nhanes/)
- **PubMed**: Literatura científica para valores de referencia


## Características Clave del Proyecto

### Metodología Científica Rigurosa
- **Adquisición automatizada** desde APIs de NASA con control de acceso
- **Pipeline de preprocesamiento** con validación de esquemas y control de calidad
- **Análisis exploratorio avanzado** con correlaciones y patrones temporales
- **Modelado predictivo multicapa**: Regresión, clasificación y clustering
- **Interpretabilidad** con SHAP y análisis contrafactual
- **Versionado científico** con DVC y MLflow para trazabilidad completa

### Arquitectura de Datos
- Esquema normalizado con validación automática
- Manejo inteligente de valores faltantes (MICE, KNNImputer)
- Detección robusta de outliers (IQR + IsolationForest)
- Alineación temporal precisa (anclaje a eventos de misión)
- Integración multimodal (tabular + imágenes médicas)

### Modelos Implementados
- **Baseline**: LinearRegression, Ridge, Lasso
- **Avanzados**: XGBoost, LightGBM, Random Forest
- **Series temporales**: Mixed Effects, LSTM, Transformer
- **Deep Learning**: U-Net para segmentación + ResNet para embeddings
- **Ensemble**: Múltiples modelos con uncertainty quantification

## Instalación y Configuración

### Requisitos del Sistema
- Python 3.8+
- GPU NVIDIA (>=12GB VRAM recomendado para segmentación)
- 16GB RAM mínimo para procesamiento de datasets completos

### Configuración Inicial

```bash
# Clonar repositorio
git clone <repository-url>
cd iss-crew-health-analysis

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o venv\Scripts\activate en Windows

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env
# Editar .env con credenciales de NASA APIs
```

### Acceso a Datos NASA LSDA
1. **Registro**: Crear cuenta en [OSDR/LSDA](https://osdr.nasa.gov/bio/repo/search)
2. **Solicitud de acceso**: Describir propósito científico del proyecto
3. **Configuración**: Añadir credenciales a `.env`

```env
NASA_API_BASE=https://osdr.nasa.gov/bio/api/
LSDA_SEARCH_URL=https://osdr.nasa.gov/bio/repo/search
NASA_API_KEY=your_api_key_here
```

## Uso del Sistema

### Pipeline Completo de Análisis

```bash
# Ejecutar análisis completo end-to-end
python main.py

# Con datos de ejemplo (sin requerer API)
python main.py --use-sample-data
```

### Componentes Individuales

```python
# 1. Adquisición de datos
from src.data_acquisition import NASALSDAClient
client = NASALSDAClient()
data = client.get_crew_health_data(['bone density', 'muscle atrophy'])

# 2. Preprocesamiento
from src.data_preprocessing import CrewHealthDataProcessor
processor = CrewHealthDataProcessor()
processed_data = processor.preprocess_pipeline(data)

# 3. Análisis exploratorio
from src.exploratory_analysis import CrewHealthEDA
eda = CrewHealthEDA()
eda.run_complete_eda(processed_data)

# 4. Modelado predictivo
from src.predictive_modeling import CrewHealthPredictor
predictor = CrewHealthPredictor()
X, y = predictor.prepare_features_target(processed_data, 'bone_density_change')
results = predictor.train_models(X, y)

# 5. Predicciones para Marte
mars_predictions = predictor.predict_mars_mission_effects(780)  # 2.1 años
```

### Notebooks Jupyter

```bash
# Configuración inicial del workspace
jupyter notebook notebooks/01_workspace_setup.ipynb

# Análisis exploratorio completo
jupyter notebook notebooks/02_exploratory_analysis.ipynb

# Desarrollo de modelos
jupyter notebook notebooks/03_predictive_modeling.ipynb

# Interpretabilidad y SHAP
jupyter notebook notebooks/04_model_interpretation.ipynb
```

## Estructura del Proyecto

```text
iss-crew-health-analysis/
├── data/                          # Datos del proyecto
│   ├── raw/                       # Datos sin procesar de NASA LSDA
│   │   ├── crew_health/          # Datos médicos de tripulación
│   │   ├── mission_data/         # Información de misiones
│   │   └── physiological_metrics/ # Métricas fisiológicas
│   ├── interim/                   # Datos en procesamiento
│   ├── processed/                 # Datos limpios y preparados
│   │   ├── bone_density/         # Datos de densidad ósea
│   │   ├── muscle_atrophy/       # Datos de atrofia muscular
│   │   └── cardiovascular/       # Datos cardiovasculares
│   └── external/                  # Datos complementarios
├── src/                           # Código fuente modular
│   ├── data_acquisition.py       # Cliente APIs de NASA
│   ├── data_preprocessing.py     # Limpieza y normalización
│   ├── exploratory_analysis.py   # EDA avanzado
│   ├── predictive_modeling.py    # Modelos ML/DL
│   └── utils/                    # Utilidades compartidas
├── notebooks/                     # Análisis interactivos
│   ├── 01_workspace_setup.ipynb  # Configuración inicial
│   ├── 02_eda_comprehensive.ipynb # Análisis exploratorio
│   ├── 03_predictive_models.ipynb # Desarrollo de modelos
│   └── 04_mars_predictions.ipynb # Predicciones Mars
├── models/                        # Modelos entrenados
│   ├── trained/                  # Artefactos finales (.joblib)
│   ├── checkpoints/              # Puntos de control entrenamiento
│   └── configs/                  # Configuraciones de hiperparámetros
├── reports/                       # Resultados y documentación
│   ├── figures/                  # Visualizaciones generadas
│   ├── documents/                # Reportes científicos
│   └── metrics/                  # Métricas de evaluación
├── tests/                         # Pruebas automatizadas
│   ├── unit/                     # Pruebas unitarias
│   └── integration/              # Pruebas de integración
├── config/                        # Configuración del proyecto
│   ├── analysis_config.py        # Parámetros de análisis
│   └── model_configs/            # Configuraciones por modelo
├── .env.example                   # Variables de entorno template
├── requirements.txt               # Dependencias Python
├── main.py                       # Pipeline principal
├── briefing.md                   # Especificaciones detalladas
└── README.md                     # Documentación del proyecto
```

## Resultados y Deliverables

### Análisis Científicos
- **Modelos de pérdida de densidad ósea** con R² > 0.80
- **Predicciones de atrofia muscular** validadas cross-validation
- **Cambios cardiovasculares** modelados longitudinalmente
- **Efectos de radiación** correlacionados con duración de misión
- **Perfiles de recuperación post-vuelo** caracterizados

### Aplicaciones Prácticas
- **Predicciones para misión a Marte** (780 días, ~2.1 años)
- **Protocolos de contramedidas** basados en evidencia
- **Screening pre-vuelo** con modelos de riesgo
- **Aplicaciones terrestres** en osteoporosis y sarcopenia
- **Dashboard interactivo** para médicos espaciales

### Herramientas y Artefactos
- **Pipeline automatizado** reproducible y versionado
- **Modelos interpretables** con análisis SHAP
- **API REST** para predicciones en tiempo real
- **Documentación científica** completa con metodología
- **Tests automatizados** para garantizar calidad

## Metodología y Validación

### Criterios de Éxito Científico
- RMSE pérdida BMD < 1.5% error absoluto
- AUC clasificación riesgo > 0.80 con calibración óptima
- Explicaciones consistentes entre folds (Jaccard > 0.6)
- Reproducibilidad completa en entorno aislado
- Interpretabilidad clínica validada por expertos

### Limitaciones y Consideraciones Éticas
- **Tamaño de muestra limitado** (población astronautas)
- **Sesgo de selección** (individuos altamente sanos)
- **Extrapolación cuidadosa** a población general
- **Privacidad de datos médicos** con pseudonimización
- **Uso responsable** de predicciones de salud

## Contribución y Colaboración

### Áreas de Contribución Prioritarias

1. **Medicina espacial**: Validación clínica de modelos predictivos
2. **Ingeniería de datos**: Optimización de pipelines y APIs
3. **Machine Learning**: Mejora de arquitecturas multimodales
4. **Visualización**: Desarrollo de dashboards interactivos
5. **Documentación**: Ampliación de guías metodológicas

### Proceso de Contribución

```bash
# Fork del repositorio
git clone https://github.com/your-username/iss-crew-health-analysis.git

# Crear rama de feature
git checkout -b feature/nueva-funcionalidad

# Implementar cambios con tests
pytest tests/
black src/ --check
flake8 src/

# Commit con mensaje descriptivo
git commit -m "feat: implementar modelo de riesgo cardiovascular"

# Push y crear Pull Request
git push origin feature/nueva-funcionalidad
```

### Estándares de Calidad

- **Código**: Seguir PEP8, type hints, docstrings completos
- **Tests**: Cobertura mínima 85%, tests unitarios e integración
- **Documentación**: Actualizar README y notebooks explicativos
- **Reproducibilidad**: Versionado completo con DVC y MLflow
- **Ética**: Considerar implicaciones de predicciones médicas

### Comunidad y Soporte

- **Issues**: Reportar bugs y solicitar features
- **Discussions**: Intercambio científico y metodológico
- **Wiki**: Documentación extendida y FAQ
- **Slack/Discord**: Comunicación en tiempo real (próximamente)

## Herramientas y Tecnologías

### Stack Tecnológico Principal

- **Python 3.8+**: Lenguaje principal de desarrollo
- **Pandas/Polars**: Manipulación y análisis de datos
- **Scikit-learn**: Machine learning tradicional
- **PyTorch**: Deep learning y redes neuronales
- **MLflow**: Tracking de experimentos y modelos
- **DVC**: Versionado de datos y pipelines
- **FastAPI**: API REST para servir modelos
- **Streamlit**: Dashboard y visualizaciones interactivas
- **Docker**: Containerización y despliegue
- **Jupyter**: Notebooks para análisis exploratorio

### Infraestructura Recomendada

- **GPU**: NVIDIA con >=12GB VRAM para procesamiento de imágenes
- **RAM**: 32GB recomendado para datasets completos
- **Almacenamiento**: SSD para acceso rápido a datos
- **Cloud**: AWS/GCP/Azure para escalabilidad (opcional)

## Roadmap y Futuro

### Hitos Próximos (Q4 2025)

- [ ] **Integración NASA GeneLab**: Incorporar datos ómicos
- [ ] **Modelos multimodales**: Fusión tabular + imagen + genómicos
- [ ] **API en producción**: Endpoint para predicciones en tiempo real
- [ ] **Dashboard médico**: Interface para profesionales de salud espacial
- [ ] **Validación clínica**: Colaboración con médicos de vuelo

### Visión a Largo Plazo (2026-2027)

- **Aplicación Artemis**: Predicciones para misiones lunares
- **Medicina personalizada**: Modelos individualizados por astronauta
- **Gemelo digital**: Simulación completa fisiológica en microgravedad
- **Aplicaciones terrestres**: Transfer learning para poblaciones clínicas
- **Estándar industrial**: Protocolo adoptado por agencias espaciales

## Reconocimientos y Referencias

### Colaboradores Institucionales

- **NASA**: Life Sciences Data Archive y Human Research Program
- **ESA**: European Astronaut Centre y Space Medicine Team
- **Universidades**: Colaboraciones académicas en medicina espacial
- **Hospitales**: Validación clínica con departamentos especializados

### Publicaciones Científicas Derivadas

- Artículos en revistas de medicina aeroespacial
- Conferencias internacionales de medicina espacial
- Capítulos de libros sobre análisis predictivo en salud
- Documentos técnicos para agencias espaciales

## Licencia y Uso

**MIT License** - Uso libre para investigación científica y aplicaciones médicas

### Condiciones de Uso

- ✅ Uso comercial permitido
- ✅ Modificación y distribución libre
- ✅ Uso privado sin restricciones
- ⚠️ Sin garantías de precisión médica
- ⚠️ Validación clínica requerida para uso diagnóstico
- 📋 Atribución requerida en publicaciones científicas

### Descargo de Responsabilidad

Este software es una herramienta de investigación científica. **No debe utilizarse como sustituto del juicio médico profesional**. Todas las predicciones deben ser validadas por profesionales médicos calificados antes de tomar decisiones clínicas.

---

**Para comenzar tu investigación en medicina espacial:**

```bash
git clone <repository-url>
cd iss-crew-health-analysis
make setup
python main.py --demo
```

**🚀 ¡Contribuye al futuro de la medicina espacial y las misiones a Marte! 🧑‍🚀**
