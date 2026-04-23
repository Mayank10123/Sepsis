import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DoctorViewPatient42Detail.css';
import LiveVitalsChart from './LiveVitalsChart';
import SepsisProtocolWizard from './SepsisProtocolWizard';
import MedicationTracker from './MedicationTracker';
import VoiceAssistant from './VoiceAssistant';
import NotificationCenter from './NotificationCenter';
import AIDigitalTwin from './AIDigitalTwin';
import SentinelBriefing from './SentinelBriefing';
import XAIReasoningPanel from './XAIReasoningPanel';
import SentinelWardMap from './SentinelWardMap';
import InterventionSimulator from './InterventionSimulator';
import ClinicalIntelligenceSuite from './ClinicalIntelligenceSuite';
import GroqIntelligenceCenter from './GroqIntelligenceCenter';
import MultiModalAggregator from './MultiModalAggregator';
import GroqPrescriptiveEngine from './GroqPrescriptiveEngine';
import SentinelBiometricVest from './SentinelBiometricVest';

export default function DoctorViewPatient42Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showWizard, setShowWizard] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const patient = {
    id: 42,
    name: 'Jameson Blake',
    age: 64,
    gender: 'Male',
    room: 'ICU B-04',
    admission: 'Oct 23, 11:20 AM',
    riskScore: 45,
    riskTrend: 'rising',
    vitals: [
      { label: 'HEART RATE', value: 114, unit: 'bpm', status: 'CRITICAL', trend: [92, 98, 104, 110, 114], icon: 'favorite' },
      { label: 'TEMPERATURE', value: '38.9°C', status: 'RISING', trend: [37.2, 37.8, 38.2, 38.6, 38.9], icon: 'device_thermostat' },
      { label: 'RESP. RATE', value: 28, unit: '/min', status: 'CRITICAL', trend: [18, 20, 22, 26, 28], icon: 'airway' },
      { label: 'LACTATE', value: 2.1, unit: 'mmol/l', status: 'ELEVATED', trend: [1.1, 1.3, 1.6, 1.9, 2.1], icon: 'water_drop' }
    ],
    timeline: [
      { time: '14:12', type: 'vital', text: 'SpO2 dropped below 90% (88%) alert triggered', severity: 'error' },
      { time: '13:55', type: 'med', text: 'Acetaminophen 650mg IV administered', severity: 'info' },
      { time: '13:30', type: 'lab', text: 'Blood Culture results pending (STAT ordered)', severity: 'warning' },
      { time: '12:45', type: 'vital', text: 'Temp spike detected: 38.6°C (+0.4°C/hr)', severity: 'warning' }
    ]
  };

  return (
    <div className="patient-detail-view sg-fade-in">
      {/* Alert Banner */}
      <div className="alert-banner-top">
        <span className="material-symbols-outlined filled">report</span>
        <p>Patient #42: Early sepsis signal detected by AI system. Clinical review required.</p>
        <button className="banner-dismiss">DISMISS</button>
      </div>

      {/* Header */}
      <header className="detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/doctor')}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="patient-header-info">
            <h1>Jameson Blake <span className="header-id">#42</span></h1>
            <p>{patient.room} • {patient.gender}, {patient.age}y • Admitted: {patient.admission}</p>
          </div>
        </div>
        <div className="header-actions">
          <div className="header-notif-container">
            <button className="sg-btn sg-btn-outline icon-only" onClick={() => setShowNotifs(!showNotifs)}>
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <NotificationCenter isOpen={showNotifs} onClose={() => setShowNotifs(false)} />
          </div>
          <button className="sg-btn sg-btn-outline">
            <span className="material-symbols-outlined">biotech</span>
            Order Labs
          </button>
          <button className="sg-btn sg-btn-outline">
            <span className="material-symbols-outlined">chat</span>
            Message Team
          </button>
          <button className="sg-btn sg-btn-danger" onClick={() => setShowWizard(true)}>
            <span className="material-symbols-outlined">emergency_home</span>
            Escalate Protocol
          </button>
        </div>
      </header>

      {showWizard && <SepsisProtocolWizard patientId={id} onClose={() => setShowWizard(false)} />}

      <div className="detail-grid">
        {/* Left Column: Analytics */}
        <div className="detail-left">
           <MultiModalAggregator />
           
           <GroqIntelligenceCenter role="doctor" />

           {/* Risk Overview Card */}
          <div className="risk-overview-card sg-card">
              <SentinelBriefing role="doctor" />
          </div>

          <AIDigitalTwin vitals={{hr: 114, spO2: 88, lactate: 2.1, temp: 38.9}} role="doctor" />

          <XAIReasoningPanel score={45} />

          {/* Vitals Grid */}
          <div className="vitals-grid">
            {patient.vitals.map((v, i) => (
              <div key={i} className={`vital-card sg-card ${v.status.toLowerCase()}`}>
                <div className="vital-head">
                  <span className="material-symbols-outlined">{v.icon}</span>
                  <span className="vital-label">{v.label}</span>
                </div>
                <div className="vital-main">
                  <span className="vital-value">{v.value}</span>
                  <span className="vital-unit">{v.unit}</span>
                </div>
                <div className="vital-status">
                  <span className="status-indicator"></span>
                  {v.status}
                </div>
                <div className="vital-mini-spark">
                  {/* Simplified sparkline */}
                  {v.trend.map((point, idx) => (
                    <div key={idx} className="spark-bar" style={{height: `${(point / 150) * 100}%`}}></div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Live Vitals Chart Integration */}
          <div className="live-chart-container sg-card">
            <div className="chart-header">
              <h3>Real-time Monitoring Overview</h3>
              <div className="chart-legend">
                <span className="legend-item"><span className="dot hr"></span> HR</span>
                <span className="legend-item"><span className="dot o2"></span> SpO2</span>
              </div>
            </div>
            <div className="chart-content">
               <LiveVitalsChart patientId={id} />
            </div>
          </div>

          <div className="bottom-row-widgets">
             <MedicationTracker patientId={id} />
             <VoiceAssistant patientId={id} role="doctor" />
          </div>
        </div>

        {/* Right Column: Timeline & Protocol */}
        <div className="detail-right">
          <GroqPrescriptiveEngine role="doctor" />
          
          <SentinelBiometricVest />

          <ClinicalIntelligenceSuite />
          
          <SentinelWardMap />
          
          <InterventionSimulator />

          {/* Protocol Card */}
          <div className="protocol-action-card sg-card-elevated">
            <h3>Protocol Recommendation</h3>
            <p className="protocol-desc">AI recommends starting the <strong>Hour-1 Sepsis Bundle</strong>.</p>
            <div className="protocol-steps">
               <div className="step-item checked">
                 <span className="material-symbols-outlined">check_circle</span>
                 Measure lactate level
               </div>
               <div className="step-item pending">
                 <span className="material-symbols-outlined">radio_button_unchecked</span>
                 Obtain blood cultures
               </div>
               <div className="step-item pending">
                 <span className="material-symbols-outlined">radio_button_unchecked</span>
                 Administer antibiotics
               </div>
            </div>
            <button className="sg-btn sg-btn-primary full-width">START PROTOCOL</button>
          </div>

          {/* Timeline */}
          <div className="clinical-timeline sg-card">
            <div className="timeline-header">
              <h3>Clinical Timeline</h3>
              <div className="timeline-tabs">
                <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
                <button className={activeTab === 'vitals' ? 'active' : ''} onClick={() => setActiveTab('vitals')}>Vitals</button>
                <button className={activeTab === 'labs' ? 'active' : ''} onClick={() => setActiveTab('labs')}>Labs</button>
              </div>
            </div>
            <div className="timeline-list">
               {patient.timeline.map((entry, idx) => (
                 <div key={idx} className={`timeline-entry ${entry.severity}`}>
                   <div className="entry-dot"></div>
                   <div className="entry-content">
                     <span className="entry-time">{entry.time}</span>
                     <p className="entry-text">{entry.text}</p>
                   </div>
                 </div>
               ))}
            </div>
            <button className="view-full-timeline">VIEW FULL HISTORY</button>
          </div>
        </div>
      </div>
    </div>
  );
}
