# 🚓 CopSight - Smart Police Analytics & GIS Dashboard

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-2.2-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python)

A comprehensive Police Analytics & GIS Dashboard integrating data-driven insights, ML-powered analysis, and interactive visualizations to recognize police performance, track crime trends, and support community-driven law enforcement initiatives.

[Features](#-features) • [Installation](#-installation--setup) • [Usage](#-usage) • [API](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🏛️ Overview

**CopSight** is a unified platform designed for law enforcement agencies to analyze and visualize police activities, performance metrics, and crime data across multiple operational domains:

- 🔍 **Crime Pendency & Convictions Tracking**
- 💊 **Narcotics & Firearms Operations**
- 👤 **Missing Persons Investigations**
- ⛏️ **Sand Mining & Environmental Enforcement**
- 🍺 **Excise & Public Welfare Activities**
- 🛡️ **Preventive Measures & Community Policing**

The platform combines interactive dashboards, GIS-based mapping, AI/ML predictive models, and a community engagement module to generate actionable insights for decision-makers and field officers.

---

## ✨ Features

### 🎨 Frontend Application

- **Modern Tech Stack**: Built with React 18, TypeScript, Tailwind CSS, and Vite for blazing-fast performance
- **Responsive Design**: Fully responsive UI with light/dark theme support using `next-themes`
- **Rich UI Components**: Powered by Radix UI and shadcn/ui component library
- **Interactive Dashboards**:
  - 📊 Real-time analytics with Recharts visualizations
  - 📈 Bar charts, line trends, heatmaps, and scatter plots
  - 🏆 Officer leaderboards and performance rankings
  - 🎖️ Badge and achievement visualization system
- **GIS Mapping**: Interactive maps using Leaflet.js for crime hotspots and operational areas
- **Document Analysis**: Upload and analyze case documents with AI-powered insights
- **Community Module**: Social feed for sharing success stories and collaboration
- **Authentication**: Secure user registration and login system

### 🔧 Backend Services

- **FastAPI Framework**: High-performance async API built with FastAPI 2.2
- **Database Management**: PostgreSQL with SQLAlchemy ORM
  - User authentication with bcrypt password hashing
  - AI predictions storage and retrieval
  - Community posts, comments, and likes system
- **ML-Powered Analytics**:
  - Efficiency predictions for 8+ operational categories
  - Crime pendency trend analysis using Prophet
  - Conviction rate predictions
  - Automated feature engineering and model training
- **Report Generation**: Automated visual reports with graphs and statistics
- **Document Intelligence**: AI-powered document analysis using Google Gemini
- **GIS Integration**: Geocoding and location-based analytics

### 🤖 Machine Learning Models

- **Pre-trained Models** (stored in `abc/saved_models/`):
  - `conviction_model.pkl` - Predict conviction outcomes
  - `pendency_trend_model.pkl` - Crime pendency forecasting
  - Efficiency models for Narcotics, Firearms, NBW, Missing Persons, Sand Mining, Excise, OPG, and Preventive operations
- **Automated Pipeline**:
  - Feature extraction and preprocessing
  - Model training and evaluation
  - Real-time inference on uploaded datasets
- **Visualization Engine**: Generate correlation heatmaps, histograms, scatter plots, and trend lines

---

## 📂 Project Structure

```
copsight-police-app/
├── abc/
│   ├── frontend/                    # React + TypeScript Frontend
│   │   ├── src/
│   │   │   ├── components/         # Reusable UI components
│   │   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   │   ├── landing/        # Landing page components
│   │   │   │   ├── layout/         # Layout components (Header, Footer)
│   │   │   │   └── ui/             # shadcn/ui component library
│   │   │   ├── pages/              # Main application pages
│   │   │   │   ├── Dashboard.tsx   # Main dashboard with analysis
│   │   │   │   ├── Index.tsx       # Landing page
│   │   │   │   ├── Register.tsx    # User registration
│   │   │   │   └── NotFound.tsx    # 404 page
│   │   │   ├── contexts/           # React contexts (Theme, Analysis)
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   ├── lib/                # Utility functions
│   │   │   ├── assets/             # Images and static assets
│   │   │   └── styles/             # Global styles
│   │   ├── public/                 # Public static files
│   │   ├── package.json            # Frontend dependencies
│   │   ├── vite.config.ts          # Vite configuration
│   │   ├── tailwind.config.ts      # Tailwind CSS configuration
│   │   └── tsconfig.json           # TypeScript configuration
│   │
│   ├── backend/                     # FastAPI Backend
│   │   ├── app.py                  # Main FastAPI application
│   │   ├── auth_routes.py          # Authentication endpoints
│   │   ├── db_manager.py           # Database operations
│   │   ├── models_engine.py        # ML model inference
│   │   ├── model_registry.py       # Model loading and registry
│   │   ├── feature_builder.py      # Data preprocessing
│   │   ├── visualizer.py           # Graph generation
│   │   ├── report_generator.py     # Report creation
│   │   ├── document_analyzer.py    # AI document analysis
│   │   ├── geo_mapper.py           # GIS geocoding
│   │   └── requirements.txt        # Python dependencies
│   │
│   ├── saved_models/                # Pre-trained ML models (.pkl files)
│   ├── synthetic_cctns_datasets/    # Training datasets (CSV files)
│   └── generated_graphs/            # Generated visualization outputs
│
├── LICENSE                          # MIT License
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** 18+ and npm (or Bun)
- **Python** 3.9+
- **PostgreSQL** 12+
- **Git**

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd abc/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Access the application**:
   - Open browser at `http://localhost:8080`

5. **Build for production**:
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd abc/backend
   ```

2. **Create virtual environment** (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database** (update in `db_manager.py`):
   ```python
   DB_USER = "your_db_user"
   DB_PASSWORD = "your_db_password"
   DB_HOST = "localhost"
   DB_PORT = "5432"
   DB_NAME = "postgres"
   ```

5. **Set up environment variables** (create `.env` file):
   ```bash
   GOOGLE_API_KEY=your_google_gemini_api_key
   ```

6. **Run the server**:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Verify server is running**:
   - Visit `http://localhost:8000` - should return: `{"message": "🚓 Hack4Safety AI Backend running successfully."}`
   - API docs available at `http://localhost:8000/docs`

### Database Initialization

The application automatically creates required tables on first run:
- `users` - User authentication and profiles
- `ai_predictions` - ML prediction results and analysis
- `community_posts` - Community feed posts
- `community_likes` - Post likes tracking
- `community_comments` - Post comments

---

## 📖 Usage

### 1. Register a New Officer

- Navigate to `/register`
- Fill in officer details (name, police ID, email, rank, district)
- Accept terms and conditions
- Submit registration

### 2. Login to Dashboard

- Use police ID and password to login
- Access the main dashboard with analytics

### 3. Upload Datasets for Analysis

Use the predict endpoint to upload CSV datasets:

```bash
curl -X POST "http://localhost:8000/predict/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@datasets/Narcotics_Drive.csv" \
  -F "dataset_name=Narcotics"
```

Supported dataset types:
- `Narcotics`, `Firearms`, `MissingPersons`, `NBW`, `Sand_Mining`, `Excise`, `OPG`, `PreventiveMeasures`, `Convictions`, `CrimePendency`

### 4. Analyze Documents

Upload FIR reports, case documents, or investigation files:

```bash
curl -X POST "http://localhost:8000/analyze_case_document/" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@documents/case_report.pdf"
```

Supported formats: PDF, TXT, JPG, PNG

### 5. View GIS Mapping

- Click "GIS Mapping" in dashboard sidebar
- Interactive map shows operational locations
- Color-coded markers indicate efficiency bands:
  - 🟢 Green: High efficiency (85%+)
  - 🟡 Yellow: Moderate efficiency (75-84%)
  - 🔴 Red: Watch list (<75%)

### 6. Community Engagement

- Share success stories and best practices
- Like and comment on posts
- Filter by district and category
- Build inter-district collaboration

---

## 🌐 API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new officer |
| POST | `/auth/login` | Login with credentials |

### ML & Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict/` | Upload dataset for ML analysis |
| POST | `/analyze_case_document/` | AI-powered document analysis |

### Community

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/community/posts/create` | Create new post |
| GET | `/community/posts` | Fetch all posts (with filters) |
| GET | `/community/posts/{post_id}` | Get specific post |
| DELETE | `/community/posts/{post_id}` | Delete post (creator only) |
| POST | `/community/posts/{post_id}/like` | Like a post |
| POST | `/community/posts/{post_id}/unlike` | Unlike a post |
| GET | `/community/posts/{post_id}/liked` | Check if user liked post |
| POST | `/community/posts/{post_id}/comments` | Add comment |
| GET | `/community/posts/{post_id}/comments` | Get comments |
| DELETE | `/community/comments/{comment_id}` | Delete comment |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/docs` | Interactive API documentation |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19
- **Styling**: Tailwind CSS 3.4.17 with shadcn/ui components
- **Routing**: React Router DOM 7.9.6
- **State Management**: React Context API, TanStack Query 5.90.10
- **UI Components**: Radix UI primitives
- **Charts**: Recharts 3.4.1
- **Maps**: Leaflet 1.9.4
- **Forms**: React Hook Form 7.61.1 + Zod 3.25.76
- **PDF Export**: jsPDF 2.5.1 + html2canvas 1.4.1

### Backend
- **Framework**: FastAPI 2.2 with Uvicorn
- **Database**: PostgreSQL with SQLAlchemy
- **Authentication**: bcrypt password hashing
- **ML/Data Science**: 
  - Pandas & NumPy for data processing
  - Scikit-learn for ML models
  - Prophet for time series forecasting
  - Joblib for model serialization
- **AI**: Google Generative AI (Gemini)
- **Document Processing**: pdfplumber, Pillow
- **Environment**: python-dotenv

### DevOps & Tools
- **Version Control**: Git
- **Package Managers**: npm, Bun
- **Linting**: ESLint 9.32.0
- **Type Checking**: TypeScript

---

## 🔐 Security Features

- ✅ Bcrypt password hashing
- ✅ SQL injection prevention via SQLAlchemy
- ✅ CORS configuration for frontend/backend separation
- ✅ User authentication on sensitive endpoints
- ✅ Environment variable management for secrets

---

## 🎯 Key Insights & Reports

The platform generates comprehensive reports including:

1. **Efficiency Metrics**: Department-wise and officer-wise performance scores
2. **Trend Analysis**: Historical crime patterns and predictions
3. **Conviction Rates**: Success rate analysis for different case types
4. **Resource Optimization**: Recommendations for resource allocation
5. **Hotspot Identification**: GIS-based crime concentration areas
6. **Comparative Analysis**: Inter-district performance benchmarking

---

## 🚧 Future Roadmap

- [ ] Real-time notifications for critical cases
- [ ] Mobile application for field officers
- [ ] Advanced NLP for police report analysis
- [ ] Integration with CCTNS (Crime and Criminal Tracking Network & Systems)
- [ ] Live GIS tracking of patrol vehicles
- [ ] Citizen portal for public engagement
- [ ] Multi-language support for regional deployments
- [ ] Advanced anomaly detection in operations
- [ ] Predictive policing capabilities
- [ ] Integration with body-worn cameras

---

## 👥 Contributors

| Name | Role |
|------|------|
| **Saptarshi Mondal** | Machine Learning & Backend Development |
| **Krittika Biswas** | Frontend Development & Version Control |
| **Soumyadeep Sarkar** | GIS Mapping & Geospatial Analytics |
| **Sekh Yajudddin** | Presentation & Documentation |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features
- Test your changes thoroughly before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Krittika Biswas

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 📞 Support

For issues, questions, or suggestions:
- 🐛 [Report a Bug](https://github.com/krittikabiswas/copsight-police-app/issues)
- 💡 [Request a Feature](https://github.com/krittikabiswas/copsight-police-app/issues)
- 📧 Contact: [Your Contact Email]

---

## 🙏 Acknowledgments

- Law enforcement agencies for domain expertise
- Open-source community for excellent tools and libraries
- shadcn/ui for beautiful component library
- FastAPI and React communities for documentation

---

<div align="center">

**Built with ❤️ for safer communities**

⭐ Star this repo if you find it useful!

</div>
