import React, { useState, useEffect } from 'react';
import './EnhancedPatientDashboard.css';
import { patientAPI, aiAPI, familyAPI, messagingAPI } from '../api/client';
import AIAdvisor from './AIAdvisor';
import VoiceAssistant from './VoiceAssistant';

const EnhancedPatientDashboard = () => {
  const patientId = localStorage.getItem('patient_id') || '42';
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('health');
  const [vitals, setVitals] = useState(null);
  const [recoveryPlan, setRecoveryPlan] = useState(null);
  const [familyNotifications, setFamilyNotifications] = useState([]);
  const [medications, setMedications] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadPatientData();
  }, [patientId]);

  const loadPatientData = async () => {
    try {
      // Load patient vitals
      const vitalsResponse = await patientAPI.getVitals(patientId);
      setVitals(vitalsResponse.data);

      // Load recovery suggestions from AI
      const recoveryResponse = await aiAPI.getRecoverySuggestions(patientId);
      setRecoveryPlan(recoveryResponse.data);

      // Load family notifications
      const notifResponse = await familyAPI.getNotifications();
      setFamilyNotifications(notifResponse.data?.notifications || []);

      // Mock patient data
      setPatient({
        id: patientId,
        name: localStorage.getItem('name') || 'Patient 42',
        age: 45,
        ward: 'ICU B, Bed 04',
        doctorName: 'Dr. Smith',
        admissionDate: '2024-04-15',
        condition: 'Suspected Sepsis - Under Monitoring'
      });

      // Mock medications
      setMedications([
        { id: 1, name: 'Antibiotics', dosage: '500mg', frequency: '3x daily', status: 'taken' },
        { id: 2, name: 'Fluids IV', dosage: '1L/hour', frequency: 'Continuous', status: 'active' },
        { id: 3, name: 'Paracetamol', dosage: '650mg', frequency: 'As needed', status: 'pending' }
      ]);

      // Mock milestones
      setMilestones([
        { id: 1, title: 'Fever Reduction', status: 'completed', date: '2024-04-18' },
        { id: 2, title: 'Heart Rate Stabilized', status: 'in-progress', date: 'Today' },
        { id: 3, title: 'Begin Physical Therapy', status: 'pending', date: '2024-04-20' },
        { id: 4, title: 'Discharge Planning', status: 'pending', date: '2024-04-22' }
      ]);
    } catch (err) {
      console.error('Error loading patient data:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messagingAPI.sendMessage('family', newMessage);
      setMessages([...messages, { text: newMessage, sender: 'patient', time: new Date() }]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleMedicationTaken = (medId) => {
    setMedications(medications.map(med =>
      med.id === medId ? { ...med, status: 'taken' } : med
    ));
  };

  if (!patient) {
    return <div className="patient-dashboard loading"><div className="loader"></div></div>;
  }

  return (
    <div className="enhanced-patient-dashboard">
      {/* Header */}
      <header className="patient-dashboard-header">
        <div className="header-left">
          <div className="patient-avatar">{patient.name.charAt(0)}</div>
          <div className="patient-greeting">
            <h1>Welcome back, {patient.name.split(' ')[0]}</h1>
            <p>Ward: {patient.ward} | Doctor: {patient.doctorName}</p>
          </div>
        </div>

        <div className="header-right">
          <button className="voice-btn" onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}>
            🎤 Ask AI
          </button>
          <button className="family-btn">👨‍👩‍👧 Family</button>
          <button className="settings-btn">⚙️</button>
        </div>
      </header>

      {/* Voice Assistant */}
      {showVoiceAssistant && (
        <VoiceAssistant
          patientId={patientId}
          role="patient"
          onSuggestion={(suggestion) => console.log('Suggestion:', suggestion)}
          isActive={true}
        />
      )}

      {/* Health Status Overview */}
      <div className="health-status-banner">
        <div className="status-card">
          <span className="status-icon">❤️</span>
          <div>
            <span className="status-label">Heart Rate</span>
            <span className="status-value">{vitals?.hr || 95} bpm</span>
          </div>
          <span className="status-indicator">✓ Normal</span>
        </div>
        <div className="status-card">
          <span className="status-icon">💨</span>
          <div>
            <span className="status-label">O₂ Saturation</span>
            <span className="status-value">{vitals?.spo2 || 96}%</span>
          </div>
          <span className="status-indicator">✓ Healthy</span>
        </div>
        <div className="status-card">
          <span className="status-icon">🌡️</span>
          <div>
            <span className="status-label">Temperature</span>
            <span className="status-value">{vitals?.temp || 37.5}°C</span>
          </div>
          <span className="status-indicator">⚠ Elevated</span>
        </div>
        <div className="status-card">
          <span className="status-icon">💪</span>
          <div>
            <span className="status-label">Recovery</span>
            <span className="status-value">75%</span>
          </div>
          <span className="status-indicator">📈 On Track</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="patient-tabs">
        <button
          className={`tab-btn ${activeTab === 'health' ? 'active' : ''}`}
          onClick={() => setActiveTab('health')}
        >
          🏥 My Health
        </button>
        <button
          className={`tab-btn ${activeTab === 'recovery' ? 'active' : ''}`}
          onClick={() => setActiveTab('recovery')}
        >
          🎯 Recovery Plan
        </button>
        <button
          className={`tab-btn ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          💊 Medications
        </button>
        <button
          className={`tab-btn ${activeTab === 'family' ? 'active' : ''}`}
          onClick={() => setActiveTab('family')}
        >
          👨‍👩‍👧 Family Updates
        </button>
        <button
          className={`tab-btn ${activeTab === 'ai-insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-insights')}
        >
          🤖 AI Tips
        </button>
      </div>

      {/* Tab Content */}
      <div className="patient-tab-content">
        {/* My Health Tab */}
        {activeTab === 'health' && (
          <div className="health-tab">
            <div className="section-title">📊 Your Vital Signs Trend</div>
            <div className="vitals-charts">
              <div className="chart-container">
                <div className="chart-title">Heart Rate (bpm)</div>
                <div className="mini-chart">
                  <div className="chart-bar" style={{ height: '45%' }}></div>
                  <div className="chart-bar" style={{ height: '50%' }}></div>
                  <div className="chart-bar" style={{ height: '48%' }}></div>
                  <div className="chart-bar" style={{ height: '52%' }}></div>
                  <div className="chart-bar" style={{ height: '55%' }}></div>
                </div>
                <span className="chart-range">Last 5 hours</span>
              </div>

              <div className="chart-container">
                <div className="chart-title">Temperature (°C)</div>
                <div className="mini-chart">
                  <div className="chart-bar" style={{ height: '60%' }}></div>
                  <div className="chart-bar" style={{ height: '65%' }}></div>
                  <div className="chart-bar" style={{ height: '58%' }}></div>
                  <div className="chart-bar" style={{ height: '55%' }}></div>
                  <div className="chart-bar" style={{ height: '52%' }}></div>
                </div>
                <span className="chart-range">Last 5 hours</span>
              </div>

              <div className="chart-container">
                <div className="chart-title">O₂ Saturation (%)</div>
                <div className="mini-chart">
                  <div className="chart-bar" style={{ height: '96%' }}></div>
                  <div className="chart-bar" style={{ height: '97%' }}></div>
                  <div className="chart-bar" style={{ height: '96%' }}></div>
                  <div className="chart-bar" style={{ height: '97%' }}></div>
                  <div className="chart-bar" style={{ height: '98%' }}></div>
                </div>
                <span className="chart-range">Last 5 hours</span>
              </div>
            </div>

            {/* Recovery Milestones */}
            <div className="milestones-section">
              <div className="section-title">🎯 Recovery Milestones</div>
              <div className="milestones-list">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className={`milestone ${milestone.status}`}>
                    <div className="milestone-checkbox">
                      {milestone.status === 'completed' && '✓'}
                      {milestone.status === 'in-progress' && '⟳'}
                    </div>
                    <div className="milestone-content">
                      <h4>{milestone.title}</h4>
                      <p>{milestone.date}</p>
                    </div>
                    <div className="milestone-status">{milestone.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recovery Plan Tab */}
        {activeTab === 'recovery' && (
          <AIAdvisor
            context={{ patient, vitals }}
            role="patient"
            patientId={patientId}
            onInsight={(insights) => console.log('Recovery insights:', insights)}
          />
        )}

        {/* Medications Tab */}
        {activeTab === 'medications' && (
          <div className="medications-tab">
            <div className="section-title">💊 Your Medications</div>
            <div className="medications-list">
              {medications.map((med) => (
                <div key={med.id} className={`medication-card ${med.status}`}>
                  <div className="med-icon">
                    {med.status === 'taken' ? '✓' : med.status === 'pending' ? '⏰' : '⚙️'}
                  </div>
                  <div className="med-info">
                    <h4>{med.name}</h4>
                    <p>{med.dosage} | {med.frequency}</p>
                  </div>
                  <div className="med-status">
                    {med.status === 'pending' && (
                      <button
                        className="take-btn"
                        onClick={() => handleMedicationTaken(med.id)}
                      >
                        Mark as Taken
                      </button>
                    )}
                    {med.status === 'taken' && <span className="taken-badge">Taken</span>}
                    {med.status === 'active' && <span className="active-badge">Active</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="reminder-section">
              <div className="section-title">🔔 Med Reminders</div>
              <div className="reminder-card">
                <span>🕐 Next dose: Antibiotics in 2 hours</span>
                <button className="snooze-btn">Snooze 30min</button>
              </div>
            </div>
          </div>
        )}

        {/* Family Updates Tab */}
        {activeTab === 'family' && (
          <div className="family-tab">
            <div className="section-title">👨‍👩‍👧 Messages with Family</div>

            <div className="message-container">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender}`}>
                  <p>{msg.text}</p>
                  <span className="message-time">{msg.time?.toLocaleTimeString()}</span>
                </div>
              ))}

              {familyNotifications.length > 0 && (
                <div className="family-notifications">
                  <div className="section-title">📬 Updates</div>
                  {familyNotifications.map((notif, idx) => (
                    <div key={idx} className="notification-item">
                      <span className="notif-icon">👨‍👩‍👧</span>
                      <div>
                        <h4>{notif.from}</h4>
                        <p>{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="message-input-area">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Share an update with your family..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="send-btn">📤</button>
            </div>
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai-insights' && (
          <div className="ai-insights-tab">
            <AIAdvisor
              context={{
                patient,
                vitals,
                medications
              }}
              role="patient"
              patientId={patientId}
              onInsight={(insights) => console.log('Patient AI insights:', insights)}
            />

            <div className="ai-tips-section">
              <div className="section-title">💡 AI Care Tips</div>
              <div className="tips-grid">
                <div className="tip-card">
                  <span className="tip-icon">💧</span>
                  <h4>Stay Hydrated</h4>
                  <p>Drink water regularly to support your body's recovery. Aim for 8-10 glasses daily.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">😴</span>
                  <h4>Rest Well</h4>
                  <p>Quality sleep is crucial for recovery. Try to maintain consistent sleep schedule.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🚶</span>
                  <h4>Light Activity</h4>
                  <p>As approved by your doctor, light walking can improve circulation and recovery.</p>
                </div>
                <div className="tip-card">
                  <span className="tip-icon">🎵</span>
                  <h4>Stress Relief</h4>
                  <p>Relaxation techniques like deep breathing can help with overall recovery.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPatientDashboard;
