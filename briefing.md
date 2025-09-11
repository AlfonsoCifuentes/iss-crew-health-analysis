# Análisis retrospectivo de la fisiología de la tripulación de la ISS

Breve descripción: investigar los efectos de la microgravedad en la salud humana usando los conjuntos de datos del Life Sciences Data Archive (LSDA) de la NASA. Objetivo: modelar y predecir cambios fisiológicos (p. ej., pérdida de densidad ósea) para preparar misiones de larga duración y aportar conocimiento a la medicina terrestre.

Fuente de datos principales:
- LSDA (NASA) — búsqueda: https://osdr.nasa.gov/bio/repo/search?q=&data_source=alsda&data_type=study,experiment,subject,biospecimen,payload
- Complementarios (según permisos y licencias):
    - NASA GeneLab (si se añaden ómicas): https://genelab.nasa.gov
    - Human Research Program (HRP) reports públicos
    - Publicaciones indexadas (PubMed) para valores de referencia
    - Datos abiertos comparativos (NHANES para población terrestre: https://www.cdc.gov/nchs/nhanes/)

---

## Objetivos del proyecto
1. Analizar longitudinalmente variaciones fisiológicas pre/intra/post vuelo.
2. Correlacionar duración de misión + factores individuales con degradación (ósea, muscular, cardiovascular).
3. Construir modelos predictivos (riesgo degradación futura, trayectorias esperadas).
4. Extraer implicaciones clínicas terrestres (osteoporosis, sarcopenia, descondicionamiento).
5. Proveer pipeline reproducible con versionado y trazabilidad.

---

## 1. Acceso y adquisición de datos
Pasos:
1. Crear cuenta en OSDR/LSDA: registrar proyecto (título, descripción, propósito científico, uso ético).
2. Revisar restricciones de acceso: algunos datasets requieren solicitud (justificación breve + afiliación).
3. Estrategia de búsqueda:
     - Palabras clave combinadas con filtros (Study / Experiment / Subject).
     - Ejemplos: "bone density", "DEXA", "muscle", "cardiovascular", "radiation", "exercise".
4. Catalogación inicial:
     - Exportar resultados (si portal lo permite) o registrar manualmente: dataset_id, tipo (tabular/imaging), variables clave, rango temporal, número de sujetos.
5. Descarga:
     - Formatos típicos: CSV, XLSX, JSON, imágenes DICOM, MATLAB (.mat).
     - Guardar en estructura:
         data/
             raw/
                 lsda/{dataset_id}/
             external/ (comparativos terrestres)
             interim/
             processed/
6. Registro de metadatos (metadata.json por dataset):
     - Campos: source_url, access_date, license, variable_dictionary, units, consent_flags.
7. Control de versiones:
     - git + DVC (dvc init; dvc add data/raw/lsda/...).
8. Validación de integridad:
     - Checksums (sha256) y script de verificación.
9. Documentar limitaciones (missing visits, tiempos irregulares, ruido instrumental).

Recursos:
- Portal LSDA / API (si disponible).
- Public dataset dictionaries (descargar glosarios).
- Herramientas: curl / requests (Python) para automatizar (si permitido por TOS).

---

## 2. Preprocesamiento y limpieza
Objetivo: transformar datos heterogéneos en estructura homogénea y analizable.

Subpasos:
1. Inventario de variables:
     - Unificar nombres (snake_case), mapear sinónimos (e.g., BMD_total vs bone_density_total).
2. Tipificación:
     - Convertir fechas (UTC normalizado), unidades (ej.: g/cm² → mg/cm² si procede).
     - Tabla de conversión units_map.csv.
3. Manejo de valores faltantes:
     - Clasificar: faltante estructural (no medido) vs incidental (error).
     - Estrategias:
         - Numéricos: media condicionada por sujeto, MICE (IterativeImputer), KNNImputer.
         - Temporales: forward/backward fill solo si intervalo < umbral (ej. 7 días).
         - Etiquetar imputaciones (flag_imputed).
4. Detección de outliers:
     - Regla IQR + z-score + métodos robustos (IsolationForest).
     - Verificación clínica (descartar valores fisiológicamente imposibles).
5. Normalización / escalado:
     - Estandarización por variable (z-score) o robust scaler (si heavy-tailed).
     - Ajuste por covariables (edad, sexo) mediante regresión residual si se busca efecto puro de microgravedad.
6. Alineación temporal:
     - Definir t0 = fecha de lanzamiento.
     - Generar feature days_from_launch, days_from_landing.
     - Re-muestreo (resample) a rejilla común (ej. semanal) con agregaciones (mean, last).
7. Integración multimodal:
     - Tabular + imagen: mantener claves (subject_id, mission_id, visit_date).
     - Generar index maestro (data_index.parquet).
8. Validación de esquema:
     - pydantic o pandera para garantizar tipos y rangos.
9. Logging:
     - Cada transformación con hash de entrada/salida (MLflow o simple CSV log_transformations).

---

## 3. Análisis exploratorio de datos (EDA)
Objetivo: entender distribuciones, relaciones, calidad.

Elementos:
1. Perfilado inicial:
     - pandas-profiling / ydata-profiling (si permitido).
2. Distribuciones:
     - Histogramas BMD, masa magra, VO2max, HRV.
     - Comparar pre vs post (boxplots emparejados).
3. Correlaciones:
     - Matriz Pearson / Spearman (guardar heatmap correlaciones > |0.6|).
     - Red de correlaciones (igraph / networkx) para variables fisiológicas.
4. Trayectorias longitudinales:
     - Spaghetti plots por sujeto (BMD vs días).
     - Suavizado LOESS / spline para tendencia media.
5. Análisis segmentado:
     - Subgrupos: sexo, rango edad, duración misión (<180, 180–300, >300 días).
6. Reducción dimensionalidad:
     - PCA (varianza explicada), UMAP para agrupar perfiles.
7. Detección de patrones:
     - Clustering temporal (DTW + k-means) en trayectorias de BMD.
8. Calidad de datos:
     - Porcentaje de faltantes por variable / visita.
     - Frecuencia de outliers aceptados vs descartados.
9. Documentar hallazgos preliminares (notebook eda_summary.ipynb).

---

## 4. Modelado y análisis predictivo
Problemas y enfoques:

A. Regresión (pérdida % densidad ósea a día N futuro)
     - Features base: baseline_BMD, edad, sexo, duración_misión_prevista, carga_ejercicio_media, radiación_acumulada.
     - Modelos:
         - Baseline: LinearRegression, Ridge, Lasso.
         - Avanzados: Gradient Boosting (XGBoost, LightGBM), ElasticNet.
         - Longitudinal: Mixed Effects (statsmodels MixedLM), modelos panel.
         - Series temporales: TCN, LSTM, Transformer (cuando suficientes puntos).
     - Métricas: RMSE, MAE, MAPE, R². Calibración (pred vs obs).

B. Clasificación (riesgo alta degradación > umbral)
     - Umbral: pérdida > 5% BMD.
     - Modelos: LogisticRegression (baseline), RandomForest, LightGBM.
     - Métricas: AUC, F1, sensibilidad, especificidad, curva PR.

C. Clustering perfiles fisiológicos
     - Input: vectores agregados (slope_BMD, slope_muscle, var_HRV).
     - Métodos: KMeans, HDBSCAN (densidad), Gaussian Mixture (probabilístico).
     - Evaluación: silhouette, Davies-Bouldin, interpretabilidad de centroides.

D. Multimodal (tabular + imagen segmentada)
     - Pipeline: segmentación U-Net → extracción features (volumen cortical, densidad media) → fusión con tabular → modelo tabular avanzado.
     - Early fusion (concatenar embeddings) o late fusion (promedio de logits).

E. Validación:
     - Train/test split por sujeto (GroupKFold).
     - Temporal hold-out (misiones más recientes reservadas).
     - Cross-validation estratificada (riesgo bins).
     - Repetir seeds (N=5) y promediar métricas.

F. Tuning:
     - Optuna: definir study con pruning (median).
     - Guardar mejores hiperparámetros en config/model_x.yaml.

G. Versionado:
     - MLflow: run_id, params, metrics, artifacts (plots, confusion matrices).
     - DVC: dvc.lock enlaza dataset + modelo.

---

## 5. Interpretación y aplicación de resultados
Pasos:
1. Importancia de features: SHAP summary (global) + SHAP dependence (interacciones).
2. Explicaciones locales: SHAP force plot casos extremos.
3. Análisis contrafactual (what-if): modificar duración_misión y simular impacto en BMD_pred.
4. Identificación de factores modificables (ejercicio, dosis radiación mitigable).
5. Síntesis para contramedidas: priorizar variables con alta contribución y capacidad de intervención.
6. Traducción terrestre:
     - Comparar tasas de pérdida con cohortes osteoporosis (literatura).
     - Señalar diferencias de aceleración de degradación.

---

## Herramientas y librerías sugeridas
- Ingesta: requests, aiohttp (descarga paralela), tqdm.
- Procesamiento: pandas, numpy, polars (rendimiento), pandera (validación).
- Series temporales: tsfresh, statsmodels, sktime.
- ML: scikit-learn, xgboost, lightgbm, catboost.
- DL: PyTorch, PyTorch Lightning, MONAI (imágenes médicas).
- Visión: scikit-image, OpenCV, albumentations.
- Interpretabilidad: shap, captum.
- Orquestación: make, tox, pre-commit, prefect / airflow (opcional).
- Versionado: git, DVC, MLflow, Weights & Biases (alternativa).
- Deploy: FastAPI, Docker.

---

## Próximos pasos sugeridos
1. Consolidar diccionario de variables maestro.
2. Descargar y validar dataset mínimo viable (MVP) para pipeline end-to-end.
3. Implementar skeleton de repositorio:
     - src/
         data/
         features/
         models/
         visualization/
     - notebooks/
     - configs/
4. Construir pipeline reproducible ingestion → clean → features → train → evaluate.
5. Establecer baseline métricas (regresión y clasificación).
6. Añadir interpretabilidad y reporting automático.
7. Iterar con modelos avanzados (multimodal) solo tras estabilizar datos.

---

## Ampliación técnica y práctica

### Diseño del estudio y variables clave
- Cohortes: agrupar por duración misión y perfil ejercicio.
- Variable objetivo primaria: delta_BMD_% (pre vs post normalizada por baseline).
- Covariables: edad, sexo, masa corporal, radiación acumulada estimada, carga semanal de ejercicio (min resistencia, min cardio), suplementación (si existe).
- Derivadas:
    - slope_bmd (regresión lineal sobre tiempo)
    - recovery_rate_post (pendiente primeros 90 días post)
    - hrv_variability (SDNN, RMSSD)
    - muscle_loss_rate (kg/mes)
    - composite_risk_score (weighted z-sum)

### Esquema de datos
- Campos mínimos: subject_id, mission_id, visit_id, visit_date, phase (pre, inflight, post), measurement_type, value, unit, device, quality_flag.
- Tabla de mapping units (units_map.csv) + controlled vocabulary (ontology.csv).
- Validación: no duplicados (subject_id + mission_id + measurement_type + visit_date).

### Preprocesamiento avanzado
- MICE: IterativeImputer(n_nearest_features=15).
- Normalización longitudinal: centrar cada sujeto por valor baseline (valor_relativo = valor / baseline - 1).
- Alineación eventos: anclar a hito (día 0 = lanzamiento, día L = aterrizaje).
- Imágenes:
    - Segmentación U-Net preentrenada (ajuste fino con few-shot si pocos datos etiquetados).
    - Extracción densidad: promedio intensidades ROI (normalizar por phantom si disponible).
- Control de calidad automático (descartar imágenes borrosas usando Laplacian variance threshold).

### Ingeniería de características
- tsfresh: extracción masiva → selección (Benjamini-Hochberg FDR).
- Agregados temporales: mean_30d, slope_30d, volatility_30d.
- Interacciones: edad * duración_misión, ejercicio_resistencia * ejercicio_cardio.
- Embeddings de imagen (ResNet50 congelada) + PCA (var 95%).

### Pipeline ML/DL
- Config central (YAML): rutas, seeds, hiperparámetros.
- Scripts:
    - make data (descarga y validación)
    - make features
    - make train
    - make evaluate
- Reentrenamiento: triggered si hash datos cambia.
- Persistencia: modelos en models/{model_name}/version/.

### Arquitecturas recomendadas
- Tabular: LightGBM (maneja missing + velocidad).
- Series: TemporalFusionTransformer (si dataset suficiente).
- Imágenes: nnU-Net (auto-config), lightweight U-Net custom si GPU limitada.
- Multimodal: concatenar embedding imagen (dim 256) + tabular escalado → MLP (dropout + batchnorm).

### Evaluación y métricas
- Crear evaluation_report.json con:
    - metrics_regression: {rmse, mae, r2}
    - metrics_classification: {auc, f1, sensitivity, specificity}
    - calibration: expected_vs_observed bins
- Intervalos de confianza (bootstrap 1000 réplicas).
- Drift monitor: comparar distribución features nuevas vs baseline (KS test).

### Interpretabilidad y confiabilidad
- SHAP summary (top 20 features).
- Stability: comparar top features entre folds (Jaccard).
- Uncertainty: ensemble (5 modelos random seeds) → std pred.
- Flag predicciones con alta incertidumbre para revisión.

### Visualizaciones y reporting
- Dashboard (Streamlit):
    - Selector sujeto → curvas BMD y HRV.
    - Mapa calor correlaciones dinámico.
    - Vista segmentación (overlay máscara).
- Reporte automático (notebook → nbconvert) con versión de datos y git commit hash.
- Comparador de experimentos (MLflow UI).

### Despliegue y reproducibilidad
- Dockerfile (base: python:3.11-slim, instalar system deps).
- requirements.txt + environment.yml.
- Pre-commit: black, isort, flake8, mypy (tipado gradual).
- CICD (GitHub Actions):
    - Lint + tests
    - Entrenamiento ligero (subset) smoke test
    - Empaquetado artefactos.

### Ética, privacidad y gobernanza
- Pseudonimizar sujetos (hash + salt).
- Access control: .env con rutas privadas fuera del repo público.
- Registro de uso de datos (log_access.csv).
- Documentar limitaciones (n pequeño, sesgo selección astronautas, extrapolación limitada a población general).

### Infraestructura
- GPU recomendada: NVIDIA (>=12GB VRAM para segmentación cómoda).
- Almacenamiento: datos crudos read-only; processed versionados.
- Backups automáticos (cron + rclone → almacenamiento seguro).
- Monitoreo (si despliegue API): logs structured (JSON), métricas Prometheus.

### Plan de trabajo (iterativo)
Semana 1–2: Acceso + diccionario + ingestión MVP  
Semana 3–4: Limpieza + EDA + baseline regresión  
Semana 5–6: Modelos avanzados + interpretabilidad  
Semana 7–8: Segmentación imágenes + integración multimodal  
Semana 9–10: Validación robusta + dashboard + documentación final

### Entregables
- data dictionary (data_dictionary.md)
- schema validator (schema.py)
- notebooks (eda, modeling, interpretability)
- models/ (artefactos + firmas)
- dashboard (app.py)
- technical report (report.pdf / HTML)
- reproducibility guide (REPRODUCIBILITY.md)

### Recomendación final
Priorizar calidad y trazabilidad de datos, establecer baselines sólidos y solo entonces incorporar complejidad (multimodalidad, DL). Mantener interpretabilidad y control de sesgos como criterio obligatorio antes de despliegue.

--- 

## Ejemplo de estructura de repositorio
.
├─ data/
│  ├─ raw/
│  ├─ interim/
│  └─ processed/
├─ src/
│  ├─ data/ (ingest, validate)
│  ├─ features/ (engineering)
│  ├─ models/ (train, predict)
│  └─ visualization/
├─ configs/
├─ notebooks/
├─ models/
├─ reports/
└─ scripts/

---

## Ejemplo mínimo de script de entrenamiento (esquema)
from sklearn.model_selection import GroupKFold
from lightgbm import LGBMRegressor
import pandas as pd, mlflow, shap

df = pd.read_parquet('data/processed/training.parquet')
X = df.drop(columns=['target','subject_id'])
y = df['target']
groups = df['subject_id']
gkf = GroupKFold(n_splits=5)
mlflow.start_run()
oof = []
for fold,(tr,va) in enumerate(gkf.split(X,y,groups)):
        model = LGBMRegressor(n_estimators=800, learning_rate=0.02)
        model.fit(X.iloc[tr], y.iloc[tr],
                            eval_set=[(X.iloc[va], y.iloc[va])],
                            eval_metric='l2',
                            callbacks=[])
        # guardar métricas parciales
mlflow.end_run()

---

## Lista de control (checklist)
- Acceso LSDA obtenido
- Diccionario variables consolidado
- Esquema validado
- Pipeline ingestión reproducible
- Limpieza + imputación documentadas
- EDA completo (notebook + summary)
- Baselines (regresión + clasificación) con métricas
- Interpretabilidad (SHAP) integrada
- Segmentación imagen validada (si aplica)
- Modelos avanzados versionados
- Dashboard operativo
- Reporte final y guía reproducibilidad

---

## Riesgos y mitigación
- N limitado → usar modelos regulares y validación estricta.
- Heterogeneidad mediciones → normalización + ajuste por dispositivo.
- Overfitting multimodal → early stopping + regularización + dropout.
- Sesgo selección (astronautas sanos) → documentar limitación en extrapolación.

---

## Criterios de éxito
- RMSE pérdida BMD < umbral clínico definido (ej. <1.5% error absoluto).
- AUC clasificación riesgo > 0.80 con buena calibración.
- Explicaciones consistentes entre folds (Jaccard > 0.6 features top).
- Reproducibilidad (pipeline se ejecuta clean en entorno aislado).
- Documentación completa y navegable.

---

Fin del desglose operativo ampliado.
