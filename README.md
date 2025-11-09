# 🚔 Copsight – Intelligent Policing Analytics & GIS Dashboard

> *AI-powered data intelligence system for police departments* — integrating automated dataset analysis, efficiency prediction, and real-time GIS-based crime visualization.




---

## 🌐 Overview

*Copsight AI* is a next-generation *law enforcement intelligence platform* that helps police departments analyze, predict, and visualize operational performance across districts.

It combines:
- ✅ AI-driven analytics (using Gemini + ML models)
- ✅ Automated report generation
- ✅ District-level efficiency prediction
- ✅ Interactive GIS crime mapping
- ✅ Multilingual document analysis (FIR, case reports)

---

## ⚙ Core Features

### 🔹 1. Automated Data Processing
- Uploads raw `.csv` datasets directly from *CCTNS* or local police drives.
- Automatically cleans and normalizes district-level data.
- Handles multiple domains:
  - NBW Drive
  - Narcotics Drive
  - Convictions
  - Missing Persons
  - Preventive Measures
  - Sand Mining, and more

### 🔹 2. AI/ML Predictions
- Pre-trained machine learning models predict *district efficiency* (0–100% normalized).
- AI highlights:
  - Top and low-performing districts
  - Consistency or anomaly patterns
  - Early-warning predictions for declining performance
- Integrates *Prophet Forecasting* for future trend analysis

### 🔹 3. Automated AI Reports
- Uses *Google Gemini* for intelligent text analysis
- Generates human-readable insights like:
  - “Cuttack shows high efficiency (92%) with consistent upward trend.”
  - “Puri recorded lowest performance; urgent review recommended.”
- Summaries are structured, multilingual, and auto-formatted

### 🔹 4. Visual Analytics Dashboard
Includes:
- 📊 Bar Charts – District-wise predicted performance
- 📈 Line Trends – Month-wise operational growth
- 🌡 Heatmaps – Correlation of performance features
- 📉 Scatter Plots – Actual vs Predicted efficiency
- 🧮 Histograms – Distribution of efficiency across districts

All visuals are dynamically generated and stored in `/generated_graphs`.

### 🔹 5. GIS-Based Crime Mapping
An interactive *Leaflet.js map* showing:
- District-level performance & active drives
- Crime category filters (Narcotics, NBW, Convictions, Missing Persons)
- Clickable map markers displaying case summaries and statistics
- Real-time integration possible with backend APIs

### 🔹 6. Multilingual Legal Analysis (Document Intelligence)
Upload scanned FIRs or PDF documents:
- Auto OCR extraction (using Gemini Vision)
- Detects document language automatically
- Identifies relevant *IPC / CrPC / BNSS* sections
- Suggests *recommendations & missing procedural elements*

---

## 🧩 System Architecture
+--------------------------+
| User Dashboard (React) |
+-----------+--------------+
|
v
+--------------------------+
| FastAPI Backend (Python) |
| ├─ Data Cleaning |
| ├─ ML Prediction |
| ├─ Report Generation |
| └─ Visualization Engine |
+-----------+--------------+
|
v
+--------------------------+
| Gemini AI (LLM & Vision) |
| Prophet Forecasting Model|
| ML Registry & DB Storage |
+--------------------------+


---

## 🧠 Tech Stack

### 🐍 Backend & Machine Learning

The backend is Python-based and handles **data processing, ML inference, REST APIs, and database operations**.

- **Core Language & Utilities:** Python, os, shutil  
- **Data Processing & Analytics:** pandas, numpy  
- **Machine Learning & Time Series:** scikit-learn, prophet, joblib  
- **Database Management:** PostgreSQL  
- **Visualization & Reporting:** matplotlib, seaborn  
- **Web Frameworks / APIs:** Flask, FastAPI, REST API  
- **AI Integration:** Google Generative AI  

> ⚡ **Highlights:** Handles CSV uploads, feature engineering, ML model inference, analytics reporting, and seamless API integration.

### 🖥️ Frontend

The frontend is a **modern, interactive React + TypeScript SPA** with **rich UI components** and GIS capabilities.

- **Languages & Frameworks:** TypeScript, React.js 18  
- **Styling & Design:** Tailwind CSS, Tailwind Plugins (Typography, Animations)  
- **UI Components & Libraries:**  
  - Radix UI (Accessible UI primitives)  
  - Lucide Icons  
  - cmdk (Command Palette)  
  - Recharts (Charts & Data Visualization)  
  - React-Leaflet (Interactive GIS Maps)  
  - input-otp (OTP Input fields)  
  - react-resizable-panels  
  - react-day-picker (Calendar / Date Picker)  
- **State Management & Forms:** React Query, React Hook Form, Zod  
- **Routing & Theming:** React Router DOM, Next-Themes  
- **Build Tools & Utilities:** Vite, ESLint, PostCSS, Autoprefixer, clsx, date-fns, sonner  

> ⚡ **Highlights:** Fully responsive, component-rich frontend with theme support, form validation, charts, maps, and fast development with Vite.

### 🌐 Overall Tech Stack

**Backend / ML / GIS:**
Python, NumPy, pandas, scikit-learn, Prophet, Matplotlib, Seaborn, PostgreSQL, Flask, FastAPI, Google Generative AI, os, shutil, joblib


**Frontend:**
TypeScript, React.js 18, Tailwind CSS, Tailwind Plugins, Radix UI, Lucide Icons, cmdk, Recharts, React-Leaflet, input-otp, react-resizable-panels, react-day-picker, React Query, React Hook Form, Zod, Vite, ESLint, PostCSS, Autoprefixer, Next-Themes, React Router DOM, clsx, date-fns, sonner



---

## 🚀 Getting Started

### 🖥 Prerequisites
- Python 3.10+
- Node.js (v18+)
- npm / yarn
- Google Gemini API Key

---

### 🔧 Backend Setup (FastAPI)

```bash
# Clone the repository
git clone https://github.com/your-username/copsight-ai.git
cd copsight-ai/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # (Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements.txt

# Create a .env file in the backend folder
GOOGLE_API_KEY=your_gemini_api_key_here

# Run the FastAPI server
uvicorn main:app --reload

### 💻 **Frontend Setup (React + Vite)**

cd ../frontend
npm install
npm run dev


Then visit 👉 http://127.0.0.1:5173/

## 🌍 Future Enhancements

We plan to expand *Copsight AI* with the following features:

- 🔁 **Real-time API Integration**  
  Connect directly with CCTNS / NIC dashboards for live data updates.

- 🛰 **Advanced GIS Mapping**  
  Interactive maps with clustering, heatmap density, and real-time performance visualization.

- 🧑‍💼 **Role-Based Access Control**  
  Assign permissions for Officers, Analysts, and Admins for secure operations.

- 🧩 **Smart FIR Understanding**  
  Integrate LangChain + RAG for automated document analysis and recommendations.

- 🔔 **Automated Alerts & Notifications**  
  Email alerts for underperforming districts and critical incidents.

---

## 📜 License

This project is licensed under the **MIT License**
