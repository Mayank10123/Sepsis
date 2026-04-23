# 🏥 SepsisGuard Live Monitor - Complete Installation & Setup Guide

> AI-powered sepsis risk detection with real-time alerts across doctor, patient, and family dashboards

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Configuration](#database-configuration)
6. [API Keys Setup](#api-keys-setup)
7. [Running the Application](#running-the-application)
8. [Docker Deployment](#docker-deployment)
9. [Testing & Demo](#testing--demo)

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone and navigate
cd d:\Hackathon\GFG

# 2. Setup Python environment
python -m venv venv
.\venv\Scripts\activate

# 3. Install dependencies
pip install -r backend/requirements.txt

# 4. Create .env file (see API Keys Setup)
cp .env.example .env

# 5. Start backend
python -m uvicorn backend.api:app --reload

# 6. In another terminal, start frontend
cd frontend
npm install
npm run dev

# 7. Open http://localhost:3000
```

---

## 📦 Prerequisites

### Required Software
- **Python 3.9+** (backend)
- **Node.js 18+** (frontend)
- **MongoDB Atlas** (cloud database - free tier available)
- **Git** (version control)

### Required API Keys
- **Groq.ai** - Free LLM API for risk analysis
- **MongoDB Atlas** - Free cloud database
- **Google OAuth** - OAuth 2.0 credentials
- **GitHub OAuth** - OAuth 2.0 credentials
- **Twilio** - SMS delivery (free trial)
- **SendGrid** - Email delivery (free tier)

---

## 🔧 Backend Setup

### Step 1: Create Python Virtual Environment
```bash
cd d:\Hackathon\GFG
python -m venv venv

# Activate venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
```

### Step 2: Install Python Dependencies
```bash
pip install -r backend/requirements.txt
# Takes ~2-3 minutes
```

### Step 3: Verify Installation
```bash
python -c "import fastapi, motor, groq; print('✅ All imports successful')"
```

---

## 🎨 Frontend Setup

### Step 1: Create React Project
```bash
cd frontend
npm install
```

### Step 2: Install Additional Dependencies
```bash
npm install axios react-router-dom zustand plotly.js tailwindcss
```

### Step 3: Start Development Server
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🗄️ Database Configuration

### MongoDB Atlas Setup (Free)

1. **Create Account**: https://www.mongodb.com/cloud/atlas
2. **Create Cluster**:
   - Choose "M0 Sandbox" (free tier)
   - Click "Create Cluster"
   - Wait 5-10 minutes for creation

3. **Get Connection String**:
   - Click "Connect" → "Drivers" → "Python"
   - Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/`

4. **Create Database User**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create username and password
   - Copy credentials

5. **Update .env**:
   ```
   MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/sepsisguard?retryWrites=true&w=majority
   ```

### Collections Schema

The backend automatically creates these collections on first run:
- `patients` - Patient profiles + baseline vitals
- `vitals` - Time-series vital readings
- `risk_scores` - AI-calculated risk scores
- `alerts` - Alert history + metadata
- `notifications` - In-app messages
- `users` - Doctor/Patient/Family users
- `audit_logs` - Compliance + action trail

---

## 🔐 API Keys Setup

### 1. Groq.ai (Risk Analysis LLM)
```bash
# 1. Go to https://console.groq.com
# 2. Sign up (free tier gives $5 credits)
# 3. Go to "API Keys" section
# 4. Click "Create API Key"
# 5. Copy the key to .env:
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

**Free Tier Limits**: Mixtral model with 8.7K requests/minute (more than enough)

### 2. Google OAuth
```bash
# 1. Go to https://console.cloud.google.com
# 2. Create new project
# 3. Enable "Google+ API"
# 4. Go to "Credentials" → "Create OAuth 2.0 Client ID"
# 5. Set:
#    - Application type: Web Application
#    - Authorized redirect URIs: http://localhost:8000/api/auth/google/callback
# 6. Copy Client ID & Secret:
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx
```

### 3. GitHub OAuth
```bash
# 1. Go to https://github.com/settings/developers
# 2. Click "New OAuth App"
# 3. Fill:
#    - Application name: SepsisGuard
#    - Homepage URL: http://localhost:3000
#    - Callback URL: http://localhost:8000/api/auth/github/callback
# 4. Copy Client ID & Secret:
GITHUB_CLIENT_ID=Ov23lixxxx
GITHUB_CLIENT_SECRET=xxxxx
```

### 4. Twilio (SMS)
```bash
# 1. Sign up: https://www.twilio.com (free trial with $15 credit)
# 2. Get phone number: Project → Phone Numbers → Buy a Number
# 3. Get credentials: Project Settings → API Credentials
TWILIO_ACCOUNT_SID=ACxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+12025551234  # Your Twilio number
```

### 5. SendGrid (Email)
```bash
# 1. Sign up: https://sendgrid.com (free tier: 100 emails/day)
# 2. Create API key: Settings → API Keys → Create Key
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

### 6. Create .env File
```bash
# Copy template
cp .env.example .env

# Edit with your keys
# nano .env  OR  open in VS Code
```

---

## ▶️ Running the Application

### Terminal 1: Backend API
```bash
cd d:\Hackathon\GFG
.\venv\Scripts\activate
python -m uvicorn backend.api:app --reload --host 0.0.0.0 --port 8000
```

Output should show:
```
✅ Connected to MongoDB Atlas
✅ Groq.ai client initialized
✅ Alert engine initialized
Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Frontend
```bash
cd d:\Hackathon\GFG\frontend
npm run dev
```

Output:
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
```

### Access the App
- **UI**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **WebSocket**: ws://localhost:8000/api/ws/{user_id}

---

## 🐳 Docker Deployment

### Build Docker Image
```bash
cd d:\Hackathon\GFG
docker build -f docker/Dockerfile -t sepsisguard:latest .
```

### Run Container
```bash
docker run -p 8000:8000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e GROQ_API_KEY="your_groq_key" \
  -e GOOGLE_CLIENT_ID="..." \
  ... other env vars ...
  sepsisguard:latest
```

### Docker Compose (All Services)
```bash
docker-compose -f docker/docker-compose.yml up
```

---

## 🧪 Testing & Demo

### 1. Generate Synthetic Patients
```bash
python data/generate_patients.py
# Creates 30 test patients in MongoDB
```

### 2. Trigger Alert Demo
```python
# In Python shell:
python
>>> from backend.ai_agent import SepsisRiskAgent
>>> agent = SepsisRiskAgent(groq_client)
>>> 
>>> # Create deteriorating patient
>>> patient = {
...     'patient_id': 'demo_001',
...     'vitals': {
...         'hr': 115,  # Elevated
...         'temp': 38.8,  # Fever
...         'o2': 92,  # Low
...         'lactate': 3.2  # Very elevated
...     },
...     'baseline': {...},
...     'history': [...],
...     'metadata': {...}
... }
>>>
>>> result = agent.analyze_patient(patient)
>>> print(result['risk_score'])  # Should be >70
```

### 3. Test Endpoints
```bash
# Login (get token)
curl -X GET http://localhost:8000/api/auth/google

# Get patients
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/patients?role=doctor

# Record vitals
curl -X POST http://localhost:8000/api/patient/demo_001/vitals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"hr": 110, "temp": 38.5, ...}'
```

### 4. End-to-End Demo Script
```bash
# Run full demo flow
python test_demo.py
```

---

## 📊 Project Structure

```
d:\Hackathon\GFG
├── backend/
│   ├── ai_agent.py          # Groq.ai + risk analysis
│   ├── api.py               # FastAPI server + endpoints
│   ├── auth.py              # OAuth login
│   ├── notifications.py     # SMS/Email/In-app alerts
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── FamilyDashboard.jsx
│   │   ├── styles/          # CSS + design tokens
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
├── data/
│   └── generate_patients.py # Synthetic test data
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── stitch-exports/          # Original Stitch HTML
├── .env.example
├── .env                     # (Created by you)
└── README.md
```

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: authentication failed against 'admin'
```
**Fix**: 
- Verify username/password are correct
- Ensure IP address is whitelisted (Project → Network Access)
- Check connection string format

### Groq.ai Rate Limit
```
RateLimitError: 429 Too Many Requests
```
**Fix**:
- Wait 1 minute and retry
- Upgrade to paid plan if needed
- Check free tier limits: 8.7K requests/min

### OAuth Redirect URL Mismatch
```
Error: redirect_uri_mismatch
```
**Fix**:
- Ensure callback URL matches exactly in OAuth app settings
- For local dev: http://localhost:8000/callback
- For production: https://yourdomain.com/callback

### Port Already in Use
```
Address already in use: ('0.0.0.0', 8000)
```
**Fix**:
```bash
# Kill process using port 8000
fuser -k 8000/tcp  # Mac/Linux
netstat -ano | findstr :8000  # Windows
taskkill /PID 12345 /F
```

---

## 📖 API Documentation

Once backend is running, visit: **http://localhost:8000/docs**

Interactive Swagger UI showing all endpoints:
- `POST /api/auth/google` - Google login
- `POST /api/auth/github` - GitHub login
- `GET /api/patients` - Get assigned patients
- `GET /api/patient/{id}/status` - Get patient details
- `POST /api/patient/{id}/vitals` - Record vitals
- `GET /api/alerts/{user_id}` - Get alerts
- `POST /api/alerts/{id}/acknowledge` - Acknowledge alert
- `WebSocket /api/ws/{user_id}` - Real-time updates

---

## 🔒 Security Considerations

### Before Production
- [ ] Change `JWT_SECRET` in `.env` to random string
- [ ] Set `ALLOWED_ORIGINS` in CORS config
- [ ] Enable HTTPS (use Let's Encrypt)
- [ ] Store all keys in secure vault (AWS Secrets Manager, etc.)
- [ ] Implement rate limiting on API
- [ ] Add database encryption
- [ ] Enable MongoDB encryption at rest
- [ ] Use environment variables, never commit `.env`

---

## 🎯 Next Steps

1. **Get API Keys** (15 min)
   - Groq.ai, MongoDB, OAuth, Twilio, SendGrid

2. **Run Backend** (5 min)
   - `python -m uvicorn backend.api:app --reload`

3. **Run Frontend** (2 min)
   - `npm run dev`

4. **Test Login** (2 min)
   - Click "Sign in with Google"

5. **Generate Test Data** (3 min)
   - Create synthetic patients

6. **Trigger Alert** (2 min)
   - Simulate patient deterioration

7. **See Real-Time Updates** (optional)
   - Watch WebSocket updates in dashboard

---

## 📞 Support

- **API Issues**: Check http://localhost:8000/docs
- **Database Issues**: MongoDB Atlas console
- **Deployment**: Docker image works on Heroku, Render, Railway

---

**🎉 You're ready to launch SepsisGuard!**

Start with: `python -m uvicorn backend.api:app --reload`
