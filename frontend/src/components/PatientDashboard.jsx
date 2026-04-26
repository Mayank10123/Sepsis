import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './PatientDashboard.css';
import LiveVitalsChart from './LiveVitalsChart';
import AIDigitalTwin from './AIDigitalTwin';
import SentinelBriefing from './SentinelBriefing';
import SentinelWatchPairing from './SentinelWatchPairing';
import PatientHealingCenter from './PatientHealingCenter';
import GroqIntelligenceCenter from './GroqIntelligenceCenter';
import MultiModalAggregator from './MultiModalAggregator';
import GroqPrescriptiveEngine from './GroqPrescriptiveEngine';
import SentinelBiometricVest from './SentinelBiometricVest';

export default function PatientDashboard() {
  const [activeView, setActiveView] = useState('status');
  const [userName] = useState(localStorage.getItem('name') || 'Robert Chen');
  const [isComposing, setIsComposing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [sentTimestamp, setSentTimestamp] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Healing Milestone!', msg: 'You reached your deep breathing goal for today. Great job!', type: 'success', time: '5m ago', read: false },
    { id: 2, title: 'Roadmap Updated', msg: 'Dr. Miller added "AR Breathing Games" to your recovery plan.', type: 'info', time: '1h ago', read: false },
    { id: 3, title: 'Health Tip', msg: 'Remember to stay hydrated. Your kidney metrics are looking optimal.', type: 'info', time: '3h ago', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSendMessage = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessageSent(true);
      setSentTimestamp(new Date().toLocaleTimeString());
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const vitals = [
    { label: 'Heart Rate', value: '82', unit: 'bpm', status: 'NORMAL', icon: 'favorite', color: '#10b981' },
    { label: 'Oxygen', value: '96', unit: '%', status: 'GOOD', icon: 'airway', color: '#003f87' },
    { label: 'Temperature', value: '37.6', unit: '°C', status: 'SLIGHT RISE', icon: 'device_thermostat', color: '#f59e0b' }
  ];

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="portal-overview-content">
      {/* AI Banner */}
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <SentinelBriefing role="patient" />
      </motion.div>

      {/* Digital Twin */}
      <motion.div initial={{scale: 0.95, opacity: 0}} animate={{scale: 1, opacity: 1}} transition={{delay: 0.3}} className="patient-twin-section sg-card" style={{marginTop: '24px', marginBottom: '24px'}}>
             <AIDigitalTwin vitals={{hr: 82, spO2: 96, temp: 37.6}} role="patient" />
          </motion.div>

          {/* New Healing Center */}
          <PatientHealingCenter />

          <GroqIntelligenceCenter role="patient" />

          <div className="patient-hardware-grid">
             <SentinelBiometricVest />
             <MultiModalAggregator />
          </div>

          <GroqPrescriptiveEngine role="patient" />

          <div className="portal-bottom-grid" style={{marginTop: '24px'}}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="p-trend-section sg-card">
          <div className="section-head">
            <h3>Health Trend (24h)</h3>
            <span className="material-symbols-outlined">info</span>
          </div>
          <div className="p-main-chart-container">
            <LiveVitalsChart />
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className={`p-doctor-contact sg-card ${isComposing ? 'composing' : ''}`}>
          <AnimatePresence mode="wait">
            {!isComposing ? (
              <motion.div key="contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="contact-info">
                 <div className="p-doc-avatar">
                   <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt8S2D9y-O566EwN5z8_sREm6Ea4O4g_8xZ2F7m6vK5p8G" alt="Dr. Sarah Miller" />
                 </div>
                 <h3>Dr. Sarah Miller</h3>
                 <p className="doc-msg">"Hello Robert, your oxygen levels are looking much better this morning. Keep focusing on your breathing exercises."</p>
                 <button className="sg-btn sg-btn-primary full-width" onClick={() => setIsComposing(true)}>Message Team</button>
              </motion.div>
            ) : !messageSent ? (
              <motion.div key="composer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="card-composer">
                 <div className="composer-header">
                    <h4>Direct Care-Link</h4>
                    <button className="close-mini" onClick={() => setIsComposing(false)}>×</button>
                 </div>
                 
                 {isSending ? (
                   <div className="dispatch-loading mini">
                      <div className="dispatch-spinner"></div>
                      <p>Dispatching to ICU...</p>
                   </div>
                 ) : (
                   <>
                     <div className="symptom-chips mini">
                        {['Pain', 'Dizziness', 'Chills'].map(s => (
                          <button key={s} className="symptom-chip" onClick={handleSendMessage}>{s}</button>
                        ))}
                     </div>
                     <textarea placeholder="Type your message..." className="sg-input mini"></textarea>
                     <button className="sg-btn sg-btn-primary full-width" onClick={handleSendMessage}>SEND MESSAGE</button>
                   </>
                 )}
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card-success">
                 <span className="material-symbols-outlined success-icon">verified_user</span>
                 <h4>SENT</h4>
                 <p>Log: {sentTimestamp}</p>
                 <button className="sg-btn sg-btn-outline full-width" onClick={() => { setIsComposing(false); setMessageSent(false); }}>OK</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );

  const renderHistory = () => (
    <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="care-history-view sg-card">
       <div className="section-head">
          <span className="material-symbols-outlined">history</span>
          <h2>Care History</h2>
       </div>
       <div className="history-timeline">
          {[
            { date: 'Oct 23, 2023', event: 'Oxygen Saturation Target Met', detail: 'Reached 96% on room air.', icon: 'check_circle', color: 'var(--sg-stable)' },
            { date: 'Oct 22, 2023', event: 'IV Antibiotics Cycle 2', detail: 'Administered Vancomycin 1g.', icon: 'medication', color: 'var(--sg-primary)' },
            { date: 'Oct 22, 2023', event: 'Physiotherapy Session', detail: 'Completed 20min light mobilization.', icon: 'directions_walk', color: '#8b5cf6' },
            { date: 'Oct 21, 2023', event: 'Admission - ICU West', detail: 'Transferred from ER after initial stabilization.', icon: 'emergency', color: 'var(--sg-error)' }
          ].map((item, idx) => (
            <div key={idx} className="history-item">
               <div className="h-date">{item.date}</div>
               <div className="h-line-box">
                  <div className="h-dot" style={{background: item.color}}>
                     <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="h-line"></div>
               </div>
               <div className="h-content">
                  <h4>{item.event}</h4>
                  <p>{item.detail}</p>
               </div>
            </div>
          ))}
       </div>
    </motion.div>
  );

  const renderResources = () => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="resources-view">
       <div className="resources-header">
          <h2>Health Education</h2>
          <p>Learn more about your recovery and Sepsis care.</p>
       </div>
       <div className="resource-grid">
          {[
            { title: 'Understanding Sepsis Recovery', desc: 'What to expect in the first 72 hours of treatment.', icon: 'menu_book', color: '#003f87' },
            { title: 'Nutrition for Healing', desc: 'How high-protein diets help your body fight infection.', icon: 'restaurant', color: '#10b981' },
            { title: 'Breathing Exercises', desc: 'Daily techniques to improve oxygen saturation.', icon: 'airway', color: '#3b82f6' }
          ].map((res, i) => (
            <div key={i} className="resource-card sg-card">
               <div className="res-icon" style={{background: res.color}}><span className="material-symbols-outlined">{res.icon}</span></div>
               <h3>{res.title}</h3>
               <p>{res.desc}</p>
               <button className="res-link">Read Guide</button>
            </div>
          ))}
       </div>
    </motion.div>
  );

  return (
    <div className="patient-portal">
      {/* Top Nav */}
      <nav className="portal-topnav">
        <div className="topnav-left">
          <span className="material-symbols-outlined filled logo-icon">shield_with_heart</span>
          <span className="logo-text">SepsisGuard Live</span>
          <div className="nav-links hide-on-mobile">
            <button className={activeView === 'status' ? 'active' : ''} onClick={() => setActiveView('status')}>My Health Status</button>
            <button className={activeView === 'history' ? 'active' : ''} onClick={() => setActiveView('history')}>Care History</button>
            <button className={activeView === 'resources' ? 'active' : ''} onClick={() => setActiveView('resources')}>Resources</button>
          </div>
        </div>
        <div className="topnav-right">
          <div className="notif-hub-wrapper">
             <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && <span className="notif-dot"></span>}
             </button>
             
             <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="notif-dropdown sg-card"
                  >
                     <div className="notif-dropdown-header">
                        <h4>Your Recovery Feed</h4>
                        <button className="mark-read-btn" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Clear all</button>
                     </div>
                     <div className="notif-dropdown-list">
                        {notifications.map(n => (
                          <div key={n.id} className={`notif-dropdown-item ${n.read ? 'read' : ''} ${n.type}`}>
                             <div className="notif-item-icon">
                                <span className="material-symbols-outlined">
                                   {n.type === 'success' ? 'stars' : 'clinical_notes'}
                                </span>
                             </div>
                             <div className="notif-item-content">
                                <div className="notif-item-title">{n.title}</div>
                                <div className="notif-item-msg">{n.msg}</div>
                                <div className="notif-item-time">{n.time}</div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
          <button className="avatar-btn" onClick={handleLogout}><span className="material-symbols-outlined filled">account_circle</span></button>
        </div>
      </nav>

      <div className="portal-content">
        {/* Sidebar */}
        <aside className="portal-sidebar hide-on-mobile">
          <div className="sidebar-profile-card">
            <div className="p-avatar">
              <span className="material-symbols-outlined filled">person</span>
            </div>
            <h3>{userName}</h3>
            <p>Patient Portal</p>
          </div>

          <div className="sidebar-hardware-section">
             <SentinelWatchPairing />
          </div>

          <nav className="p-sidebar-nav">
             <button className={activeView === 'status' ? 'active' : ''} onClick={() => setActiveView('status')}>
                <span className="material-symbols-outlined">analytics</span> My Status
             </button>
             <button className={activeView === 'healing' ? 'active' : ''} onClick={() => setActiveView('healing')}>
                <span className="material-symbols-outlined">self_care</span> Healing Center
             </button>
             <button className={activeView === 'history' ? 'active' : ''} onClick={() => setActiveView('history')}>
                <span className="material-symbols-outlined">history</span> Care History
             </button>
             <button className={activeView === 'resources' ? 'active' : ''} onClick={() => setActiveView('resources')}>
                <span className="material-symbols-outlined">library_books</span> Resources
             </button>
          </nav>
          
          <button className="help-btn" style={{marginTop: 'auto'}}>
            <span className="material-symbols-outlined">live_help</span>
            Help Desk
          </button>
        </aside>

        {/* Main Area */}
        <main className="portal-main">
          <header className="main-header">
            <div className="header-text">
              <h1>{activeView === 'status' ? 'My Health Status' : activeView === 'history' ? 'Care History' : activeView === 'healing' ? 'Healing Center' : 'Resources'}</h1>
              <span className="update-status"><span className="dot-green"></span> Last updated: 2 min ago</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeView === 'status' && renderOverview()}
            {activeView === 'healing' && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="healing-view">
                <PatientHealingCenter extended={true} />
             </motion.div>
          )}

          {activeView === 'history' && renderHistory()}
          {activeView === 'resources' && renderResources()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
