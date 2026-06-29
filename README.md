# Titanic Survival Intelligence Suite — Final Portfolio Edition

A highly-polished, portfolio-grade Machine Learning SaaS application designed to predict Titanic passenger survival. The application ensembles **Random Forest** and **XGBoost** models, displays local explainable SHAP features, visualizes multi-variate statistical correlation, runs client-side interactive dataset explorers, offers multi-passenger assessments, compiles PDF executive reports, and synchronizes tab actions with browser history pathnames.

---

## 🚀 Newly Upgraded Portfolio Features

1. **Synchronized History Router (`/about`, `/dataset`, `/compare`, `/metrics`, `/contact`)**
   - Seamlessly watches browser pathnames and pushes history states to keep the address bar synchronized with tab states. Fully supports anonymous/visitor page loads.
2. **About Project Page (`/about`)**
   - Professionally highlights the ML problem statement, details the training data catalog (891 passenger records), and maps the system architecture through interactive flowchart SVG diagrams.
3. **Interactive Dataset Explorer (`/dataset`)**
   - High-performance, client-side pagination, search, sorting, and reset filters operating over the parsed copy of the historical Titanic dataset (891 rows in JSON format). Includes dictionary popups for features.
4. **Passenger Comparison Hub (`/compare`)**
   - Dual-engine concurrent parameter scoring widgets. Compares two passengers side-by-side with real-time confidence scores and probability indicators.
5. **Model Evaluation Center (`/metrics`)**
   - Evaluates classifier diagnostics using custom charts (ROC Curves, Precision-Recall Curves, confusion matrix metrics) mapped via Recharts.
6. **Contact & Feedback Center (`/contact`)**
   - Form-validated feedback dispatcher with micro-loading indicators, email syntax validators, and success message overlays.
7. **System Activity Timeline**
   - Vertical timeline added directly to the main Dashboard showing mock system logs (Registered ➜ Prediction Created ➜ Report Exported) with timing metrics.
8. **Prediction Summary Sharing**
   - Added copying/sharing utilities to prediction cards, generating detailed formatted summaries (Outcome, Confidence, Date, and Timestamp) directly to the clipboard.
9. **Universal Loading, Empty & Error States**
   - Skeleton screens, card placeholders, empty state indicators, and REST backend failure retry triggers implemented across all analytic cards.
10. **Aesthetics & Theme Controls**
    - Seamless dark and light themes, vibrant HSL gradients, glassmorphism cards (`GlassCard`), and micro-interactions.

---

## 📂 Project Architecture

```
├── backend/
│   ├── data/                 # Raw/cached historical Titanic datasets
│   ├── ml/
│   │   ├── artifacts/        # Serialized Random Forest & XGBoost classifiers
│   │   ├── train.py          # Preprocessor and classifiers trainer
│   │   └── predictor.py      # Classifier ensembler and SHAP vectors builder
│   ├── routers/              # Auth, Predictions, Analytics, Admin, Reports endpoints
│   ├── main.py               # FastAPI entrypoint, CSP/cors headers, middlewares
│   ├── database.py           # SQLAlchemy SQLAlchemy engine connectors
│   ├── models.py             # SQLite schema entities
│   ├── schemas.py            # Pydantic serialization definitions
│   └── requirements.txt      # Python dependencies manifest
│
├── frontend/
│   ├── src/
│   │   ├── assets/           # Client-side titanic_dataset.json (891 records parsed)
│   │   ├── components/       # GlassCard, Sidebar, StatsWidget, StateViews loaders
│   │   ├── pages/            # LandingPage, Login, Dashboard, Compare, Metrics, About, Contact
│   │   ├── routes/           # Protected & unprotected navigation configs
│   │   ├── api/              # Axios instance with auth token headers
│   │   ├── App.tsx           # History-sync router, session timers
│   │   └── main.tsx          # Client mounting entrypoint
│   ├── tailwind.config.js    # Glassmorphism dark/light styles
│   ├── vite.config.ts        # Vite code-splitting and asset configuration
│   ├── vercel.json           # SPA router redirect parameters
│   └── package.json          # Node dependencies manifest
│
├── README.md                 # Updated Portfolio manual
└── ARCHITECTURE.md           # System Architecture Package
```

---

## ⚙️ Local Development Setup

### 1. Backend Server Setup
Ensure Python 3.11+ is installed.
```powershell
cd backend
python -m venv venv
# On Windows PowerShell:
venv\Scripts\pip install -r requirements.txt
# On Linux/macOS:
source venv/bin/activate && pip install -r requirements.txt

# Run server
venv\Scripts\python main.py
```
*Note: On startup, the server automatically downloads training data, fits the models, and writes artifacts to disk.*

### 2. Frontend React Setup
Ensure Node.js is installed.
```powershell
cd frontend
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏆 Production Build & Deploy

### Frontend (Vercel)
The production bundle is built using Vite. To verify/compile:
```powershell
cd frontend
npm run build
```
Vite compiles and outputs the production bundle to `dist/`, which is fully deployment-ready on **Vercel** via the SPA redirects configured in `vercel.json`.

### Backend (Render)
The backend is ready to deploy on **Render** using the blueprint in `render.yaml`. It connects to SQLite out-of-the-box and can scale to PostgreSQL seamlessly.
