import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnhancedDoctorDashboard.css';
import { doctorAPI, alertsAPI } from '../api/client';
import AIAdvisor from './AIAdvisor';
import RealTimeMonitoring from './RealTimeMonitoring';
import VoiceAssistant from './VoiceAssistant';

const EnhancedDoctorDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [stats, setStats] = useState({
    totalPatients: 0,
    criticalAlerts: 0,
    recoveryRate: 0,
    avgRiskScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.getPatients();
      const patientsData = response.data?.patients || [
        {
          id: '42',
          name: 'Jameson Blake',
          ward: 'ICU B, Bed 04',
          age: 45,
          riskScore: 45,
          status: 'Rising',
          vitals: {
            hr: 95,
            spo2: 96,
            temp: 37.5,
            rr: 18,
            lactate: 2.5
          },
          trends: 'Increasing heart rate',
          lastUpdate: new Date()
        },
        {
          id: '41',
          name: 'Elena Rodriguez',
          ward: 'Ward 4, Bed 12',
          age: 62,
          riskScore: 8,
          status: 'Stable',
          vitals: {
            hr: 72,
            spo2: 98,
            temp: 36.8,
            rr: 14,
            lactate: 1.2
          },
          trends: 'Stable vitals',
          lastUpdate: new Date()
        },
        {
          id: '43',
          name: 'Sarah Jenkins',
          ward: 'Ward 2, Bed 08',
          age: 38,
          riskScore: 12,
          status: 'Stable',
          vitals: {
            hr: 76,
            spo2: 97,
            temp: 37.1,
            rr: 16,
            lactate: 1.5
          },
          trends: 'Good recovery',
          lastUpdate: new Date()
        }
      ];

      setPatients(patientsData);
      
      // Calculate stats
      const criticalCount = patientsData.filter(p => p.riskScore >= 70).length;
      const avgRisk = Math.round(patientsData.reduce((acc, p) => acc + p.riskScore, 0) / patientsData.length);
      
      setStats({
        totalPatients: patientsData.length,
        criticalAlerts: criticalCount,
        recoveryRate: 85,
        avgRiskScore: avgRisk
      });

      // Load alerts
      const alertsResponse = await alertsAPI.getAlerts();
      setAlerts(alertsResponse.data?.alerts || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAlert = (alert) => {
    console.log('Alert triggered:', alert);
    // Show notification to user
  };

  const handleVoiceCommand = (suggestion) => {
    console.log('Voice command:', suggestion);
  };

  if (loading) {
    return (
      <div className="enhanced-doctor-dashboard loading">
        <div className="loader"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="enhanced-doctor-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <span className="title-icon">🛡️</span>
            <div>
              <h1>SepsisGuard Clinical Dashboard</h1>
              <p>Advanced AI-Powered Patient Monitoring</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="voice-btn" onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}>
              🎤 Voice Command
            </button>
            <button className="refresh-btn" onClick={loadDashboardData}>
              🔄 Refresh
            </button>
            <button className="profile-btn">
              👨‍⚕️ Dr. Smith
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="quick-stats-bar">
          <div className="stat-item critical">
            <span className="stat-number">{stats.criticalAlerts}</span>
            <span className="stat-text">🔴 Critical Alerts</span>
          </div>
          <div className="stat-item warning">
            <span className="stat-number">{stats.totalPatients}</span>
            <span className="stat-text">👥 Patients Monitored</span>
          </div>
          <div className="stat-item success">
            <span className="stat-number">{stats.avgRiskScore}%</span>
            <span className="stat-text">📊 Avg Risk Score</span>
          </div>
          <div className="stat-item info">
            <span className="stat-number">{stats.recoveryRate}%</span>
            <span className="stat-text">📈 Recovery Rate</span>
          </div>
        </div>
      </header>

      {/* Voice Assistant Widget */}
      {showVoiceAssistant && (
        <VoiceAssistant
          patientId={selectedPatient?.id}
          role="doctor"
          onSuggestion={handleVoiceCommand}
          isActive={true}
        />
      )}

      {/* Navigation Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'monitoring' ? 'active' : ''}`}
          onClick={() => setActiveTab('monitoring')}
        >
          📊 Real-Time Monitoring
        </button>
        <button
          className={`tab-btn ${activeTab === 'ai-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-insights')}
        >
          🤖 AI Insights
        </button>
        <button
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          🚨 Alerts & Notifications
        </button>
        <button
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📈 Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="section-title">👥 Patient Overview</div>
            <div className="patients-grid">
              {patients.map(patient => (
                <div
                  key={patient.id}
                  className={`patient-overview-card ${patient.riskScore >= 70 ? 'critical' : patient.riskScore >= 40 ? 'warning' : 'stable'}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="patient-overview-header">
                    <div className="patient-name">{patient.name}</div>
                    <div className="risk-score" style={{
                      background: patient.riskScore >= 70 ? '#FF1744' : patient.riskScore >= 40 ? '#FF9100' : '#4CAF50'
                    }}>
                      {patient.riskScore}%
                    </div>
                  </div>

                  <div className="patient-info-grid">
                    <span className="info-item">🏥 {patient.ward}</span>
                    <span className="info-item">👤 Age {patient.age}</span>
                    <span className="info-item">{patient.status === 'Stable' ? '🟢' : '🟡'} {patient.status}</span>
                  </div>

                  <div className="vitals-mini">
                    <span>❤️ {Math.round(patient.vitals.hr)} bpm</span>
                    <span>💨 {Math.round(patient.vitals.spo2)}%</span>
                    <span>🌡️ {patient.vitals.temp}°C</span>
                  </div>

                  <button className="view-btn">View Details →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-Time Monitoring Tab */}
        {activeTab === 'monitoring' && (
          <RealTimeMonitoring
            patients={patients}
            role="doctor"
            onAlert={handleAlert}
          />
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <AIAdvisor
            context={{ patients, alerts }}
            role="doctor"
            patientId={selectedPatient?.id}
            onInsight={(insights) => console.log('Insights:', insights)}
          />
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="alerts-section">
            <div className="section-title">🚨 Active Alerts</div>
            {alerts.length > 0 ? (
              <div className="alerts-list">
                {alerts.map((alert, idx) => (
                  <div key={idx} className={`alert-item alert-${alert.severity || 'warning'}`}>
                    <span className="alert-icon">⚠️</span>
                    <div className="alert-content">
                      <h4>{alert.message || 'Patient Alert'}</h4>
                      <p>{alert.description || 'Monitor patient closely'}</p>
                    </div>
                    <button className="alert-action-btn">Acknowledge</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-alerts">
                <span className="no-alerts-icon">✓</span>
                <p>No active alerts. All patients stable.</p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <div className="section-title">📈 Department Analytics</div>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Patient Recovery Rate</h3>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}>85%</div>
                </div>
              </div>
              <div className="analytics-card">
                <h3>Average Response Time</h3>
                <div className="metric">2.5 minutes</div>
              </div>
              <div className="analytics-card">
                <h3>AI Prediction Accuracy</h3>
                <div className="metric">98.7%</div>
              </div>
              <div className="analytics-card">
                <h3>Alert Resolution Time</h3>
                <div className="metric">3.2 minutes</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => alert('Opening new report form...')}>
        ➕
      </button>
    </div>
  );
};

export default EnhancedDoctorDashboard;
