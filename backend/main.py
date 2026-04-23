"""
FastAPI Backend for SepsisGuard
Handles OAuth, Patient Data, AI Analysis, Alerts
"""

from fastapi import FastAPI, WebSocket, Depends, HTTPException, BackgroundTasks, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv
import asyncio
from groq import Groq
from datetime import datetime

from .ai_agent import SepsisRiskAgent, monitor_patient
from .auth import router as auth_router, verify_token
from .notifications import AlertEngine

# Load environment variables
load_dotenv()

class AppState:
    """Shared application state"""
    db: AsyncIOMotorDatabase = None
    groq_client: Groq = None
    alert_engine = None
    sepsis_agent = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize app on startup, cleanup on shutdown"""
    
    # Startup
    print("🚀 Starting SepsisGuard API")
    mongo_client = None
    
    try:
        # Connect to MongoDB
        mongo_client = AsyncIOMotorClient(os.getenv("MONGODB_URI"), serverSelectionTimeoutMS=5000)
        AppState.db = mongo_client.sepsisguard
        print("✅ Connected to MongoDB Atlas")
        
        # Initialize test data
        try:
            from bcrypt import hashpw, gensalt
            from datetime import datetime
            
            patients_collection = AppState.db['patients']
            
            # Test patients
            test_patients = [
                {
                    '_id': 'PAT001',
                    'password': hashpw(b'test123', gensalt()).decode('utf-8'),
                    'name': 'John Smith',
                    'email': 'john@example.com',
                    'role': 'patient',
                    'age': 45,
                    'created_at': datetime.utcnow(),
                    'vitals': [],
                    'alerts': []
                },
                {
                    '_id': 'PAT002',
                    'password': hashpw(b'demo456', gensalt()).decode('utf-8'),
                    'name': 'Sarah Johnson',
                    'email': 'sarah@example.com',
                    'role': 'patient',
                    'age': 38,
                    'created_at': datetime.utcnow(),
                    'vitals': [],
                    'alerts': []
                },
                {
                    '_id': 'PAT003',
                    'password': hashpw(b'demo789', gensalt()).decode('utf-8'),
                    'name': 'Mike Davis',
                    'email': 'mike@example.com',
                    'role': 'patient',
                    'age': 52,
                    'created_at': datetime.utcnow(),
                    'vitals': [],
                    'alerts': []
                }
            ]
            
            # Delete old test data
            await patients_collection.delete_many({'_id': {'$in': ['PAT001', 'PAT002', 'PAT003']}})
            # Insert test patients
            await patients_collection.insert_many(test_patients)
            print("✅ Test patients initialized: PAT001, PAT002, PAT003")
        except Exception as e:
            print(f"⚠️ Test data initialization: {str(e)}")
            
    except Exception as e:
        print(f"⚠️ MongoDB connection failed: {str(e)}")
        print("⚠️ Running in demo mode (no database persistence)")
    
    try:
        # Initialize Groq client
        AppState.groq_client = Groq(api_key=os.getenv("GROQ_API_KEY", "sk_test"))
        print("✅ Groq.ai client initialized")
    except Exception as e:
        print(f"⚠️ Groq.ai initialization failed: {str(e)}")
    
    try:
        # Initialize SepsisRiskAgent
        if AppState.groq_client:
            AppState.sepsis_agent = SepsisRiskAgent(AppState.groq_client)
            print("✅ SepsisRiskAgent initialized")
        else:
            print("⚠️ SepsisRiskAgent skipped (no Groq client)")
    except Exception as e:
        print(f"⚠️ SepsisRiskAgent initialization failed: {str(e)}")
    
    try:
        # Initialize alert engine
        if AppState.db is not None:
            AppState.alert_engine = AlertEngine(AppState.db)
            print("✅ Alert engine initialized")
        else:
            print("⚠️ Alert engine skipped (no database)")
    except Exception as e:
        print(f"⚠️ Alert engine initialization failed: {str(e)}")
    
    try:
        # Start background monitoring tasks for active patients
        if AppState.db is not None:
            active_patients = await AppState.db.patients.find({'status': 'active'}).to_list(None)
            for patient in active_patients:
                asyncio.create_task(monitor_patient(
                    patient['_id'],
                    AppState.db,
                    AppState.groq_client,
                    AppState.alert_engine
                ))
            print(f"✅ Started monitoring {len(active_patients)} patients")
    except Exception as e:
        print(f"⚠️ Patient monitoring setup failed: {str(e)}")
    
    print("✅ API is ready for requests")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down SepsisGuard API")
    if mongo_client:
        mongo_client.close()

# Initialize FastAPI app
app = FastAPI(title="SepsisGuard API", lifespan=lifespan)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

# ==================== ROUTES ====================

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "ok", "service": "SepsisGuard API"}

@app.get("/api/patients")
async def get_patients(role: str = "doctor", token: str = Depends(verify_token)):
    """Get patient list for doctor"""
    try:
        user = await AppState.db.users.find_one({"_id": token['sub']})
        
        if role == "doctor":
            # Doctor sees assigned patients
            patients = await AppState.db.patients.find(
                {"assigned_doctor": user['_id']}
            ).to_list(100)
            
            # Get latest risk scores
            enriched_patients = []
            for patient in patients:
                latest_risk = await AppState.db.risk_scores.find_one(
                    {"patient_id": patient['_id']},
                    sort=[("timestamp", -1)]
                )
                enriched_patients.append({
                    **patient,
                    'risk_score': latest_risk.get('risk_score', 0) if latest_risk else 0,
                    'risk_level': latest_risk.get('risk_level', 'green') if latest_risk else 'green'
                })
            
            # Get active alerts
            alerts = await AppState.db.alerts.find(
                {"doctor_id": user['_id'], "acknowledged": False}
            ).to_list(100)
            
            return {
                "patients": enriched_patients,
                "alerts": alerts
            }
        
        return HTTPException(status_code=403, detail="Unauthorized")
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/patient/{patient_id}/status")
async def get_patient_status(patient_id: str, token: str = Depends(verify_token)):
    """Get patient's current status and vitals"""
    try:
        # Verify access
        user = await AppState.db.users.find_one({"_id": token['sub']})
        patient = await AppState.db.patients.find_one({"_id": patient_id})
        
        # Get latest vitals
        vitals = await AppState.db.vitals.find_one(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        )
        
        # Get latest risk
        risk = await AppState.db.risk_scores.find_one(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        )
        
        # Get latest message
        message = await AppState.db.notifications.find_one(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        )
        
        return {
            "vitals": vitals['readings'] if vitals else {},
            "risk_score": risk['risk_score'] if risk else 0,
            "status": "stable" if (risk['risk_score'] if risk else 0) < 60 else "monitoring",
            "message": message['message'] if message else "Your care team is monitoring you."
        }
    
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/alerts/{user_id}")
async def get_alerts(user_id: str, token: str = Depends(verify_token)):
    """Get user's alerts"""
    try:
        user = await AppState.db.users.find_one({"_id": token['sub']})
        
        alerts = await AppState.db.alerts.find({
            f"{user['role']}_id": user_id
        }).to_list(100)
        
        return {"alerts": alerts}
    
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/alerts/{alert_id}/acknowledge")
async def acknowledge_alert(alert_id: str, token: str = Depends(verify_token)):
    """Doctor acknowledges alert"""
    try:
        await AppState.db.alerts.update_one(
            {"_id": alert_id},
            {"$set": {"acknowledged": True}}
        )
        return {"status": "acknowledged"}
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/patient/{patient_id}/vitals")
async def record_vitals(patient_id: str, vitals: dict = Body(...), token: str = Depends(verify_token), background_tasks: BackgroundTasks = BackgroundTasks()):
    """Record new vital readings and trigger AI analysis"""
    try:
        vital_record = {
            "patient_id": patient_id,
            "readings": vitals,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        result = await AppState.db.vitals.insert_one(vital_record)
        
        # Trigger AI analysis in background
        if background_tasks:
            background_tasks.add_task(
                analyze_patient_vitals,
                patient_id=patient_id,
                vitals=vitals,
                db=AppState.db,
                ai_agent=AppState.sepsis_agent if hasattr(AppState, 'sepsis_agent') else None
            )
        
        return {
            "status": "recorded",
            "vital_id": str(result.inserted_id)
        }
    except Exception as e:
        return {"error": str(e)}

async def analyze_patient_vitals(patient_id: str, vitals: dict, db, ai_agent):
    """Background task to analyze vitals and generate alerts"""
    try:
        if not ai_agent:
            return
        
        # Get patient data
        patient = await db.patients.find_one({"_id": patient_id})
        if not patient:
            return
        
        # Get patient history (last 24 hours)
        history = await db.vitals.find(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        ).to_list(24)
        
        # Prepare patient data for AI analysis
        patient_data = {
            "patient_id": patient_id,
            "vitals": vitals,
            "baseline": patient.get("baseline_vitals", {}),
            "history": [h.get("readings", {}) for h in history],
            "metadata": {
                "age": patient.get("age", 0),
                "comorbidities": patient.get("comorbidities", []),
                "meds": patient.get("medications", [])
            }
        }
        
        # Run AI analysis
        risk_analysis = ai_agent.analyze_patient(patient_data)
        
        # Store risk score
        await db.risk_scores.insert_one({
            "patient_id": patient_id,
            "risk_score": risk_analysis['risk_score'],
            "risk_level": risk_analysis['risk_level'],
            "factors": risk_analysis['factors'],
            "explanation": risk_analysis['explanation'],
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Generate alert if high risk
        if risk_analysis['risk_score'] >= 70:
            alert = {
                "patient_id": patient_id,
                "doctor_id": patient.get("assigned_doctor"),
                "risk_score": risk_analysis['risk_score'],
                "risk_level": risk_analysis['risk_level'],
                "message": f"HIGH RISK ALERT: Patient {patient_id} has sepsis risk score {risk_analysis['risk_score']}/100. {risk_analysis['explanation']}",
                "factors": risk_analysis['factors'],
                "acknowledged": False,
                "timestamp": datetime.utcnow().isoformat()
            }
            await db.alerts.insert_one(alert)
            print(f"🚨 Alert generated for patient {patient_id}: {risk_analysis['risk_level']}")
        
    except Exception as e:
        print(f"Error in analyze_patient_vitals: {e}")

@app.post("/api/patient/{patient_id}/predict-deterioration")
async def predict_deterioration(patient_id: str, token: str = Depends(verify_token)):
    """Explicitly trigger deterioration prediction for a patient"""
    try:
        # Get patient
        patient = await AppState.db.patients.find_one({"_id": patient_id})
        if not patient:
            raise HTTPException(status_code=404, detail="Patient not found")
        
        # Get latest vitals
        latest_vitals = await AppState.db.vitals.find_one(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        )
        
        if not latest_vitals:
            raise HTTPException(status_code=400, detail="No vitals recorded for patient")
        
        # Get patient history
        history = await AppState.db.vitals.find(
            {"patient_id": patient_id},
            sort=[("timestamp", -1)]
        ).to_list(24)
        
        # Prepare patient data
        patient_data = {
            "patient_id": patient_id,
            "vitals": latest_vitals["readings"],
            "baseline": patient.get("baseline_vitals", {}),
            "history": [h.get("readings", {}) for h in history],
            "metadata": {
                "age": patient.get("age", 0),
                "comorbidities": patient.get("comorbidities", []),
                "meds": patient.get("medications", [])
            }
        }
        
        # Run AI analysis
        if not AppState.sepsis_agent:
            raise HTTPException(status_code=503, detail="AI agent not available")
        
        risk_analysis = AppState.sepsis_agent.analyze_patient(patient_data)
        
        # Store risk score
        await AppState.db.risk_scores.insert_one({
            "patient_id": patient_id,
            "risk_score": risk_analysis['risk_score'],
            "risk_level": risk_analysis['risk_level'],
            "factors": risk_analysis['factors'],
            "explanation": risk_analysis['explanation'],
            "timestamp": datetime.utcnow().isoformat()
        })
        
        # Generate alert if high risk
        if risk_analysis['risk_score'] >= 70:
            alert = {
                "patient_id": patient_id,
                "doctor_id": patient.get("assigned_doctor"),
                "risk_score": risk_analysis['risk_score'],
                "risk_level": risk_analysis['risk_level'],
                "message": f"HIGH RISK ALERT: Patient {patient_id} has sepsis risk score {risk_analysis['risk_score']}/100. {risk_analysis['explanation']}",
                "factors": risk_analysis['factors'],
                "acknowledged": False,
                "timestamp": datetime.utcnow().isoformat()
            }
            await AppState.db.alerts.insert_one(alert)
            print(f"🚨 Alert generated for patient {patient_id}: {risk_analysis['risk_level']}")
        
        return {
            "patient_id": patient_id,
            "risk_score": risk_analysis['risk_score'],
            "risk_level": risk_analysis['risk_level'],
            "factors": risk_analysis['factors'],
            "explanation": risk_analysis['explanation'],
            "alert_generated": risk_analysis['risk_score'] >= 70
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.websocket("/api/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket for real-time updates"""
    await websocket.accept()
    
    try:
        while True:
            # Listen for alerts
            alert = await AppState.db.alerts.find_one(
                {f"{user_id}_id": user_id, "sent": False},
                sort=[("timestamp", -1)]
            )
            
            if alert:
                await websocket.send_json(alert)
                await AppState.db.alerts.update_one(
                    {"_id": alert["_id"]},
                    {"$set": {"sent": True}}
                )
            
            await asyncio.sleep(5)  # Check every 5 seconds
    
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await websocket.close()

@app.get("/api/audit-log")
async def get_audit_log(token: str = Depends(verify_token)):
    """Get audit trail of all alerts (doctor only)"""
    try:
        user = await AppState.db.users.find_one({"_id": token['sub']})
        
        if user['role'] != 'doctor':
            raise HTTPException(status_code=403, detail="Doctor only")
        
        logs = await AppState.db.audit_logs.find(
            {"doctor_id": user['_id']}
        ).to_list(1000)
        
        return {"audit_logs": logs}
    
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
