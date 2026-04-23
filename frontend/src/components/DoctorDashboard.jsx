import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [docName] = useState(localStorage.getItem('name') || 'Dr. Jameson');
  const [activeTab, setActiveTab] = useState('overview'); // overview, patients, analytics
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const patients = [
    { id: '42', name: 'Jameson Blake', age: 54, gender: 'M', ward: 'ICU-3', riskScore: 45, status: 'Rising Risk', timeInWard: '14h', critical: true },
    { id: '18', name: 'Elena Rodriguez', age: 62, gender: 'F', ward: 'Ward-2', riskScore: 28, status: 'Stable', timeInWard: '2d', critical: false },
    { id: '09', name: 'David Chen', age: 41, gender: 'M', ward: 'ER-A', riskScore: 12, status: 'Recovering', timeInWard: '8h', critical: false }
  ];

  const alerts = [
    { id: 1, type: 'critical', badge: 'CRITICAL', time: '12m ago', title: 'Lactate Alert (#42)', message: 'Lactate increased from 1.4 to 2.1 mmol/L in 2 hours.' },
    { id: 2, type: 'positive', badge: 'STABLE', time: '45m ago', title: 'Vitals Stabilized (#18)', message: 'Elena’s BP is back in target range (MAP 68 mmHg).' },
    { id: 3, type: 'info', badge: 'PROTOCOL', time: '1h ago', title: 'Hour-1 Bundle Met', message: 'Antibiotics administered for high-risk triage #09.' }
  ];

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="doc-content-grid">
      {/* Left Column */}
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="doc-left-col">
        {/* Stats Row */}
        <div className="stats-row sg-stagger">
          <div className="stat-card">
            <div className="stat-head">CRITICAL PATIENTS</div>
            <div className="stat-main">
              <span className="stat-number danger">04</span>
              <span className="stat-sub danger">+1 this hour</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-head">WARD CAPACITY</div>
            <div className="stat-main">
              <span className="stat-number">92</span>
              <span className="stat-unit">%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-head">BUNDLE COMPLIANCE</div>
            <div className="stat-main">
              <span className="stat-number">98</span>
              <span className="stat-unit">%</span>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="patient-table-container">
          <div className="table-header-row">
            <div className="th-col">Patient & Ward</div>
            <div className="th-col">AI Risk Index</div>
            <div className="th-col">Status</div>
            <div className="th-col">Actions</div>
          </div>

          <div className="patient-list">
            {patients.map((p) => (
              <div key={p.id} className={`patient-row ${p.critical ? 'critical-row' : ''}`} onClick={() => navigate(`/patient/${p.id}`)}>
                {p.critical && <span className="critical-badge-float">CRITICAL WATCH</span>}
                <div className="pr-col pr-patient">
                  <div className={`patient-id-badge ${p.critical ? 'critical' : ''}`}>{p.id}</div>
                  <div className="patient-info-text">
                    <span className="patient-name-text">{p.name}</span>
                    <span className="patient-ward-text">{p.ward} • {p.age}{p.gender}</span>
                  </div>
                </div>
                <div className="pr-col pr-risk">
                  <span className={`risk-score ${p.riskScore > 35 ? 'high' : p.riskScore > 25 ? 'medium' : 'low'}`}>{p.riskScore}%</span>
                  <span className={`risk-label ${p.riskScore > 35 ? 'high' : ''}`}>AI Sepsis Probability</span>
                </div>
                <div className="pr-col pr-status">
                  <div className={`status-chip ${p.critical ? 'rising' : 'stable'}`}>
                    <span className="material-symbols-outlined status-arrow">{p.critical ? 'trending_up' : 'trending_flat'}</span>
                    {p.status}
                  </div>
                </div>
                <div className="pr-col pr-actions">
                   <button className="view-vitals-btn">VIEW VITALS</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right Column (Alerts + Performance) */}
      <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="doc-right-col">
        {/* Recent Alerts */}
        <div className="alerts-panel">
          <div className="alerts-panel-header">
            <h3>Recent Alerts</h3>
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className="alerts-list sg-stagger">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card alert-${alert.type}`}>
                <div className="alert-card-top">
                  <span className={`alert-type-badge ${alert.type}`}>{alert.badge}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <h4 className="alert-card-title">{alert.title}</h4>
                <p className="alert-card-msg">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Performance */}
        <div className="performance-card">
          <div className="perf-header">DAILY PERFORMANCE</div>
          <div className="perf-score">
            <span className="perf-number">98%</span>
            <span className="material-symbols-outlined filled perf-check">verified</span>
          </div>
          <p className="perf-label">Protocol Compliance</p>
          <div className="perf-bar-bg">
            <div className="perf-bar-fill" style={{ width: '98%' }}></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderPatients = () => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="doc-full-patients-view">
        <div className="patients-grid-header sg-card">
           <div className="search-filter-row">
              <div className="topbar-search">
                 <span className="material-symbols-outlined search-icon">search</span>
                 <input type="text" placeholder="Search patients by name, ward, or ID..." className="search-input" style={{width: '400px'}} />
              </div>
              <div className="filter-chips">
                 <span className="filter-chip active">All Patients</span>
                 <span className="filter-chip">Critical Only</span>
                 <span className="filter-chip">Recently Admitted</span>
              </div>
           </div>
        </div>

        <div className="patient-cards-grid">
           {patients.map(p => (
             <div key={p.id} className={`p-mini-card sg-card ${p.critical ? 'critical-border' : ''}`} onClick={() => navigate(`/patient/${p.id}`)}>
                <div className="p-mini-top">
                   <div className="p-mini-avatar">{p.name.charAt(0)}</div>
                   <div className="p-mini-meta">
                      <h4>{p.name}</h4>
                      <p>{p.ward} • {p.age}{p.gender}</p>
                   </div>
                   <div className={`p-mini-score ${p.critical ? 'high' : ''}`}>{p.riskScore}%</div>
                </div>
                <div className="p-mini-vitals">
                   <div className="v-mini"><span>HR</span> <strong>114</strong></div>
                   <div className="v-mini"><span>MAP</span> <strong>62</strong></div>
                   <div className="v-mini"><span>TEMP</span> <strong>38.9</strong></div>
                </div>
                <button className="sg-btn sg-btn-outline full-width">View Full Profile</button>
             </div>
           ))}
        </div>
    </motion.div>
  );

  return (
    <div className="doc-dashboard">
      {/* SIDEBAR */}
      <aside className="doc-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="material-symbols-outlined filled logo-icon">shield_with_heart</span>
            <span className="logo-text">SepsisGuard</span>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="profile-info">
              <div className="profile-name">{docName}</div>
              <div className="profile-dept">ICU Specialist</div>
            </div>
          </div>

          <button className="protocol-btn" onClick={() => navigate('/analytics')}>
            <span className="material-symbols-outlined">analytics</span>
            View Clinical Analytics
          </button>

          <nav className="sidebar-nav">
            <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <span className="material-symbols-outlined">dashboard</span> Overview
            </button>
            <button className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
              <span className="material-symbols-outlined">group</span> My Patients
            </button>
            <Link to="/analytics" className="nav-link">
              <span className="material-symbols-outlined">monitoring</span> Performance
            </Link>
            <Link to="/settings" className="nav-link">
              <span className="material-symbols-outlined">settings</span> App Settings
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <Link to="/support" className="nav-link footer-link">
            <span className="material-symbols-outlined">help</span> Help Center
          </Link>
          <button onClick={handleLogout} className="nav-link footer-link logout-btn" style={{background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
            <span className="material-symbols-outlined">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="doc-main">
        {/* Top Bar */}
        <header className="doc-topbar">
          <div className="topbar-left">
            <div className="topbar-title">{activeTab === 'overview' ? 'Clinical Overview' : 'Patient Roster'}</div>
          </div>
          <div className="topbar-right">
            <div className="voice-hint-pill" onClick={() => navigate('/patient/42')}>
               <span className="material-symbols-outlined">settings_voice</span>
               <span>"Hey Sentinel..."</span>
            </div>
            <button className="topbar-icon-btn">
              <span className="material-symbols-outlined">notifications</span>
              <span className="notif-dot"></span>
            </button>
            <div className="topbar-avatar" onClick={() => navigate('/settings')}>
              JD
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'patients' && renderPatients()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DoctorDashboard;
