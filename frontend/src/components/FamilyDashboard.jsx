import React, { useState, useEffect } from 'react';
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

  return (
    <div className="family-portal">
      {/* Top Nav */}
      <nav className="family-topnav">
         <div className="topnav-left">
           <span className="material-symbols-outlined filled logo-icon">shield_with_heart</span>
           <span className="logo-text">SepsisGuard Live</span>
           <div className="nav-links">
             <a href="#" className="active">Overview</a>
             <a href="#">Care Team</a>
             <a href="#">Resources</a>
           </div>
         </div>
         <div className="topnav-right">
           <button className="icon-btn"><span className="material-symbols-outlined">notifications</span></button>
           <button className="family-avatar" onClick={handleLogout}>{userName.charAt(0)}</button>
         </div>
      </nav>

      <main className="family-main">
        {/* Patient Status Header */}
        <header className="family-header">
           <div className="patient-focus">
              <h1>Robert Chen's Status</h1>
              <p>Room 402 • ICU West Wing • Stable Condition</p>
           </div>
           <div className="header-actions">
              <button className="sg-btn sg-btn-primary">
                <span className="material-symbols-outlined">phone_in_talk</span>
                Request Call
              </button>
           </div>
        </header>

        {/* Update Banner */}
        <SentinelBriefing role="family" />

        <div className="family-body-grid">
           <AIDigitalTwin vitals={{hr: 78, spO2: 96, temp: 37.9}} role="family" />
           
           <GroqIntelligenceCenter role="family" />

           <FamilyCompassionHub />
           
           {/* 24h Trend */}
           <div className="family-chart-section sg-card">
              <div className="card-head">
                 <h3>Recovery Trend (24 Hours)</h3>
                 <span className="view-more">Show Details</span>
              </div>
              <div className="family-chart-box">
                 <LiveVitalsChart />
              </div>
              <p className="chart-explanation">
                <strong>AI Explanation:</strong> Robert is showing a steady recovery trend. His vitals are within normal clinical ranges for post-op day 2.
              </p>
           </div>

           {/* Timeline */}
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
              <button className="view-full-history-btn">View Care History</button>
           </div>
        </div>

        {/* Care Team */}
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
