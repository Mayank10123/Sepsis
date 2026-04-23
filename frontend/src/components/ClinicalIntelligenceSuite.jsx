import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './ClinicalIntelligenceSuite.css';

export default function ClinicalIntelligenceSuite() {
  const [activeTab, setActiveTab] = useState('prediction');

  const visionFeatures = [
    { title: 'AI Genomics Sync', desc: 'Correlation of patient DNA with sepsis inflammatory risk.' },
    { title: 'Antimicrobial De-escalation', desc: 'Automated antibiotic switch recommendations.' },
    { title: 'Cytokine Storm Predictor', desc: 'Hyper-inflammation early warning phase tagging.' },
    { title: 'Real-time PK/PD Modeling', desc: 'Predictive drug concentration (Vancomycin) tracking.' },
    { title: 'Sentinel Knowledge Graph', desc: 'Insights from 1M+ similar global clinical cases.' }
  ];

  return (
    <div className="intelligence-suite sg-card-elevated">
      <nav className="suite-nav">
        <button className={activeTab === 'prediction' ? 'active' : ''} onClick={() => setActiveTab('prediction')}>Discharge</button>
        <button className={activeTab === 'trials' ? 'active' : ''} onClick={() => setActiveTab('trials')}>Trials</button>
        <button className={activeTab === 'vision' ? 'active' : ''} onClick={() => setActiveTab('vision')}>Next-Gen</button>
      </nav>

      <div className="suite-content">
        {activeTab === 'prediction' && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="suite-view">
             <div className="prediction-gauge">
                <svg viewBox="0 0 100 50">
                   <path d="M10 45 A 40 40 0 0 1 90 45" fill="none" stroke="#eee" strokeWidth="10" />
                   <path d="M10 45 A 40 40 0 0 1 90 45" fill="none" stroke="var(--sg-primary)" strokeWidth="10" style={{strokeDasharray: '126', strokeDashoffset: '40'}} />
                </svg>
                <div className="gauge-val">68%</div>
             </div>
             <h4>Smart Discharge Probability</h4>
             <p>Patient is <strong>68% ready</strong> for de-escalation to Ward.</p>
             <div className="fluid-balance">
                <span>Fluid Balance (24h):</span>
                <strong className="positive">+1.2L (Stable)</strong>
             </div>
          </motion.div>
        )}

        {activeTab === 'trials' && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="suite-view">
             <div className="trial-card">
                <span className="material-symbols-outlined success-icon">verified</span>
                <h5>Eligible: RECOVERY-SEPSIS</h5>
                <p>Matching criteria found for Phase III IV Ig Study.</p>
                <button className="sg-btn sg-btn-outline full-width">Enroll Patient</button>
             </div>
          </motion.div>
        )}

        {activeTab === 'vision' && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="suite-view vision-view">
             <h4>Visionary Roadmap</h4>
             <div className="vision-scroll">
                {visionFeatures.map((f, i) => (
                   <div key={i} className="vision-item">
                      <span className="v-dot"></span>
                      <div className="v-text">
                         <strong>{f.title}</strong>
                         <p>{f.desc}</p>
                      </div>
                   </div>
                ))}
                <p className="v-more">+15 more AI-driven features in clinical queue.</p>
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
