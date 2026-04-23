import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AlertsAndNotifications.css';

export default function AlertsAndNotifications() {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedAlert, setExpandedAlert] = useState(null);

  const alerts = [
    {
      id: 1,
      type: 'critical',
      patient: 'Elena Rodriguez',
      message: 'Lactate elevated to 3.2 mmol/L',
      timestamp: '2m ago',
      read: false,
      action: 'View Patient'
    },
    {
      id: 2,
      type: 'warning',
      patient: 'Marcus Johnson',
      message: 'Temperature increased to 38.5°C',
      timestamp: '15m ago',
      read: false,
      action: 'Assess'
    },
    {
      id: 3,
      type: 'info',
      patient: 'Sarah Chen',
      message: 'Medication reminder: Antibiotic dose due',
      timestamp: '1h ago',
      read: true,
      action: 'Confirm'
    },
    {
      id: 4,
      type: 'critical',
      patient: 'James Wilson',
      message: 'SOFA Score increased - Sepsis protocol recommended',
      timestamp: '2h ago',
      read: true,
      action: 'Review'
    },
    {
      id: 5,
      type: 'warning',
      patient: 'Patricia Lee',
      message: 'Blood pressure dropping - Monitor closely',
      timestamp: '3h ago',
      read: true,
      action: 'Monitor'
    }
  ];

  const filteredAlerts = activeTab === 'all' ? alerts : 
                         activeTab === 'critical' ? alerts.filter(a => a.type === 'critical') :
                         activeTab === 'unread' ? alerts.filter(a => !a.read) : alerts;

  return (
    <div className="alerts-wrapper">
      {/* Sidebar */}
      <aside className="alerts-sidebar">
        <div className="alerts-sidebar-logo">🛡️ SepsisGuard Live</div>
        
        <div className="alerts-sidebar-profile">
          <div className="alerts-profile-avatar">👨‍⚕️</div>
          <div className="alerts-profile-info">
            <p className="alerts-profile-name">Dr. Clinical Sentinel</p>
            <p className="alerts-profile-dept">ICU Department</p>
          </div>
        </div>

        <nav className="alerts-sidebar-nav">
          <Link to="/doctor" className="alerts-nav-item">📊 Overview</Link>
          <Link to="/doctor" className="alerts-nav-item">👥 My Patients</Link>
          <Link to="/analytics" className="alerts-nav-item">📈 Reports</Link>
          <Link to="/alerts" className="alerts-nav-item active">⚠️ Alerts</Link>
          <Link to="/resources" className="alerts-nav-item">📚 Resources</Link>
        </nav>
        
        <button className="alerts-protocol-btn">⚕️ Sepsis Protocol</button>

        <div className="alerts-sidebar-footer">
          <Link to="/settings" className="alerts-footer-link">⚙️ Settings</Link>
          <Link to="/support" className="alerts-footer-link">❓ Support</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="alerts-main-content">
      {/* Header */}
      <header className="alerts-header">
        <div className="alerts-header-content">
          <h1>Notifications & Alerts</h1>
          <p className="alerts-subtitle">Stay updated on all patient alerts</p>
        </div>
        <button className="alerts-mark-all-btn" onClick={() => alert('All alerts marked as read')}>
          Mark All as Read
        </button>
      </header>

      {/* Tabs */}
      <div className="alerts-tabs-container">
        <button 
          className={`alerts-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Alerts ({alerts.length})
        </button>
        <button 
          className={`alerts-tab ${activeTab === 'critical' ? 'active' : ''}`}
          onClick={() => setActiveTab('critical')}
        >
          Critical ({alerts.filter(a => a.type === 'critical').length})
        </button>
        <button 
          className={`alerts-tab ${activeTab === 'unread' ? 'active' : ''}`}
          onClick={() => setActiveTab('unread')}
        >
          Unread ({alerts.filter(a => !a.read).length})
        </button>
      </div>

      {/* Main Content */}
      <div className="alerts-content">
        {filteredAlerts.length === 0 ? (
          <div className="alerts-empty">
            <p>No alerts in this category</p>
          </div>
        ) : (
          <div className="alerts-list">
            {filteredAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`alert-item ${alert.type} ${!alert.read ? 'unread' : ''}`}
                onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
              >
                <div className="alert-icon">
                  {alert.type === 'critical' && '🚨'}
                  {alert.type === 'warning' && '⚠️'}
                  {alert.type === 'info' && 'ℹ️'}
                </div>

                <div className="alert-main">
                  <div className="alert-header-row">
                    <span className="alert-patient-name">{alert.patient}</span>
                    <span className="alert-timestamp">{alert.timestamp}</span>
                  </div>
                  <p className="alert-message">{alert.message}</p>
                  
                  {expandedAlert === alert.id && (
                    <div className="alert-expanded">
                      <div className="alert-details">
                        <p><strong>Alert Type:</strong> {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}</p>
                        <p><strong>Status:</strong> {alert.read ? 'Read' : 'Unread'}</p>
                        <p><strong>Created:</strong> {alert.timestamp}</p>
                      </div>
                      <button 
                        className="alert-action-btn"
                        onClick={() => alert(`${alert.action} for ${alert.patient}`)}
                      >
                        {alert.action}
                      </button>
                    </div>
                  )}
                </div>

                <button 
                  className="alert-dismiss-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Alert dismissed for ${alert.patient}`);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
