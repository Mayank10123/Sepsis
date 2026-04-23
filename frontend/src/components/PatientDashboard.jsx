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
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem('name') || 'Robert Chen');
  const [activeSection, setActiveSection] = useState('status'); // status, history, resources

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

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="p-doctor-contact sg-card">
          <div className="p-doc-avatar">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt8S2D9y-O566EwN5z8_sREm6Ea4O4g_8xZ2F7m6vK5p8G" alt="Dr. Sarah Miller" />
          </div>
          <h3>Dr. Sarah Miller</h3>
          <p className="doc-msg">"Hello Robert, your oxygen levels are looking much better this morning. Keep focusing on your breathing exercises."</p>
          <button className="sg-btn sg-btn-primary full-width">Message Team</button>
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
            <button className={activeSection === 'status' ? 'active' : ''} onClick={() => setActiveSection('status')}>My Health Status</button>
            <button className={activeSection === 'history' ? 'active' : ''} onClick={() => setActiveSection('history')}>Care History</button>
            <button className={activeSection === 'resources' ? 'active' : ''} onClick={() => setActiveSection('resources')}>Resources</button>
          </div>
        </div>
        <div className="topnav-right">
          <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
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
          <div className="sidebar-menu">
            <button className={activeSection === 'status' ? 'active' : ''} onClick={() => setActiveSection('status')}>
              <span className="material-symbols-outlined">dashboard</span> Overview
            </button>
            <button className={activeSection === 'history' ? 'active' : ''} onClick={() => setActiveSection('history')}>
              <span className="material-symbols-outlined">history</span> Care History
            </button>
            <button className={activeSection === 'resources' ? 'active' : ''} onClick={() => setActiveSection('resources')}>
              <span className="material-symbols-outlined">import_contacts</span> Resources
            </button>
          </div>
          
          <div className="sidebar-hardware-section" style={{marginTop: 'auto'}}>
             <SentinelWatchPairing />
          </div>

          <button className="help-btn" style={{marginTop: '24px'}}>
            <span className="material-symbols-outlined">live_help</span>
            Help Desk
          </button>
        </aside>

        {/* Main Area */}
        <main className="portal-main">
          <header className="main-header">
            <div className="header-text">
              <h1>{activeSection === 'status' ? 'My Health Status' : activeSection === 'history' ? 'Care History' : 'Resources'}</h1>
              <span className="update-status"><span className="dot-green"></span> Last updated: 2 min ago</span>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeSection === 'status' && renderOverview()}
            {activeSection === 'history' && renderHistory()}
            {activeSection === 'resources' && renderResources()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
