import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsDoctorProfile.css';

export default function SettingsDoctorProfile() {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState({ mobile: true, browser: true, sound: true });

  return (
    <div className="settings-page sg-fade-in">
      <header className="settings-header">
        <div className="header-left">
           <button className="back-btn" onClick={() => navigate('/doctor')}><span className="material-symbols-outlined">arrow_back</span></button>
           <h1>Settings & Profile</h1>
        </div>
      </header>

      <main className="settings-grid">
         <aside className="settings-nav sg-card">
            <button className="active">General Profile</button>
            <button>Notification Preferences</button>
            <button>Security & Access</button>
            <button>Threshold Thresholds</button>
         </aside>

         <div className="settings-main-content">
            <section className="settings-section sg-card">
               <h3>Clinical Profile</h3>
               <div className="profile-row">
                  <div className="profile-avatar-lg">
                     <span className="material-symbols-outlined filled">account_circle</span>
                  </div>
                  <div className="profile-info-grid">
                     <div className="p-field">
                        <label>Full Name</label>
                        <input type="text" defaultValue="Dr. Clinical Sentinel" className="sg-input" />
                     </div>
                     <div className="p-field">
                        <label>Department</label>
                        <input type="text" defaultValue="ICU Specialist" className="sg-input" />
                     </div>
                     <div className="p-field">
                        <label>Medical ID</label>
                        <input type="text" defaultValue="SG-9920-SENT" disabled className="sg-input disabled" />
                     </div>
                  </div>
               </div>
            </section>

            <section className="settings-section sg-card">
               <h3>Notification Management</h3>
               <div className="toggle-list">
                  <div className="toggle-item">
                     <div className="toggle-text">
                        <h4>Mobile Push Alerts</h4>
                        <p>Receive critical sepsis signals on your registered mobile device.</p>
                     </div>
                     <button className={`toggle-switch ${notifs.mobile ? 'on' : ''}`} onClick={() => setNotifs({...notifs, mobile: !notifs.mobile})}>
                        <div className="toggle-dot"></div>
                     </button>
                  </div>
                  <div className="toggle-item">
                     <div className="toggle-text">
                        <h4>Auditory Alerts</h4>
                        <p>High-priority chime for critical watch patients.</p>
                     </div>
                     <button className={`toggle-switch ${notifs.sound ? 'on' : ''}`} onClick={() => setNotifs({...notifs, sound: !notifs.sound})}>
                        <div className="toggle-dot"></div>
                     </button>
                  </div>
               </div>
            </section>

            <div className="settings-footer">
               <button className="sg-btn sg-btn-primary">Save Changes</button>
               <button className="sg-btn sg-btn-outline">Cancel</button>
            </div>
         </div>
      </main>
    </div>
  );
}
