import React from 'react';
import { motion } from 'framer-motion';
import './AIDigitalTwin.css';

export default function AIDigitalTwin({ vitals, role = 'doctor' }) {
  // Organ stress mapping based on vitals
  const organStates = [
    { 
      name: 'Brain', 
      status: 'Stable', 
      desc: role === 'doctor' ? 'GCS 15, No neuro deficits.' : 'Your cognitive function is sharp and clear.',
      health: 98,
      pos: { top: '8%', left: '50%' },
      icon: 'psychology'
    },
    { 
      name: 'Heart', 
      status: vitals.hr > 100 ? 'Stressed' : 'Stable', 
      desc: role === 'doctor' ? `Tachycardia (${vitals.hr} bpm).` : 'Your heart is working a bit hard but steady.',
      health: vitals.hr > 100 ? 72 : 95,
      pos: { top: '22%', left: '46%' },
      icon: 'favorite'
    },
    { 
      name: 'Lungs', 
      status: vitals.spO2 < 90 ? 'Critical' : 'Healing', 
      desc: role === 'doctor' ? `Low SpO2 (${vitals.spO2}%).` : 'Focusing on your deep breathing exercises.',
      health: vitals.spO2 < 90 ? 45 : 88,
      pos: { top: '22%', left: '58%' },
      icon: 'airway'
    },
    { 
      name: 'Kidneys', 
      status: 'Watching', 
      desc: role === 'doctor' ? 'Creatinine stable at 1.1.' : 'Your body is filtering out toxins effectively.',
      health: 82,
      pos: { top: '42%', left: '50%' },
      icon: 'water_drop'
    }
  ];

  return (
    <div className={`digital-twin-container role-${role}`}>
      <div className="twin-grid">
        {/* Left: Anatomical Visualization */}
        <div className="twin-visual-canvas sg-card">
          <div className="visual-header">
             <span className="material-symbols-outlined">person</span>
             <h4>LIVING DIGITAL TWIN</h4>
             <div className="live-sync-indicator">
                <span className="sync-dot"></span> LIVE SYNC
             </div>
          </div>
          
          <div className="anatomical-base">
            {/* SVG Body representation */}
            <svg viewBox="0 0 200 400" className="body-svg">
              <path 
                d="M100 20 C 110 20, 120 30, 120 45 C 120 60, 110 70, 100 70 C 90 70, 80 60, 80 45 C 80 30, 90 20, 100 20 M80 75 L 120 75 L 135 150 L 125 150 L 115 100 L 115 250 L 125 380 L 105 380 L 100 260 L 95 380 L 75 380 L 85 250 L 85 100 L 75 150 L 65 150 Z" 
                fill="var(--sg-surface-container-high)" 
              />
              {/* Pulsing Organ Nodes */}
              {organStates.map((organ, idx) => (
                <circle 
                  key={idx}
                  cx={organ.pos.left === '50%' ? 100 : organ.pos.left === '46%' ? 92 : 108}
                  cy={parseInt(organ.pos.top) * 4}
                  r="8"
                  className={`organ-node ${organ.status.toLowerCase()}`}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Right: Functional Insights Bento */}
        <div className="twin-insights-bento">
          {organStates.map((organ, idx) => (
            <motion.div 
              key={idx}
              className={`organ-bento-card sg-card ${organ.status.toLowerCase()}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="bento-head">
                 <span className="material-symbols-outlined">{organ.icon}</span>
                 <span className="bento-name">{organ.name}</span>
                 <span className={`bento-status-pill ${organ.status.toLowerCase()}`}>{organ.status}</span>
              </div>
              <div className="bento-body">
                 <p>{organ.desc}</p>
                 <div className="healing-progress-container">
                    <div className="progress-label">
                       <span>Healing Progress</span>
                       <span>{organ.health}%</span>
                    </div>
                    <div className="progress-bar-bg">
                       <motion.div 
                         className="progress-bar-fill"
                         initial={{ width: 0 }}
                         animate={{ width: `${organ.health}%` }}
                         transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                       ></motion.div>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
