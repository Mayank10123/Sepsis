import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './FamilyDashboard.css';
import LiveVitalsChart from './LiveVitalsChart';
import AIDigitalTwin from './AIDigitalTwin';
import SentinelBriefing from './SentinelBriefing';
import FamilyCompassionHub from './FamilyCompassionHub';
import GroqIntelligenceCenter from './GroqIntelligenceCenter';

export default function FamilyDashboard() {
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem('name') || 'Chen Family');
  const [activeView, setActiveView] = useState('status');
  const [callRequested, setCallRequested] = useState(false);
  const [visitScheduled, setVisitScheduled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Call Approved', msg: 'Dr. Miller is available for a 5min update at 4:30 PM.', type: 'success', time: '10m ago', read: false },
    { id: 2, title: 'New Recovery Goal', msg: 'Robert completed his afternoon mobility goal!', type: 'info', time: '2h ago', read: false },
    { id: 3, title: 'Welcome', msg: 'Welcome to the Sentinel Family Portal.', type: 'info', time: '1d ago', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRequestCall = () => {
    setCallRequested(true);
    setTimeout(() => {
      // Dispatch simulation
    }, 3000);
  };

  const handleScheduleVisit = () => {
    setVisitScheduled(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const statusUpdates = [
    { time: '2:14 PM', text: 'Dr. Miller completed afternoon rounds. Patient is showing improvement.', type: 'info' },
    { time: '1:30 PM', text: 'Physical therapy session completed successfully.', type: 'success' },
    { time: '11:15 AM', text: 'New medication (Vancomycin) started for infection control.', type: 'med' },
    { time: '9:00 AM', text: 'Breakfast tolerated well. Patient is resting comfortably.', type: 'status' }
  ];

  const renderVisitPlanner = () => (
    <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="sg-card" style={{padding: '60px 40px', textAlign: 'center'}}>
       <span className="material-symbols-outlined" style={{fontSize: '64px', color: visitScheduled ? '#10b981' : '#3b82f6', marginBottom: '20px'}}>
          {visitScheduled ? 'check_circle' : 'event_available'}
       </span>
       <h2 style={{fontSize: '24px', fontWeight: '800', marginBottom: '12px'}}>
          {visitScheduled ? 'Visit Confirmed' : 'Visit Planner'}
       </h2>
       <p style={{color: 'var(--sg-outline)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px'}}>
          {visitScheduled 
            ? 'Your visit for today (2:30 PM) has been logged with the ICU station. See you soon!' 
            : "Robert's rest cycles are optimal between 2:00 PM and 4:00 PM today. Schedule your visit to ensure he's awake."}
       </p>
       {!visitScheduled && (
         <button className="sg-btn sg-btn-primary" onClick={handleScheduleVisit}>Schedule Visit Now</button>
       )}
       {visitScheduled && (
         <button className="sg-btn sg-btn-outline" onClick={() => setVisitScheduled(false)}>Reschedule</button>
       )}
    </motion.div>
  );

  const renderSupport = () => (
    <motion.div initial={{opacity: 0, scale: 0.98}} animate={{opacity: 1, scale: 1}} className="sg-card" style={{padding: '40px'}}>
       <h2 style={{fontSize: '24px', fontWeight: '800', marginBottom: '24px'}}>Support Resources</h2>
       <div className="care-team-grid">
          <div className="care-card sg-card">
             <span className="material-symbols-outlined" style={{color: '#10b981'}}>volunteer_activism</span>
             <div className="care-info">
                <h4>Patient Advocacy</h4>
                <p>24/7 family support line</p>
             </div>
          </div>
          <div className="care-card sg-card">
             <span className="material-symbols-outlined" style={{color: '#3b82f6'}}>psychology</span>
             <div className="care-info">
                <h4>Counseling Services</h4>
                <p>Free session for family members</p>
             </div>
          </div>
       </div>
    </motion.div>
  );

  return (
    <div className="family-portal">
      {/* Top Nav */}
      <nav className="family-topnav">
        <div className="topnav-left">
           <div className="logo-group">
              <span className="material-symbols-outlined filled logo-icon">shield_with_heart</span>
              <span className="logo-text">SepsisGuard Live</span>
           </div>
           
           <nav className="f-sidebar-nav hide-on-mobile">
              <button className={activeView === 'status' ? 'active' : ''} onClick={() => setActiveView('status')}>
                 <span className="material-symbols-outlined">favorite</span> Patient Status
              </button>
              <button className={activeView === 'compassion' ? 'active' : ''} onClick={() => setActiveView('compassion')}>
                 <span className="material-symbols-outlined">diversity_1</span> Compassion Hub
              </button>
              <button className={activeView === 'visit' ? 'active' : ''} onClick={() => setActiveView('visit')}>
                 <span className="material-symbols-outlined">event_available</span> Visit Planner
              </button>
              <button className={activeView === 'support' ? 'active' : ''} onClick={() => setActiveView('support')}>
                 <span className="material-symbols-outlined">volunteer_activism</span> Support
              </button>
           </nav>
        </div>

        <div className="topnav-right">
           <div className="notif-hub-wrapper">
              <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                 <span className="material-symbols-outlined">notifications</span>
                 {unreadCount > 0 && <span className="notif-dot"></span>}
              </button>
              <AnimatePresence>
                 {showNotifications && (
                   <motion.div initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 15, scale: 0.95 }} className="notif-dropdown sg-card">
                      <div className="notif-dropdown-header">
                         <h4>Family Alerts</h4>
                         <button className="mark-read-btn" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Clear All</button>
                      </div>
                      <div className="notif-dropdown-list">
                         {notifications.map(n => (
                           <div key={n.id} className={`notif-dropdown-item ${n.read ? 'read' : ''} ${n.type}`}>
                              <div className="notif-item-icon">
                                 <span className="material-symbols-outlined">{n.type === 'success' ? 'phone_in_talk' : 'info'}</span>
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
           <button className="family-avatar" onClick={handleLogout}>{userName.charAt(0)}</button>
        </div>
      </nav>

      <main className="family-main">
        <header className="family-header">
           <div className="patient-focus">
              <h1>Robert Chen's Status</h1>
              <p>Room 402 • ICU West Wing • Stable Condition</p>
           </div>
           <div className="header-actions">
               <button className={`sg-btn ${callRequested ? 'sg-btn-outline' : 'sg-btn-primary'}`} onClick={handleRequestCall} disabled={callRequested}>
                 <span className="material-symbols-outlined">{callRequested ? 'check_circle' : 'phone_in_talk'}</span>
                 {callRequested ? 'CALL DISPATCHED' : 'REQUEST CALL'}
               </button>
           </div>
        </header>

        <div className="family-content-grid">
           {activeView === 'status' && (
             <>
                <FamilyCompassionHub />
                
                <div className="family-chart-section sg-card">
                   <div className="card-head">
                      <h3>Recovery Trend (24 Hours)</h3>
                   </div>
                   <div className="family-chart-box">
                      <LiveVitalsChart />
                   </div>
                   <p className="chart-explanation">
                     <strong>AI Explanation:</strong> Robert is showing a steady recovery trend. His vitals are within normal clinical ranges.
                   </p>
                </div>

                <div className="family-timeline-section sg-card">
                   <h3>Recent Updates</h3>
                   <div className="family-timeline">
                      {statusUpdates.map((update, i) => (
                        <div key={i} className="f-timeline-item">
                           <div className="time-col">{update.time}</div>
                           <div className="dot-col"><div className={`f-dot ${update.type}`}></div></div>
                           <div className="text-col">{update.text}</div>
                        </div>
                      ))}
                   </div>
                </div>
             </>
           )}

           {activeView === 'compassion' && (
              <div style={{gridColumn: '1 / -1'}}>
                 <FamilyCompassionHub extended={true} />
              </div>
           )}

           {activeView === 'visit' && (
              <div style={{gridColumn: '1 / -1'}}>
                 {renderVisitPlanner()}
              </div>
           )}

           {activeView === 'support' && (
              <div style={{gridColumn: '1 / -1'}}>
                 {renderSupport()}
              </div>
           )}
        </div>

        <section className="family-care-team">
           <h3>Attending Care Team</h3>
           <div className="care-team-grid">
              <div className="care-card sg-card">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt8S2D9y-O566EwN5z8_sREm6Ea4O4g_8xZ2F7m6vK5p8G" alt="Dr. Miller" />
                 <div className="care-info">
                    <h4>Dr. Sarah Miller</h4>
                    <p>ICU Lead Specialist</p>
                 </div>
              </div>
              <div className="care-card sg-card">
                 <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDt8S2D9y-O566EwN5z8_sREm6Ea4O4g_8xZ2F7m6vK5p8G" alt="Nurse David" />
                 <div className="care-info">
                    <h4>Nurse David Kim</h4>
                    <p>Primary Care Nurse</p>
                 </div>
              </div>
           </div>
        </section>
      </main>
    </div>
  );
}
