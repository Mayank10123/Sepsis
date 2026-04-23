import React from 'react';
import { motion } from 'framer-motion';
import './MultiModalAggregator.css';

export default function MultiModalAggregator() {
  const sensors = [
    { name: 'Sentinel Watch 4', strength: 98, status: 'Synced' },
    { name: 'Biometric Vest', strength: 85, status: 'Synced' },
    { name: 'Bedside Monitor', strength: 100, status: 'Hardwired' },
    { name: 'Lab PDF Delta', strength: 92, status: 'Calculated' }
  ];

  return (
    <div className="aggregator-panel sg-card-elevated">
      <header className="agg-header">
        <span className="material-symbols-outlined filled">hub</span>
        <h3>Multi-Modal Data Fusion</h3>
        <div className="fusion-active">INTEGRATED SIGNAL</div>
      </header>

      <div className="agg-body">
         <div className="fusion-score-circle">
            <svg viewBox="0 0 100 100">
               <circle cx="50" cy="50" r="45" fill="none" stroke="var(--sg-surface-container-high)" strokeWidth="8" />
               <motion.circle 
                 cx="50" cy="50" r="45" fill="none" stroke="var(--sg-primary)" strokeWidth="8" 
                 strokeDasharray="283" initial={{ strokeDashoffset: 283 }} animate={{ strokeDashoffset: 28 }}
               />
            </svg>
            <div className="score-val">90%</div>
            <div className="score-label">DATA SOURCE CONFIDENCE</div>
         </div>

         <div className="sensor-list">
            {sensors.map((s, i) => (
               <div key={i} className="s-row">
                  <div className="s-name">
                     <span>{s.name}</span>
                     <strong>{s.status}</strong>
                  </div>
                  <div className="s-bar-bg"><div className="s-bar-fill" style={{width: `${s.strength}%`}}></div></div>
               </div>
            ))}
         </div>
      </div>

      <div className="agg-insight">
         <span className="material-symbols-outlined">bolt</span>
         <p>Groq AI Analysis: <strong>Cross-hardware verification active.</strong> Vital signals from Vest confirm tachycardia origin is non-pulmonary.</p>
      </div>
    </div>
  );
}
