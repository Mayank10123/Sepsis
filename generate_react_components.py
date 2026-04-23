"""
SepsisGuard Integration Generator
Converts Stitch HTML to React + connects to FastAPI backend
"""

import os
import re
from pathlib import Path
import json

class ReactComponentGenerator:
    """Convert Stitch HTML exports to React components"""
    
    SCREENS = {
        "01_login.html": "LoginPage",
        "02_doctor_dashboard.html": "DoctorDashboard",
        "03_doctor_detail.html": "PatientDetailView",
        "04_patient_dashboard.html": "PatientDashboard",
        "05_family_dashboard.html": "FamilyDashboard",
        "06_clinical_reports.html": "ClinicalReports",
        "07_educational_resources.html": "EducationalResources",
        "08_support_help_desk.html": "SupportHelpDesk",
    }
    
    @staticmethod
    def generate_login_page():
        """Generate LoginPage.jsx with OAuth integration"""
        return '''import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage() {
  const [role, setRole] = useState('doctor');
  
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };
  
  const handleGithubLogin = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>SepsisGuard</h1>
          <p>Live Health Monitoring with AI-Powered Alerts</p>
        </div>
        
        <div className="role-selector">
          <label>
            <input 
              type="radio" 
              value="doctor" 
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.target.value)}
            />
            👨‍⚕️ Doctor (Full Access)
          </label>
          <label>
            <input 
              type="radio" 
              value="patient" 
              checked={role === 'patient'}
              onChange={(e) => setRole(e.target.value)}
            />
            👤 Patient (My Health)
          </label>
          <label>
            <input 
              type="radio" 
              value="family" 
              checked={role === 'family'}
              onChange={(e) => setRole(e.target.value)}
            />
            👨‍👩‍👧 Family (Loved One's Status)
          </label>
        </div>

        <div className="auth-buttons">
          <button className="btn btn-google" onClick={handleGoogleLogin}>
            🔐 Sign in with Google
          </button>
          <button className="btn btn-github" onClick={handleGithubLogin}>
            🔐 Sign in with GitHub
          </button>
        </div>

        <div className="login-footer">
          <p>🔒 Secure OAuth Login | Data encrypted in transit</p>
        </div>
      </div>
    </div>
  );
}
'''

    @staticmethod
    def generate_doctor_dashboard():
        """Generate DoctorDashboard.jsx"""
        return '''import React, { useState, useEffect } from 'react';
import './DoctorDashboard.css';

export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
    setupWebSocket();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/patients?role=doctor', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setPatients(data.patients);
      setAlerts(data.alerts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    const ws = new WebSocket(`wss://api/ws/${localStorage.getItem('user_id')}`);
    ws.onmessage = (event) => {
      const alert = JSON.parse(event.data);
      setAlerts(prev => [alert, ...prev]);
      // Play sound notification
      playAlert();
    };
  };

  const playAlert = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==');
    audio.play();
  };

  const getRiskColor = (risk) => {
    if (risk < 30) return 'green';
    if (risk < 60) return 'yellow';
    if (risk < 85) return 'red';
    return 'critical';
  };

  if (loading) return <div className="loading">Loading patients...</div>;

  return (
    <div className="doctor-dashboard">
      <header className="dashboard-header">
        <h1>👨‍⚕️ Doctor Dashboard</h1>
        <div className="alert-badge">{alerts.filter(a => !a.acknowledged).length}</div>
      </header>

      <div className="dashboard-layout">
        <section className="patient-list">
          <h2>Assigned Patients</h2>
          {patients.map(patient => (
            <div 
              key={patient.id} 
              className={`patient-card risk-${getRiskColor(patient.risk_score)}`}
              onClick={() => setSelectedPatient(patient)}
            >
              <div className="risk-indicator"></div>
              <div className="patient-info">
                <h3>{patient.name}</h3>
                <p>ID: {patient.id} | Risk: {patient.risk_score}%</p>
              </div>
              <span className="risk-badge">{patient.risk_score}%</span>
            </div>
          ))}
        </section>

        <section className="patient-detail">
          {selectedPatient ? (
            <>
              <h2>{selectedPatient.name} - Detailed View</h2>
              <p>Risk Score: {selectedPatient.risk_score}%</p>
              <p>Top Factors: {selectedPatient.top_factors?.join(', ')}</p>
              <button className="btn btn-primary">View Full Report</button>
            </>
          ) : (
            <p>Select a patient to view details</p>
          )}
        </section>
      </div>
    </div>
  );
}
'''

    @staticmethod
    def generate_patient_dashboard():
        """Generate PatientDashboard.jsx"""
        return '''import React, { useState, useEffect } from 'react';
import './PatientDashboard.css';

export default function PatientDashboard() {
  const [vitals, setVitals] = useState(null);
  const [status, setStatus] = useState('stable');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVitals = async () => {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`/api/patient/${userId}/status`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setVitals(data.vitals);
      setStatus(data.status);
      setMessage(data.message);
    };

    fetchVitals();
    const interval = setInterval(fetchVitals, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!vitals) return <div className="loading">Loading your health data...</div>;

  return (
    <div className="patient-dashboard">
      <header className="patient-header">
        <h1>❤️ Your Health Status</h1>
        <p className="last-updated">Last updated: 2 minutes ago</p>
      </header>

      <div className="status-card">
        <div className={`status-indicator ${status}`}>
          {status === 'stable' ? '🟢 All Stable' : '🟡 Minor Change'}
        </div>
      </div>

      <section className="vitals-grid">
        <div className="vital-card">
          <div className="vital-label">Heart Rate</div>
          <div className="vital-value">{vitals.hr} <span>bpm</span></div>
          <div className="vital-status">Normal</div>
        </div>

        <div className="vital-card">
          <div className="vital-label">Oxygen Level</div>
          <div className="vital-value">{vitals.o2}%</div>
          <div className="vital-status">Good</div>
        </div>

        <div className="vital-card">
          <div className="vital-label">Temperature</div>
          <div className="vital-value">{vitals.temp}°C</div>
          <div className="vital-status">Slight Rise</div>
        </div>

        <div className="vital-card">
          <div className="vital-label">Blood Pressure</div>
          <div className="vital-value">{vitals.bp_sys}/{vitals.bp_dia}</div>
          <div className="vital-status">Normal</div>
        </div>
      </section>

      {message && (
        <section className="care-team-message">
          <h3>💬 Message from Your Care Team</h3>
          <p>{message}</p>
        </section>
      )}

      <section className="patient-actions">
        <button className="btn btn-secondary">📞 Message Care Team</button>
        <button className="btn btn-secondary">❓ Questions?</button>
      </section>
    </div>
  );
}
'''

    @staticmethod
    def generate_family_dashboard():
        """Generate FamilyDashboard.jsx"""
        return '''import React, { useState, useEffect } from 'react';
import './FamilyDashboard.css';

export default function FamilyDashboard() {
  const [lovedOne, setLovedOne] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const fetchStatus = async () => {
      const familyId = localStorage.getItem('user_id');
      const response = await fetch(`/api/family/${familyId}/loved_one`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setLovedOne(data.loved_one);
      setUpdates(data.updates);
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!lovedOne) return <div className="loading">Loading...</div>;

  return (
    <div className="family-dashboard">
      <header className="family-header">
        <h1>👨‍👩‍👧 {lovedOne.name}'s Status</h1>
      </header>

      <div className="status-panel">
        <div className="status-badge green">
          🟢 All Good
        </div>
        <p className="status-note">Care team is aware and monitoring</p>
      </div>

      <section className="care-team-updates">
        <h2>📬 Recent Updates</h2>
        {updates.map((update, idx) => (
          <div key={idx} className="update-item">
            <div className="update-time">{update.time}</div>
            <div className="update-message">{update.message}</div>
          </div>
        ))}
      </section>

      <section className="family-actions">
        <button className="btn btn-primary">📞 Request Call</button>
        <button className="btn btn-secondary">💬 Send Message</button>
      </section>
    </div>
  );
}
'''

    @classmethod
    def generate_all(cls):
        """Generate all React components"""
        components = {
            'LoginPage.jsx': cls.generate_login_page(),
            'DoctorDashboard.jsx': cls.generate_doctor_dashboard(),
            'PatientDashboard.jsx': cls.generate_patient_dashboard(),
            'FamilyDashboard.jsx': cls.generate_family_dashboard(),
        }
        return components

def main():
    print("=" * 70)
    print("🚀 SEPSISGUARD REACT COMPONENT GENERATOR")
    print("=" * 70)
    
    # Create frontend directory structure
    frontend_dir = Path("frontend")
    frontend_dir.mkdir(exist_ok=True)
    
    components_dir = frontend_dir / "src" / "components"
    components_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate components
    generator = ReactComponentGenerator()
    components = generator.generate_all()
    
    for filename, code in components.items():
        filepath = components_dir / filename
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(code)
        print(f"✅ Generated {filepath}")
    
    print("\n" + "=" * 70)
    print("✅ React components generated successfully!")
    print("📁 Location: frontend/src/components/")
    print("=" * 70)

if __name__ == "__main__":
    main()
