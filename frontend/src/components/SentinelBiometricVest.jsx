import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './SentinelBiometricVest.css';

export default function SentinelBiometricVest() {
  const [fluidLevel, setFluidLevel] = useState(12); // Lung fluid in ml
  const [respEffort, setRespEffort] = useState(68);

  return (
    <div className="hardware-card vest-card sg-card">
      <div className="h-header">
        <span className="material-symbols-outlined">accessibility_new</span>
        <div className="h-title">
           <h4>Sentinel SmartVest v2</h4>
           <span className="h-status-dot online"></span>
        </div>
      </div>

      <div className="vest-visual">
         <svg viewBox="0 0 100 120" className="vest-svg">
            {/* Simple Vest Shape */}
            <path d="M20 20 L 80 20 L 90 100 L 10 100 Z" fill="none" stroke="var(--sg-primary)" strokeWidth="2" strokeDasharray="4 2" />
            {/* Sensor Nodes */}
            <circle cx="35" cy="40" r="4" fill="#ef4444" className="pulse-slow" />
            <circle cx="65" cy="40" r="4" fill="#ef4444" className="pulse-slow" />
            <circle cx="50" cy="70" r="4" fill="#3b82f6" className="pulse-fast" />
         </svg>
      </div>

      <div className="vest-metrics">
         <div className="v-metric">
            <span>Lung Fluid Index</span>
            <strong>{fluidLevel} ml/m²</strong>
         </div>
         <div className="v-metric">
            <span>Respiratory Effort</span>
            <strong>{respEffort}%</strong>
         </div>
      </div>

      <div className="vest-ai-tag">
         <span className="material-symbols-outlined">auto_awesome</span>
         AI: Lung congestion risk is LOW.
      </div>
    </div>
  );
}
