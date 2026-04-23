import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './EducationalResources.css';

export default function EducationalResources() {
  const [activeTab, setActiveTab] = useState('resources');

  const handleReadGuide = () => alert('Opening "What is Sepsis?" guide...');
  const handleOpenGlossary = () => alert('Opening medical glossary...');
  const handleTalkToSpecialist = () => alert('Connecting with specialist...');
  const handlePlayVideo = () => alert('Playing: The First 24 Hours');
  const handleMessageNurse = () => alert('Opening message interface...');
  const handleDownload = (name) => alert(`Downloading: ${name}`);

  const downloads = [
    { name: 'Home Care Checklist', size: '1.2 MB', icon: '📄' },
    { name: 'Vital Signs Tracker', size: '0.8 MB', icon: '📊' },
    { name: 'ICU Vocabulary Guide', size: '2.4 MB', icon: '📖' }
  ];

  return (
    <div className="edu-wrapper">
      {/* Header */}
      <header className="edu-header">
        <h1 className="edu-logo">SepsisGuard Live</h1>
        <nav className="edu-header-nav">
          <button className="edu-nav-link">Overview</button>
          <button className="edu-nav-link">My Patients</button>
          <button className="edu-nav-link active">Resources</button>
        </nav>
        <div className="edu-header-icons">
          <button className="edu-icon-btn">🔔</button>
          <button className="edu-profile-btn">👤</button>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="edu-sidebar">
        <div className="edu-sidebar-profile">
          <div className="edu-profile-avatar">👨‍⚕️</div>
          <div className="edu-profile-info">
            <p className="edu-profile-name">Dr. Clinical Sentinel</p>
            <p className="edu-profile-dept">ICU Department</p>
          </div>
        </div>

        <nav className="edu-sidebar-nav">
          <Link to="/doctor" className="edu-sidebar-item">📊 Overview</Link>
          <Link to="/doctor" className="edu-sidebar-item">👥 My Patients</Link>
          <Link to="/analytics" className="edu-sidebar-item">📈 Reports</Link>
          <Link to="/alerts" className="edu-sidebar-item">⚠️ Alerts</Link>
          <Link to="/resources" className="edu-sidebar-item active">📚 Resources</Link>
        </nav>

        <button className="edu-protocol-btn">⚕️ Sepsis Protocol</button>

        <div className="edu-sidebar-footer">
          <Link to="/settings" className="edu-footer-link">⚙️ Settings</Link>
          <Link to="/support" className="edu-footer-link">❓ Support</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="edu-main">
        {/* Header Section */}
        <div className="edu-header-section">
          <span className="edu-badge">👨‍👩‍👧 FAMILY SUPPORT CENTER</span>
          <h2 className="edu-title">Patient & Family Resources</h2>
          <p className="edu-description">
            Navigating a clinical environment can be overwhelming. We've curated these guides to help you understand sepsis care, monitor progress, and prepare for the journey ahead.
          </p>
        </div>

        {/* Resource Grid */}
        <div className="edu-resource-grid">
          {/* Main Feature Card */}
          <div className="edu-feature-card">
            <div className="edu-feature-bg">
              <img src="https://via.placeholder.com/600x400?text=What+is+Sepsis" alt="Sepsis Guide" />
            </div>
            <span className="edu-feature-badge">ESSENTIAL READING</span>
            <h3 className="edu-feature-title">What is Sepsis?</h3>
            <p className="edu-feature-text">
              A comprehensive guide for families on identifying symptoms, understanding medical responses, and the stages of treatment in the ICU.
            </p>
            <button className="edu-feature-btn" onClick={handleReadGuide}>
              Read the Guide →
            </button>
          </div>

          {/* Understanding Vitals */}
          <div className="edu-card-small">
            <div className="edu-card-icon">🫀</div>
            <h3 className="edu-card-title">Understanding Your Vitals</h3>
            <p className="edu-card-text">
              Learn what BP, Heart Rate, and SpO2 mean in the context of sepsis monitoring and why they change.
            </p>
            <button className="edu-card-link" onClick={handleOpenGlossary}>
              Open glossary ↗
            </button>
          </div>

          {/* Post-ICU Recovery */}
          <div className="edu-card-recovery">
            <div className="edu-recovery-icon">🏥</div>
            <h3 className="edu-card-title">Post-ICU Recovery</h3>
            <p className="edu-card-text">
              The road to recovery continues after the hospital. Learn about Post-Intensive Care Syndrome (PICS) and physical therapy milestones.
            </p>
            <div className="edu-recovery-footer">
              <button className="edu-specialist-btn" onClick={handleTalkToSpecialist}>
                Talk to a specialist
              </button>
            </div>
          </div>

          {/* Video Section */}
          <div className="edu-card-video">
            <div className="edu-video-thumbnail" onClick={handlePlayVideo}>
              <img src="https://via.placeholder.com/400x300?text=Play+Video" alt="Video" />
              <div className="edu-play-button">▶</div>
            </div>
            <h3 className="edu-card-title">Video: The First 24 Hours</h3>
            <p className="edu-card-text">
              A visual walkthrough of the sepsis protocol and what to expect during the stabilization phase.
            </p>
            <div className="edu-video-meta">
              <span>⏱️ 4:20 MIN</span>
              <span>👁️ 1.2K VIEWS</span>
            </div>
          </div>

          {/* FAQ Support */}
          <div className="edu-card-faq">
            <div className="edu-faq-icon">❓</div>
            <h3 className="edu-card-title">Still have questions?</h3>
            <p className="edu-card-text">
              Our support team is available 24/7 for families.
            </p>
            <button className="edu-message-btn" onClick={handleMessageNurse}>
              Message Nurse
            </button>
          </div>
        </div>

        {/* Downloads Section */}
        <section className="edu-downloads">
          <h2 className="edu-download-title">📥 Printable Checklists</h2>
          <div className="edu-download-grid">
            {downloads.map((item, idx) => (
              <div key={idx} className="edu-download-item">
                <span className="edu-download-icon">{item.icon}</span>
                <div className="edu-download-info">
                  <p className="edu-download-name">{item.name}</p>
                  <p className="edu-download-size">PDF • {item.size}</p>
                </div>
                <button 
                  className="edu-download-btn"
                  onClick={() => handleDownload(item.name)}
                >
                  ⬇️
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="edu-bottom-nav">
        <button className="edu-bottom-item">📊 Overview</button>
        <button className="edu-bottom-item">👥 Patients</button>
        <button className="edu-bottom-item active">📚 Resources</button>
        <button className="edu-bottom-item">👤 Profile</button>
      </nav>
    </div>
  );
}
