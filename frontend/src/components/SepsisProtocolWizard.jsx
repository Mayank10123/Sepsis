import React, { useState, useEffect } from 'react';
import './SepsisProtocolWizard.css';

export default function SepsisProtocolWizard({ patientId = '42', onClose }) {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(3600); // 60 minutes in seconds
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const steps = [
    {
      id: 1,
      title: 'Lactate Measurement',
      desc: 'Measure lactate level. Remeasure if initial lactate is > 2 mmol/L.',
      icon: 'water_drop'
    },
    {
      id: 2,
      title: 'Blood Cultures',
      desc: 'Obtain blood cultures prior to administration of antibiotics.',
      icon: 'biotech'
    },
    {
      id: 3,
      title: 'Broad-Spectrum Antibiotics',
      desc: 'Administer broad-spectrum antibiotics based on clinical suspicion.',
      icon: 'medication'
    },
    {
      id: 4,
      title: 'Fluid Resuscitation',
      desc: 'Begin rapid administration of 30mL/kg crystalloid for hypotension or lactate ≥4 mmol/L.',
      icon: 'iv_bag'
    },
    {
      id: 5,
      title: 'Vasopressors',
      desc: 'Apply vasopressors if patient is hypotensive during or after fluid resuscitation to maintain MAP ≥ 65 mmHg.',
      icon: 'monitoring'
    }
  ];

  const toggleStep = (id) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;

  return (
    <div className="protocol-wizard-overlay sg-fade-in">
      <div className="protocol-wizard-card sg-scale-in">
        {/* Header */}
        <header className="wizard-header">
           <div className="wizard-title-col">
              <span className="material-symbols-outlined filled header-icon">emergency</span>
              <div className="title-text">
                 <h3>Hour-1 Sepsis Bundle</h3>
                 <p>Patient #42: Jameson Blake</p>
              </div>
           </div>
           <div className={`wizard-timer ${timer < 600 ? 'expired' : ''}`}>
              <span className="material-symbols-outlined">schedule</span>
              <span className="timer-val">{formatTime(timer)}</span>
           </div>
           <button className="wizard-close" onClick={onClose}><span className="material-symbols-outlined">close</span></button>
        </header>

        {/* AI Insight */}
        <div className="wizard-ai-bar">
           <span className="material-symbols-outlined">auto_awesome</span>
           <p><strong>Groq AI Suggestion:</strong> Initiate fluid challenges immediately; current lactate trend indicates metabolic acidosis.</p>
        </div>

        {/* Progress */}
        <div className="wizard-progress-section">
           <div className="progress-label">
              <span>Overall Compliance</span>
              <span>{Math.round(progress)}%</span>
           </div>
           <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
           </div>
        </div>

        {/* Steps List */}
        <div className="wizard-steps-list">
           {steps.map(s => (
             <div key={s.id} className={`wizard-step-item ${completedSteps.includes(s.id) ? 'completed' : ''}`}>
                <div className="step-check-col">
                   <button className="step-checkbox" onClick={() => toggleStep(s.id)}>
                      {completedSteps.includes(s.id) && <span className="material-symbols-outlined">check</span>}
                   </button>
                </div>
                <div className="step-icon-col">
                   <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <div className="step-content-col">
                   <h4 className="step-title">{s.id}. {s.title}</h4>
                   <p className="step-desc">{s.desc}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Footer */}
        <footer className="wizard-footer">
           <button className="sg-btn sg-btn-secondary" onClick={onClose}>Minimize</button>
           <button className="sg-btn sg-btn-primary" disabled={completedSteps.length < steps.length} onClick={() => alert('Protocol Submitted Successfully')}>
              Finish & Sign Protocol
           </button>
        </footer>
      </div>
    </div>
  );
}
