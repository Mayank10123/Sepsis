import React, { useState, useEffect } from 'react';
import './NotificationCenter.css';

export default function NotificationCenter({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'High Risk Alert: Patient #42',
      message: 'AI detected a significant rise in Sepsis probability (12% → 45%).',
      time: 'Just now',
      read: false,
      icon: 'warning'
    },
    {
      id: 2,
      type: 'info',
      title: 'Lab Results Ready',
      message: 'Blood cultures for Sarah Jenkins (#57) are now available in the portal.',
      time: '12m ago',
      read: false,
      icon: 'biotech'
    },
    {
      id: 3,
      type: 'success',
      title: 'Protocol Target Met',
      message: 'Jameson Blake (#42) MAP target achieved (>65 mmHg).',
      time: '45m ago',
      read: true,
      icon: 'check_circle'
    }
  ]);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const removeNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="notif-dropdown-wrapper sg-scale-in">
      <div className="notif-header">
        <div className="notif-title-row">
          <h3>Notifications</h3>
          <span className="notif-count">{notifications.filter(n => !n.read).length} New</span>
        </div>
        <button className="mark-read-btn" onClick={markAllRead}>Mark all as read</button>
      </div>

      <div className="notif-list">
        {notifications.length === 0 ? (
          <div className="empty-notif">
            <span className="material-symbols-outlined">notifications_off</span>
            <p>All caught up!</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`notif-item ${n.type} ${n.read ? 'read' : 'unread'}`}>
              <div className="notif-icon-col">
                <span className="material-symbols-outlined filled">{n.icon}</span>
              </div>
              <div className="notif-content-col">
                <div className="notif-top">
                  <span className="notif-title">{n.title}</span>
                  <span className="notif-time">{n.time}</span>
                </div>
                <p className="notif-msg">{n.message}</p>
                {!n.read && <div className="unread-dot"></div>}
              </div>
              <button className="notif-remove" onClick={() => removeNotif(n.id)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="notif-footer">
        <button className="view-all-btn">View All Alerts</button>
      </div>
    </div>
  );
}
