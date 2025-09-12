# 🚀 ISS Crew Health Analysis

> Advanced AI-powered health monitoring system for International Space Station missions

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11-green.svg)](https://www.python.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 Overview

This project provides comprehensive health monitoring and analysis for ISS crew members using real NASA LSDA data. Features advanced machine learning models for bone density prediction, interactive dashboards, and Mars mission simulation capabilities.

## 🛠️ Tech Stack

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Python (pandas, numpy, scikit-learn)
- **Visualization**: Chart.js, D3.js
- **Deployment**: Vercel
- **Data Source**: NASA Life Sciences Data Archive (LSDA)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AlfonsoCifuentes/iss-crew-health-analysis.git
cd iss-crew-health-analysis

# Install Python dependencies
pip install -r requirements.txt

# Install web dependencies
cd web
npm install
```

### Development

```bash
# Run Python pipeline
python main.py

# Start web development server
cd web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📊 Features

- **Real-time Health Monitoring**: Live crew health metrics visualization
- **AI-Powered Predictions**: Bone density and health risk assessment
- **Mars Mission Simulator**: Long-duration mission health impact analysis  
- **Interactive Dashboard**: Comprehensive data exploration tools
- **Export Capabilities**: PDF reports and data export functionality
- **Multi-language Support**: English and Spanish interfaces

## 🧬 Data Science Pipeline

1. **Data Acquisition**: NASA LSDA real astronaut health data
2. **Preprocessing**: Advanced data cleaning and feature engineering
3. **Machine Learning**: Random Forest models for health predictions
4. **Visualization**: Interactive charts and statistical analysis

## 📁 Project Structure

```
├── data/                   # Processed datasets
├── models/                 # Trained ML models
├── src/                    # Python analysis modules
├── web/                    # Next.js frontend application
├── reports/                # Generated analysis reports
└── notebooks/              # Jupyter analysis notebooks
```

## 🚀 Deployment

The application is deployed on Vercel with automatic CI/CD pipeline:

```bash
# Deploy to Vercel
cd web
npm run deploy
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Alfonso Cifuentes Alonso**

- GitHub: [@AlfonsoCifuentes](https://github.com/AlfonsoCifuentes)
- LinkedIn: [Alfonso Cifuentes Alonso](https://linkedin.com/in/alfonso-cifuentes-alonso)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/AlfonsoCifuentes/iss-crew-health-analysis/issues).

## ⭐ Show your support

Give a ⭐️ if this project helped you!

---

*© 2025 Alfonso Cifuentes Alonso. All rights reserved.*
