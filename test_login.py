#!/usr/bin/env python3
"""
Test script to verify patient login functionality
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def test_get_test_credentials():
    """Test getting test credentials"""
    print("\n=== Testing GET /api/auth/test-credentials ===")
    try:
        response = requests.get(f"{BASE_URL}/api/auth/test-credentials")
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2))
        return data
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_patient_login(patient_id, password):
    """Test patient login"""
    print(f"\n=== Testing POST /api/auth/patient/login ===")
    print(f"Attempting login with Patient ID: {patient_id}")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/patient/login",
            json={"patient_id": patient_id, "password": password}
        )
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2))
        return data
    except Exception as e:
        print(f"ERROR: {e}")
        return None

def test_health():
    """Test health endpoint"""
    print("\n=== Testing GET /health ===")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    print("SepsisGuard API Test Suite")
    print("="*50)
    
    # Test health
    test_health()
    
    # Test get credentials
    creds_data = test_get_test_credentials()
    
    if creds_data and "test_patients" in creds_data:
        # Test login with first patient
        first_patient = creds_data["test_patients"][0]
        test_patient_login(first_patient["patient_id"], first_patient["password"])
        
        # Test login with second patient
        second_patient = creds_data["test_patients"][1]
        test_patient_login(second_patient["patient_id"], second_patient["password"])
    else:
        # Fallback to manual credentials
        print("\nFallback: Testing with hardcoded credentials")
        test_patient_login("PAT001", "test123")
    
    print("\n" + "="*50)
    print("Test complete!")
