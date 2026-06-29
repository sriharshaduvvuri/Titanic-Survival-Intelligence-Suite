# Titanic Survival Intelligence Suite — Architecture & System Design

This document details the software engineering patterns, system topology, machine learning pipeline, and database schemas implemented in the Titanic Survival Intelligence Suite.

---

## 1. System Topology Overview

The application follows a decoupled client-server architecture containing a React Single Page Application (SPA) frontend and a Python-based FastAPI REST backend.

```
┌────────────────────────────────────────────────────────┐
│                   Vite / React SPA                     │
│  - Customized CSS Layout   - Axios REST Client         │
│  - Pathname Router Sync    - Recharts Visuals          │
└──────────────────────────┬─────────────────────────────┘
                           │
                           │ HTTPS / JSON API
                           ▼
┌────────────────────────────────────────────────────────┐
│                     FastAPI Server                     │
│  - Middleware Core         - Token Verification        │
│  - Analytics Aggregator    - SQLAlchemy ORM            │
└──────────────────────────┬─────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
   ┌───────────────────┐       ┌───────────────────┐
   │ SQLite Database   │       │ ML Pipeline Layer │
   │ - Users Table     │       │ - RF & XGB Model  │
   │ - Audit Logs      │       │ - SHAP Explainer  │
   │ - Predictions     │       │ - Preprocessors   │
   └───────────────────┘       └───────────────────┘
```

---

## 2. Front-End Layer Architecture

### 2.1 Technology Stack & Build Pipeline
- **Core Framework**: React 18 with TypeScript.
- **Build Engine**: Vite + Rollup. Outputs code-split chunks for optimized production bundles.
- **Styling**: Tailwind CSS + custom glassmorphic overlay sheets (`GlassCard`).
- **Interactive Graphs**: Recharts (fully responsive SVGs).

### 2.2 History-Synchronized Pathname Router
To preserve the fluid responsiveness of tab states while keeping URLs bookmarkable, the frontend implements a custom window popstate listener inside `App.tsx`. 
- Every tab navigation updates the browser URL (e.g. `/about`, `/dataset`, `/compare`, `/metrics`, `/contact`) via `window.history.pushState`.
- Reloading the page or clicking back/forward triggers the router state to synchronize the displayed tab layout without requiring fully bundled reloads.
- Non-protected pages (like `/about` and `/contact`) bypass the `ProtectedRoute` wrapper, enabling anonymous guest access.

### 2.3 Session Management & Token Expiration Warnings
- JWT token expiration is inspected using local payload decoding.
- A background `setInterval` tracks remaining session validity.
- If less than 60 seconds remain, a warning modal prompts the user to refresh the session or auto-logout, preventing unauthorized API queries.

---

## 3. Back-End & Database Layers

### 3.1 Web Server Engine (FastAPI)
The backend is powered by FastAPI, leveraging Python's `asyncio` loop for non-blocking database queries and predictive diagnostics.
- **Security Middlewares**: CORS configurations (only allowing verified origins), Content Security Policies (CSP), and session rate-limiting attributes.
- **Payload Limits**: Rejects request bodies larger than 5MB to defend against Denial-of-Service (DoS) vectors.

### 3.2 SQLAlchemy Database Schema
SQLite is configured out-of-the-box (mapped to `titanic_suite.db`). Tables are modeled using SQLAlchemy:

- **Users Table**: Stores hashed security credentials, roles (`user`, `admin`), and registration details.
- **Predictions Table**: Persists passenger characteristics, Random Forest and XGBoost individual probabilities, final ensembled outcomes, and execution times.
- **Audit Logs Table**: Records logins, registrations, and system backups, queryable via the Admin panel.

---

## 4. Machine Learning & Explainable AI (XAI) Pipeline

### 4.1 Ensemble Classifier
The scoring engine ensembles two distinct classifiers to maximize predictive performance:
1. **Random Forest Classifier**: Robust against data variance and outliers.
2. **XGBoost Classifier**: Gradient boosted decision trees optimized for feature interaction mapping.

The final prediction probability is an ensemble average:
$$\text{Probability}_{\text{Ensemble}} = \frac{\text{Prob}_{\text{RF}} + \text{Prob}_{\text{XGB}}}{2}$$
If the ensembled average is $\ge 0.50$, the passenger is predicted to have survived.

### 4.2 Feature Engineering & Preprocessing
Historical Titanic CSV datasets (891 passenger records) are compiled and preprocessed:
- **Numerical Imputation**: Age is imputed with median metrics.
- **Categorical Encoding**: Sex and Embarked columns are One-Hot encoded.
- **Scaling**: RobustScaler is applied to Fares, capping outliers at the historical ticket limit of \$512.33.

### 4.3 SHAP (SHapley Additive exPlanations)
- **Local Explanations**: A SHAP explainer maps how passenger properties pull the survival probability above or below the base value.
- **Fallback Rule-Based Generator**: If the REST endpoint misses SHAP arrays during query downtime, a rule-based algorithm on the client matches demographic flags (e.g. Female gender or 1st Class travel as positive drivers, elderly age or 3rd Class ticket as negative drivers).
