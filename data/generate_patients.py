#!/usr/bin/env python3
"""
Synthetic Patient Data Generator for SepsisGuard
Generates realistic test patients and vitals for demo/testing
"""

import random
from datetime import datetime, timedelta
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb+srv://user:password@cluster.mongodb.net/sepsisguard")

# Normal vital ranges
NORMAL_RANGES = {
    'hr': (60, 100),           # Heart rate beats/min
    'temp': (36.5, 37.5),      # Temperature °C
    'systolic': (90, 120),     # Blood pressure mmHg
    'diastolic': (60, 80),
    'o2': (95, 100),           # Oxygen saturation %
    'lactate': (0.5, 2.0),     # Blood lactate mmol/L
    'respiratory': (12, 20),   # Breaths/min
}

# Abnormal ranges (sepsis risk)
ABNORMAL_RANGES = {
    'hr': (110, 140),
    'temp': (38.5, 40.0),
    'systolic': (70, 90),
    'diastolic': (40, 60),
    'o2': (88, 93),
    'lactate': (2.5, 5.0),
    'respiratory': (22, 35),
}

def generate_patient(patient_id):
    """Generate a realistic patient profile"""
    first_names = ["John", "Sarah", "Michael", "Emma", "Robert", "Lisa", "James", "Jennifer", "David", "Maria"]
    last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
    conditions = ["Pneumonia", "UTI", "Gastroenteritis", "IV catheter", "Post-surgical", "Immunocompromised"]
    
    return {
        "_id": patient_id,
        "patient_id": patient_id,
        "first_name": random.choice(first_names),
        "last_name": random.choice(last_names),
        "age": random.randint(35, 85),
        "gender": random.choice(["M", "F"]),
        "hospital": "Central Medical Hospital",
        "ward": f"Ward {random.choice(['A', 'B', 'C', 'D'])}",
        "room": f"{random.randint(101, 320)}",
        "admission_date": (datetime.utcnow() - timedelta(days=random.randint(1, 14))).isoformat(),
        "conditions": random.sample(conditions, k=random.randint(1, 2)),
        "baseline_vitals": {
            "hr": random.randint(*NORMAL_RANGES['hr']),
            "temp": round(random.uniform(*NORMAL_RANGES['temp']), 1),
            "systolic": random.randint(*NORMAL_RANGES['systolic']),
            "diastolic": random.randint(*NORMAL_RANGES['diastolic']),
            "o2": random.randint(*NORMAL_RANGES['o2']),
            "lactate": round(random.uniform(*NORMAL_RANGES['lactate']), 2),
            "respiratory": random.randint(*NORMAL_RANGES['respiratory']),
        },
        "assigned_doctor_id": f"doc_{random.randint(1, 5)}",
        "assigned_nurse_id": f"nurse_{random.randint(1, 10)}",
        "monitoring_enabled": True,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

def generate_vitals(patient_id, is_critical=False):
    """Generate vital signs - normal or critical"""
    ranges = ABNORMAL_RANGES if is_critical else NORMAL_RANGES
    
    return {
        "patient_id": patient_id,
        "timestamp": datetime.utcnow(),
        "vitals": {
            "hr": random.randint(*ranges['hr']),
            "temp": round(random.uniform(*ranges['temp']), 1),
            "systolic": random.randint(*ranges['systolic']),
            "diastolic": random.randint(*ranges['diastolic']),
            "o2": random.randint(*ranges['o2']),
            "lactate": round(random.uniform(*ranges['lactate']), 2),
            "respiratory": random.randint(*ranges['respiratory']),
        },
        "created_at": datetime.utcnow(),
    }

def main():
    """Generate synthetic data in MongoDB"""
    print("🏥 SepsisGuard Synthetic Data Generator")
    print("=" * 50)
    
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        # Verify connection
        client.admin.command('ping')
        print("✅ Connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ MongoDB Connection Error: {e}")
        print("\nFix: Update MONGODB_URI in .env file")
        return
    
    db = client["sepsisguard"]
    
    # Clear existing data (optional)
    print("\n📊 Generating synthetic data...")
    
    # Create patients
    num_patients = 30
    patients = []
    for i in range(1, num_patients + 1):
        patient = generate_patient(f"PATIENT_{i:03d}")
        patients.append(patient)
    
    db["patients"].delete_many({})
    result = db["patients"].insert_many(patients)
    print(f"✅ Created {len(result)} patients")
    
    # Generate vital readings for each patient
    print("\n📈 Generating vital signs...")
    vitals = []
    for i, patient in enumerate(patients):
        patient_id = patient["patient_id"]
        
        # Generate readings for last 7 days
        for day in range(7, 0, -1):
            for hour in [6, 12, 18, 24]:  # 4 readings per day
                vitals_reading = generate_vitals(patient_id, is_critical=False)
                vitals_reading["timestamp"] = datetime.utcnow() - timedelta(days=day, hours=24-hour)
                vitals.append(vitals_reading)
        
        # Add 1-2 critical readings for ~10 patients to demo alerts
        if i < 10:
            critical_vital = generate_vitals(patient_id, is_critical=True)
            critical_vital["timestamp"] = datetime.utcnow() - timedelta(minutes=random.randint(5, 30))
            vitals.append(critical_vital)
    
    db["vitals"].delete_many({})
    result = db["vitals"].insert_many(vitals)
    print(f"✅ Created {len(result)} vital readings")
    
    # Generate risk scores
    print("\n🧠 Generating risk scores...")
    risk_scores = []
    for patient in patients:
        for risk_level in range(random.randint(2, 5)):
            risk_scores.append({
                "patient_id": patient["patient_id"],
                "timestamp": datetime.utcnow() - timedelta(hours=risk_level),
                "risk_score": random.randint(20, 85),
                "top_factors": random.sample([
                    "Elevated lactate",
                    "Fever",
                    "Tachycardia",
                    "Low O2",
                    "Tachypnea",
                    "Positive blood culture pending"
                ], k=3),
                "created_at": datetime.utcnow(),
            })
    
    db["risk_scores"].delete_many({})
    result = db["risk_scores"].insert_many(risk_scores)
    print(f"✅ Created {len(result)} risk score records")
    
    # Generate some alerts
    print("\n🚨 Generating alerts...")
    alerts = []
    for i, patient in enumerate(patients[:10]):  # Alerts for first 10 patients
        alerts.append({
            "patient_id": patient["patient_id"],
            "alert_type": random.choice(["risk_increase", "threshold_breach", "clinical_deterioration"]),
            "severity": random.choice(["warning", "critical"]),
            "message": f"Patient {patient['first_name']} showing signs of deterioration",
            "risk_score": random.randint(60, 95),
            "acknowledged": False,
            "acknowledged_by": None,
            "created_at": datetime.utcnow() - timedelta(minutes=random.randint(5, 120)),
        })
    
    db["alerts"].delete_many({})
    result = db["alerts"].insert_many(alerts)
    print(f"✅ Created {len(result)} alerts")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 DATA GENERATION SUMMARY")
    print("=" * 50)
    print(f"✅ {len(patients)} patients created")
    print(f"✅ {len(vitals)} vital readings generated")
    print(f"✅ {len(risk_scores)} risk scores calculated")
    print(f"✅ {len(alerts)} alerts generated")
    print("\n💡 Tips:")
    print("   - Patients: PATIENT_001 to PATIENT_030")
    print("   - Critical vitals: Random normal + some abnormal readings")
    print("   - Use these IDs in the API to test endpoints")
    print("\n🎯 Next Steps:")
    print("   1. Start backend: python -m uvicorn backend.api:app --reload")
    print("   2. Login to dashboard at http://localhost:3000")
    print("   3. View patient list and alerts")
    print("   4. Trigger new vitals via API: POST /api/patient/PATIENT_001/vitals")
    
    client.close()

if __name__ == "__main__":
    main()
