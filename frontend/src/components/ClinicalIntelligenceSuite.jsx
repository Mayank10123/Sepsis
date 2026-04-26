import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ClinicalIntelligenceSuite.css';

export default function ClinicalIntelligenceSuite({ extended = false }) {
  const [activeTab, setActiveTab] = useState('triage');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isTriageRunning, setIsTriageRunning] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const patients = [
    { id: 42, name: 'Robert Chen', risk: 'Critical', velocity: '+12%/h', reason: 'Hypotension + Rising Procalcitonin' },
    { id: 89, name: 'Sarah Jenkins', risk: 'Watch', velocity: '+4%/h', reason: 'Marginal Lactate Clearing' },
    { id: 12, name: 'David Miller', risk: 'Stable', velocity: '-8%/h', reason: 'Recovering post-septic shock' }
  ];

  const visionFeatures = [
    { title: 'AI Genomics Sync', desc: 'Patient DNA reveals high sensitivity to cytokine storms.' },
    { title: 'Antimicrobial De-escalation', desc: 'Cultures confirmed E.coli; suggest switching to Ciprofloxacin.' },
    { title: 'Cytokine Storm Predictor', desc: 'IL-6 markers trending toward hyper-inflammation window.' },
    { title: 'Sentinel Knowledge Graph', desc: 'Matched against 12.4k similar ICU cases.' }
  ];

  const handleRunTriage = (patient) => {
    setIsTriageRunning(true);
    setTimeout(() => {
      setSelectedPatient(patient);
      setIsTriageRunning(false);
    }, 1500);
  };

  return (
    <div className="intelligence-suite sg-card-elevated">
      <header className="suite-header">
         <div className="header-main">
            <span className="material-symbols-outlined filled">biotech</span>
            <h3>Clinical Command Center</h3>
         </div>
         <div className="ai-status-pill">
            <span className="dot-pulse"></span> GROQ LLAMA 3.1 READY
         </div>
      </header>

      <nav className="suite-nav">
        <button className={activeTab === 'triage' ? 'active' : ''} onClick={() => setActiveTab('triage')}>AI Triage</button>
        <button className={activeTab === 'stewardship' ? 'active' : ''} onClick={() => setActiveTab('stewardship')}>Antibiotics</button>
        <button className={activeTab === 'vision' ? 'active' : ''} onClick={() => setActiveTab('vision')}>Next-Gen</button>
      </nav>

      <div className="suite-content">
        <AnimatePresence mode="wait">
           {activeTab === 'triage' && (
             <motion.div key="t" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="suite-view">
                {!selectedPatient && !isTriageRunning ? (
                  <div className="patient-triage-list">
                     <p className="section-hint">Select patient for analysis:</p>
                     {patients.map(p => (
                        <div key={p.id} className={`triage-row ${p.risk.toLowerCase()}`} onClick={() => handleRunTriage(p)}>
                           <div className="p-info"><strong>{p.name}</strong><span>Bed {p.id}</span></div>
                           <div className="p-risk-tag">{p.risk}</div>
                           <span className="material-symbols-outlined">analytics</span>
                        </div>
                     ))}
                  </div>
                ) : isTriageRunning ? (
                  <div className="triage-loading"><div className="spinner"></div><p>Fusing Multi-Modal Data...</p></div>
                ) : (
                  <div className="triage-detail-view">
                     <button className="back-btn" onClick={() => setSelectedPatient(null)}><span className="material-symbols-outlined">arrow_back</span> Back</button>
                     <h4>{selectedPatient.name}</h4>
                     <div className="risk-metrics-grid">
                        <div className="metric-box critical"><span className="m-label">Risk Velocity</span><span className="m-val">{selectedPatient.velocity}</span></div>
                        <div className="metric-box"><span className="m-label">Priority</span><span className="m-val">CRITICAL</span></div>
                     </div>
                     <div className="ai-insight-panel"><p>{selectedPatient.reason}. Initiate Sentinel Call.</p></div>
                     <button className={`sg-btn sg-btn-primary full-width ${isCalling ? 'calling' : ''}`} onClick={() => {setIsCalling(true); setTimeout(()=>setIsCalling(false), 2000)}}>
                        {isCalling ? 'Connecting...' : `Call ${selectedPatient.name}`}
                     </button>
                  </div>
                )}
             </motion.div>
           )}

           {activeTab === 'stewardship' && (
             <motion.div key="s" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="suite-view">
                {!isApproved ? (
                  <div className="stewardship-card">
                     <div className="drug-info"><span className="material-symbols-outlined">pill</span><div><h4>Vancomycin (Broad)</h4><p>Dose: 1g IV q12h</p></div></div>
                     <div className="ai-suggestion"><p>AI suggests de-escalation to <strong>Ceftriaxone</strong>.</p></div>
                     <button className="sg-btn sg-btn-primary full-width" onClick={() => setIsApproved(true)}>Approve De-escalation</button>
                  </div>
                ) : (
                  <div className="stewardship-success"><span className="material-symbols-outlined">check_circle</span><h4>Therapy Updated</h4><p>Ceftriaxone is now active.</p></div>
                )}
             </motion.div>
           )}

           {activeTab === 'vision' && (
             <motion.div key="v" initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}} className="suite-view vision-view">
                <div className="vision-scroll">
                   {visionFeatures.map((f, i) => (
                      <div key={i} className="vision-item"><span className="v-dot"></span><div className="v-text"><strong>{f.title}</strong><p>{f.desc}</p></div></div>
                   ))}
                </div>
             </motion.div>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}
