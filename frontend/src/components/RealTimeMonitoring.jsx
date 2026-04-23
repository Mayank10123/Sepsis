import React, { useState, useEffect } from 'react';
import './RealTimeMonitoring.css';

export default function RealTimeMonitoring({ patients = [], role = 'doctor', onAlert = null }) {
  const [monitoringData, setMonitoringData] = useState(patients);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [expandedDetails, setExpandedDetails] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitoringData(prev => prev.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          hr: Math.max(60, Math.min(120, patient.vitals.hr + (Math.random() - 0.5) * 4)),
          spo2: Math.max(94, Math.min(100, patient.vitals.spo2 + (Math.random() - 0.5) * 0.5)),
          temp: Math.max(36.5, Math.min(38.5, patient.vitals.temp + (Math.random() - 0.5) * 0.1)),
          rr: Math.max(12, Math.min(24, patient.vitals.rr + (Math.random() - 0.5) * 1))
        }
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Check for alerts
  useEffect(() => {
    const newAlerts = monitoringData
      .filter(p => p.vitals.hr > 110 || p.vitals.spo2 < 95 || p.vitals.temp > 38.5)
      .map(p => ({
        patientId: p.id,
        message: `${p.name} showing abnormal vitals`,
        severity: p.vitals.hr > 115 ? 'critical' : 'warning'
      }));

    setAlerts(newAlerts);

    if (onAlert && newAlerts.length > 0) {
      onAlert(newAlerts[0]);
    }
  }, [monitoringData, onAlert]);

  const getRiskLevel = (vitals) => {
    let risk = 0;
    if (vitals.hr > 110) risk += 30;
    if (vitals.spo2 < 95) risk += 40;
    if (vitals.temp > 38.5) risk += 30;
    return Math.min(100, risk);
  };

  const getRiskColor = (risk) => {
    if (risk >= 70) return '#FF1744';
    if (risk >= 50) return '#FF9100';
    if (risk >= 30) return '#FFC107';
    return '#4CAF50';
  };

  return (
    <div className="realtime-monitoring">
      {/* Header */}
      <div className="monitoring-header">
        <h2>🎯 Real-Time Patient Monitoring</h2>
        <div className="monitoring-stats">
          <div className="stat">
            <span className="stat-label">Patients</span>
            <span className="stat-value">{monitoringData.length}</span>
          </div>
          <div className="stat alert-stat">
            <span className="stat-label">Alerts</span>
            <span className="stat-value">{alerts.length}</span>
          </div>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div className="alerts-banner">
          {alerts.map((alert, idx) => (
            <div key={idx} className={`alert-item alert-${alert.severity}`}>
              <span className="alert-icon">⚠️</span>
              <span>{alert.message}</span>
              <button className="alert-action">View Details</button>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Grid */}
      <div className="monitoring-grid">
        {monitoringData.map(patient => {
          const risk = getRiskLevel(patient.vitals);
          return (
            <div
              key={patient.id}
              className={`patient-card ${selectedPatient?.id === patient.id ? 'active' : ''}`}
              onClick={() => setSelectedPatient(patient)}
              style={{ borderLeftColor: getRiskColor(risk) }}
            >
              {/* Risk Badge */}
              <div className="risk-badge" style={{ background: getRiskColor(risk) }}>
                {Math.round(risk)}%
              </div>

              {/* Patient Header */}
              <div className="patient-header">
                <div className="patient-avatar">{patient.name.charAt(0)}</div>
                <div className="patient-info">
                  <h3>{patient.name}</h3>
                  <p>{patient.ward || 'ICU'}</p>
                </div>
              </div>

              {/* Quick Vitals */}
              <div className="quick-vitals">
                <div className="vital-item">
                  <span className="vital-icon">❤️</span>
                  <span className="vital-value">{Math.round(patient.vitals.hr)}</span>
                  <span className="vital-unit">bpm</span>
                </div>
                <div className="vital-item">
                  <span className="vital-icon">💨</span>
                  <span className="vital-value">{Math.round(patient.vitals.spo2)}</span>
                  <span className="vital-unit">%</span>
                </div>
                <div className="vital-item">
                  <span className="vital-icon">🌡️</span>
                  <span className="vital-value">{patient.vitals.temp.toFixed(1)}</span>
                  <span className="vital-unit">°C</span>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="trend-indicator">
                <span className="trend-icon">📈</span>
                <span className="trend-text">Trending {risk > 50 ? '🔴' : '🟢'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed View */}
      {selectedPatient && (
        <div className="detailed-view">
          <div className="detailed-header">
            <h3>{selectedPatient.name} - Detailed Monitoring</h3>
            <button className="close-btn" onClick={() => setSelectedPatient(null)}>✕</button>
          </div>

          <div className="detailed-content">
            {/* Vital Signs Charts */}
            <div className="vitals-section">
              <h4>📊 Vital Signs</h4>
              <div className="vitals-grid">
                <div className="vital-card">
                  <div className="vital-chart">
                    <div className="chart-bar" style={{ height: `${(selectedPatient.vitals.hr / 150) * 100}%` }}></div>
                  </div>
                  <span>Heart Rate: {Math.round(selectedPatient.vitals.hr)} bpm</span>
                </div>
                <div className="vital-card">
                  <div className="vital-chart">
                    <div className="chart-bar" style={{ height: `${(selectedPatient.vitals.spo2 / 100) * 100}%` }}></div>
                  </div>
                  <span>O₂ Sat: {Math.round(selectedPatient.vitals.spo2)}%</span>
                </div>
                <div className="vital-card">
                  <div className="vital-chart">
                    <div className="chart-bar" style={{ height: `${((selectedPatient.vitals.temp - 36) / 3) * 100}%` }}></div>
                  </div>
                  <span>Temp: {selectedPatient.vitals.temp.toFixed(1)}°C</span>
                </div>
                <div className="vital-card">
                  <div className="vital-chart">
                    <div className="chart-bar" style={{ height: `${(selectedPatient.vitals.rr / 30) * 100}%` }}></div>
                  </div>
                  <span>RR: {Math.round(selectedPatient.vitals.rr)} /min</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="action-buttons">
              <button className="action-btn primary">📞 Contact Care Team</button>
              <button className="action-btn primary">💬 Send Alert</button>
              <button className="action-btn secondary">📋 View Records</button>
              <button className="action-btn secondary">🔔 Set Alert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
