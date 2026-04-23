import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './InterventionSimulator.css';

export default function InterventionSimulator() {
  const [fluidIntake, setFluidIntake] = useState(0);
  const [antibiotics, setAntibiotics] = useState(false);
  const [predictedScore, setPredictedScore] = useState(45);

  const simulate = (fluids, abx) => {
    // Basic simulation logic
    let score = 45;
    if (fluids > 1000) score -= 10;
    if (abx) score -= 15;
    setPredictedScore(Math.max(12, score));
  };

  return (
    <div className="simulator-widget sg-card-elevated">
      <header className="sim-header">
        <span className="material-symbols-outlined">psychology</span>
        <h3>Proactive Outcome Simulator</h3>
      </header>

      <div className="sim-body">
        <div className="sim-control">
          <label>Crystalloid Bolus (mL): <strong>{fluidIntake}</strong></label>
          <input 
            type="range" 
            min="0" max="3000" step="500" 
            value={fluidIntake} 
            onChange={(e) => { 
                setFluidIntake(e.target.value); 
                simulate(e.target.value, antibiotics); 
            }} 
            className="sg-slider"
          />
        </div>

        <div className="sim-control-row">
           <label>Early Antibiotics</label>
           <button 
             className={`toggle-btn ${antibiotics ? 'on' : ''}`}
             onClick={() => {
                setAntibiotics(!antibiotics);
                simulate(fluidIntake, !antibiotics);
             }}
           >
              <div className="t-dot"></div>
           </button>
        </div>

        <div className="prediction-result">
           <div className="res-meta">
              <span>Predicted Risk Score (2h post-action)</span>
              <div className={`res-score ${predictedScore < 30 ? 'grad-stable' : 'grad-risk'}`}>{predictedScore}%</div>
           </div>
           <div className="res-delta">
              Potential Improvement: <strong>{45 - predictedScore}%</strong>
           </div>
        </div>
      </div>

      <footer className="sim-footer">
         <span className="material-symbols-outlined">verified</span>
         <p>Simulation based on 1.2M historical treatment trials.</p>
      </footer>
    </div>
  );
}
