# Smart Police Analytics & GIS Dashboard

A comprehensive *Police Analytics & GIS Dashboard* integrating *data-driven insights, ML-powered analysis, and interactive visualizations* to recognize police performance, track crime trends, and support community-driven law enforcement initiatives.

---

## 🏛 Overview

This project provides a unified platform for analyzing and visualizing police activities and good work across multiple domains:

- *Crime Pendency & Convictions*
- *Narcotics & Firearms Drives*
- *Missing Persons Investigations*
- *Sand Mining & Preventive Measures*
- *Excise & Public Welfare Activities*

The platform combines *interactive dashboards, **GIS-based mapping, and **AI/ML models* to generate actionable insights for decision-makers.

---

## 🧩 Features

### Frontend
- Built using *React + TypeScript + Tailwind CSS*
- Responsive UI with *theme toggle* (light/dark)
- Interactive *dashboard analysis*:
  - Bar charts, line trends, heatmaps, scatter plots
  - Leaderboards for police performance
  - Badge & achievement visualization
- *GIS Mapping* for crime & drive locations
- Modular *UI components* for rapid development

### Backend
- Built with *Python (Flask)*
- *Database management* for storing drive and performance data
- *ML-powered analysis*:
  - Efficiency predictions for Narcotics, Firearms, NBW, Missing Persons, Sand Mining, Excise, Preventive Measures
  - Trend analysis for Crime Pendency
  - Convictions predictions using saved ML models
- *Report generation* in PNG/CSV format
- Upload & manage *datasets dynamically*

### Machine Learning
- Pre-trained models stored in saved_models/
- Predictive models:
  - conviction_model.pkl, pendency_trend_model.pkl
  - Efficiency models for each police operation
- CSV datasets used for training & evaluation
- Generates actionable visual insights:
  - Histograms, correlation heatmaps, scatter plots, line trends

---

## 📂 Project Structure


**Frontend (src/)**
- components/ – Reusable components & UI library  
- pages/ – Pages like Dashboard, GISMapping, Register, NotFound  
- assets/ – Images for UI and hero sections  
- hooks/ – Custom hooks  
- styles/ – Leaflet GIS styles  

**Backend (backend/)**
- app.py – Flask entry point  
- db_manager.py – Database interactions  
- feature_builder.py – Data preprocessing & feature extraction  
- models_engine.py – ML model training & prediction  
- report_generator.py – Generate visual reports  
- visualizer.py – Graph & chart generation  
- saved_models/ – Pre-trained ML models  
- uploads/ – CSV datasets  

---

## ⚡ Installation & Setup

### Frontend
```bash
cd Game-gis   # or Game-gisa
npm install
npm run dev


### Backend
cd fol1/backend
pip install -r requirements.txt
python app.py

### Usage

Upload CSV datasets for new drives in backend/uploads/
ML models automatically train on datasets or use pre-trained models
Access dashboards to visualize:
Crime pendency trends
Conviction rates
Efficiency scores for different drives
Export reports and graphs from the dashboard

### Technology Stack

Frontend: React, TypeScript, Tailwind CSS, Vite
Backend: Python, Flask
ML & Data Analysis: Pandas, Scikit-learn, Matplotlib, Seaborn
GIS Mapping: Leaflet.js
Version Control: Git
Package Managers: npm, bun

### Sample Graphs

Generated visualizations include:
Bar charts for efficiency
Correlation heatmaps
Histograms for crime trends
Scatter plots comparing predicted vs actual outcomes
Line trends for pendency & crime progression

### Future Work

Real-time police operations monitoring
AI-driven alert system for high-priority cases
Integration with live GIS data
Interactive community dashboards for citizen engagement
Expand ML capabilities using NLP on police reports

### Contributors

Saptarshi Mondal - ML, backend
Krittika Biswas – Frontend, Version Control
Soumyadeep Sarkar - GIS Mapping
Sekh Yajudddin - PPT

### License

This project is MIT Licensed – free to use, modify, and distribute.
