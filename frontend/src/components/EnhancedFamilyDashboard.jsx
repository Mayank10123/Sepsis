import React, { useState, useEffect } from 'react';
import './EnhancedFamilyDashboard.css';
import { familyAPI, aiAPI, messagingAPI } from '../api/client';
import AIAdvisor from './AIAdvisor';
import VoiceAssistant from './VoiceAssistant';

const EnhancedFamilyDashboard = () => {
  const familyId = localStorage.getItem('family_id') || 'FAM001';
  const [patientStatus, setPatientStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const [careTips, setCareTips] = useState([]);
  const [familyMessages, setFamilyMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [visitation, setVisitation] = useState([]);

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      // Load patient status
      const statusResponse = await familyAPI.getPatientStatus('42');
      setPatientStatus({
        name: 'Jameson Blake',
        relationship: 'Father',
        age: 45,
        ward: 'ICU B, Bed 04',
        condition: 'Improving',
        riskScore: 45,
        vitals: {
          hr: 95,
          spo2: 96,
          temp: 37.5,
          rr: 18
        },
        doctorName: 'Dr. Smith',
        admissionDate: '2024-04-15',
        updateTime: new Date()
      });

      // Mock care tips from AI
      setCareTips([
        {
          id: 1,
          title: 'Emotional Support',
          description: 'Your presence and encouragement are valuable. Talk to the patient about positive topics.',
          icon: '💝'
        },
        {
          id: 2,
          title: 'Monitor Updates',
          description: 'Check the dashboard daily for updates on vitals and medical progress.',
          icon: '📊'
        },
        {
          id: 3,
          title: 'Help with Recovery',
          description: 'Follow care instructions from medical staff. Help with light activities when permitted.',
          icon: '💪'
        },
        {
          id: 4,
          title: 'Maintain Hygiene',
          description: 'Wash hands before visits. Follow hospital COVID-19 protocols.',
          icon: '🧼'
        },
        {
          id: 5,
          title: 'Nutrition Support',
          description: 'Encourage healthy eating. Bring approved foods if permitted by medical team.',
          icon: '🍎'
        },
        {
          id: 6,
          title: 'Document Progress',
          description: 'Keep records of patient responses to treatment and share observations with doctors.',
          icon: '📝'
        }
      ]);

      // Mock alerts
      setAlerts([
        {
          id: 1,
          type: 'positive',
          message: 'Temperature reduced by 1.2°C',
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'positive',
          message: 'Heart rate stabilizing',
          time: '1 hour ago'
        }
      ]);

      // Mock visitation schedule
      setVisitation([
        { id: 1, name: 'Mom', time: '10:00 AM', status: 'Scheduled' },
        { id: 2, name: 'Sister', time: '2:00 PM', status: 'Scheduled' },
        { id: 3, name: 'Brother', time: '6:00 PM', status: 'Confirmed' }
      ]);
    } catch (err) {
      console.error('Error loading family data:', err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await messagingAPI.sendMessage('42', newMessage);
      setFamilyMessages([...familyMessages, {
        text: newMessage,
        sender: 'family',
        time: new Date(),
        from: 'You'
      }]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  if (!patientStatus) {
    return <div className="family-dashboard loading"><div className="loader"></div></div>;
  }

  return (
    <div className="enhanced-family-dashboard">
      {/* Header */}
      <header className="family-dashboard-header">
        <div className="header-left">
          <div className="family-avatar">👨‍👩‍👧</div>
          <div className="family-greeting">
            <h1>Family Care Portal</h1>
            <p>Caring for {patientStatus.name}</p>
          </div>
        </div>

        <div className="header-right">
          <button className="voice-btn" onClick={() => setShowVoiceAssistant(!showVoiceAssistant)}>
            🎤 Get Tips
          </button>
          <button className="notify-btn">🔔 Notifications (2)</button>
          <button className="settings-btn">⚙️</button>
        </div>
      </header>

      {/* Patient Status Overview */}
      <div className="patient-status-overview">
        <div className="status-main-card">
          <div className="status-header">
            <div>
              <h2>{patientStatus.name}</h2>
              <p>Ward: {patientStatus.ward}</p>
            </div>
            <div className={`condition-badge ${patientStatus.condition.toLowerCase()}`}>
              {patientStatus.condition}
            </div>
          </div>

          <div className="vitals-snapshot">
            <div className="vital">
              <span className="vital-label">Heart Rate</span>
              <span className="vital-value">{patientStatus.vitals.hr} bpm</span>
              <span className="vital-status">✓ Stable</span>
            </div>
            <div className="vital">
              <span className="vital-label">O₂ Saturation</span>
              <span className="vital-value">{patientStatus.vitals.spo2}%</span>
              <span className="vital-status">✓ Good</span>
            </div>
            <div className="vital">
              <span className="vital-label">Temperature</span>
              <span className="vital-value">{patientStatus.vitals.temp}°C</span>
              <span className="vital-status">⚠ Elevated</span>
            </div>
            <div className="vital">
              <span className="vital-label">Risk Score</span>
              <span className="vital-value">{patientStatus.riskScore}%</span>
              <span className="vital-status">📈 Improving</span>
            </div>
          </div>

          <div className="status-details">
            <span>Doctor: {patientStatus.doctorName} | Admitted: {patientStatus.admissionDate}</span>
            <span className="last-update">Last update: {patientStatus.updateTime?.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Recent Alerts */}
        <div className="recent-alerts">
          <h3>📊 Recent Updates</h3>
          {alerts.map(alert => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <span className="alert-icon">✓</span>
              <div>
                <p>{alert.message}</p>
                <span className="alert-time">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Assistant */}
      {showVoiceAssistant && (
        <VoiceAssistant
          patientId="42"
          role="family"
          onSuggestion={(suggestion) => console.log('Family suggestion:', suggestion)}
          isActive={true}
        />
      )}

      {/* Navigation Tabs */}
      <div className="family-tabs">
        <button
          className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          🏥 Status & Updates
        </button>
        <button
          className={`tab-btn ${activeTab === 'care-tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('care-tips')}
        >
          💡 Care Tips
        </button>
        <button
          className={`tab-btn ${activeTab === 'communicate' ? 'active' : ''}`}
          onClick={() => setActiveTab('communicate')}
        >
          💬 Communicate
        </button>
        <button
          className={`tab-btn ${activeTab === 'visitation' ? 'active' : ''}`}
          onClick={() => setActiveTab('visitation')}
        >
          🎫 Visitation
        </button>
        <button
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          📚 Resources
        </button>
      </div>

      {/* Tab Content */}
      <div className="family-tab-content">
        {/* Status Tab */}
        {activeTab === 'status' && (
          <div className="status-tab">
            <div className="section-title">📋 Detailed Health Status</div>

            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker">✓</div>
                <div className="timeline-content">
                  <h4>Fever Reduced</h4>
                  <p>Temperature decreased from 39.2°C to 37.5°C</p>
                  <span className="timeline-date">Today, 3:00 PM</span>
                </div>
              </div>

              <div className="timeline-item completed">
                <div className="timeline-marker">✓</div>
                <div className="timeline-content">
                  <h4>Heart Rate Stabilized</h4>
                  <p>Consistent readings around 95 bpm for the last 6 hours</p>
                  <span className="timeline-date">Today, 12:30 PM</span>
                </div>
              </div>

              <div className="timeline-item in-progress">
                <div className="timeline-marker">⟳</div>
                <div className="timeline-content">
                  <h4>Antibiotic Treatment</h4>
                  <p>Response to antibiotics showing positive signs</p>
                  <span className="timeline-date">Ongoing</span>
                </div>
              </div>

              <div className="timeline-item pending">
                <div className="timeline-marker">○</div>
                <div className="timeline-content">
                  <h4>Physical Assessment</h4>
                  <p>Scheduled for tomorrow morning at 9:00 AM</p>
                  <span className="timeline-date">Tomorrow</span>
                </div>
              </div>
            </div>

            <div className="doctor-notes">
              <div className="section-title">📝 Doctor's Notes</div>
              <div className="notes-card">
                <p>Patient is responding well to current treatment protocol. Vital signs are stabilizing. Continue with current medication regimen. Physical therapy can begin as tolerated. Family involvement in care is encouraged.</p>
                <span className="notes-author">- Dr. Smith, Attending Physician</span>
              </div>
            </div>
          </div>
        )}

        {/* Care Tips Tab */}
        {activeTab === 'care-tips' && (
          <div className="care-tips-tab">
            <AIAdvisor
              context={{ patient: patientStatus }}
              role="family"
              patientId="42"
              onInsight={(insights) => console.log('Family care insights:', insights)}
            />

            <div className="care-tips-grid">
              <div className="section-title" style={{ gridColumn: '1 / -1' }}>💡 AI-Powered Care Guidelines</div>
              {careTips.map(tip => (
                <div key={tip.id} className="care-tip-card">
                  <div className="tip-icon">{tip.icon}</div>
                  <h4>{tip.title}</h4>
                  <p>{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="important-info">
              <div className="section-title">⚠️ Important Information</div>
              <ul className="info-list">
                <li>Contact doctor immediately if temperature exceeds 39°C</li>
                <li>Monitor fluid intake - ensure patient drinks 2-3 liters daily</li>
                <li>Report any changes in mental state or responsiveness</li>
                <li>Help patient maintain rest schedule (8+ hours sleep)</li>
                <li>Follow infection control procedures when visiting</li>
              </ul>
            </div>
          </div>
        )}

        {/* Communication Tab */}
        {activeTab === 'communicate' && (
          <div className="communicate-tab">
            <div className="section-title">💬 Stay Connected</div>

            <div className="message-display">
              {familyMessages.length === 0 ? (
                <div className="no-messages">
                  <span className="no-msg-icon">💌</span>
                  <p>No messages yet. Start a conversation!</p>
                </div>
              ) : (
                familyMessages.map((msg, idx) => (
                  <div key={idx} className={`message-bubble ${msg.sender}`}>
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-meta">{msg.from} • {msg.time?.toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="message-compose">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Send an encouraging message to the patient..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="send-btn">📤 Send</button>
            </div>

            <div className="quick-actions">
              <div className="section-title">⚡ Quick Actions</div>
              <div className="actions-grid">
                <button className="action-card">📞 Call Doctor</button>
                <button className="action-card">🚑 Emergency Alert</button>
                <button className="action-card">📋 Request Info</button>
                <button className="action-card">👥 Add Family Member</button>
              </div>
            </div>
          </div>
        )}

        {/* Visitation Tab */}
        {activeTab === 'visitation' && (
          <div className="visitation-tab">
            <div className="section-title">🎫 Visitation Schedule</div>

            <div className="visit-schedule">
              {visitation.map(visit => (
                <div key={visit.id} className={`visit-card ${visit.status.toLowerCase()}`}>
                  <div className="visit-info">
                    <h4>{visit.name}</h4>
                    <p>🕐 {visit.time}</p>
                  </div>
                  <span className="visit-status">{visit.status}</span>
                </div>
              ))}
            </div>

            <div className="visit-guidelines">
              <div className="section-title">📋 Visitation Guidelines</div>
              <div className="guidelines-card">
                <h4>⏰ Visiting Hours</h4>
                <p>Monday - Sunday: 9:00 AM - 8:00 PM</p>

                <h4>👥 Restrictions</h4>
                <ul>
                  <li>Maximum 2 visitors at a time</li>
                  <li>Children under 12 only with special permission</li>
                  <li>No outside food</li>
                  <li>Mobile phones on silent</li>
                </ul>

                <h4>🧼 Safety Measures</h4>
                <ul>
                  <li>Wash hands with sanitizer before entry</li>
                  <li>Wear provided PPE if required</li>
                  <li>Maintain distance of 6 feet</li>
                  <li>No physical contact</li>
                </ul>

                <button className="book-visit-btn">📅 Book Your Visit</button>
              </div>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="resources-tab">
            <div className="section-title">📚 Helpful Resources</div>

            <div className="resources-grid">
              <div className="resource-card">
                <h4>🏥 Hospital Information</h4>
                <p>Location, services, and general information about the hospital</p>
                <button>Learn More →</button>
              </div>

              <div className="resource-card">
                <h4>💊 Medication Guide</h4>
                <p>Understanding common medications and their effects</p>
                <button>Learn More →</button>
              </div>

              <div className="resource-card">
                <h4>🧠 Mental Health Support</h4>
                <p>Resources for families dealing with patient illness</p>
                <button>Learn More →</button>
              </div>

              <div className="resource-card">
                <h4>📞 Support Hotlines</h4>
                <p>24/7 support and counseling services for families</p>
                <button>Learn More →</button>
              </div>

              <div className="resource-card">
                <h4>📖 Educational Videos</h4>
                <p>Learn about sepsis, recovery, and care techniques</p>
                <button>Learn More →</button>
              </div>

              <div className="resource-card">
                <h4>👥 Support Groups</h4>
                <p>Connect with other families going through similar experiences</p>
                <button>Learn More →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedFamilyDashboard;
