import React, { useState } from 'react';
import './MedicationTracker.css';

export default function MedicationTracker({ patientId = '42' }) {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Vancomycin', dose: '1g IV', freq: 'Every 12 hours', next: '8:00 PM', status: 'Pending', type: 'Antibiotic' },
    { id: 2, name: 'Normal Saline', dose: '100mL/hr', freq: 'Continuous', next: 'Active', status: 'Running', type: 'Hydration' },
    { id: 3, name: 'Norepinephrine', dose: '0.05 mcg/kg/min', freq: 'Titrated', next: 'Active', status: 'Running', type: 'Vasopressor' },
    { id: 4, name: 'Acetaminophen', dose: '650mg PO', freq: 'PRN for fever', next: 'As needed', status: 'Available', type: 'Antipyretic' }
  ]);

  return (
    <div className="medication-tracker sg-card">
      <div className="med-header">
        <div className="med-title-row">
          <span className="material-symbols-outlined filled title-icon">medication</span>
          <h3>Medication Schedule</h3>
        </div>
        <button className="add-med-btn"><span className="material-symbols-outlined">add</span></button>
      </div>

      <div className="med-list">
        {meds.map(m => (
          <div key={m.id} className="med-item">
            <div className={`med-type-indicator ${m.type.toLowerCase().split(' ').join('-')}`}></div>
            <div className="med-main-info">
              <span className="med-name">{m.name} <small>{m.dose}</small></span>
              <span className="med-type">{m.type} • {m.freq}</span>
            </div>
            <div className="med-status-col">
              <span className="med-next-label">Next Dose</span>
              <span className="med-next-val">{m.next}</span>
            </div>
            <div className={`med-status-badge ${m.status.toLowerCase()}`}>{m.status}</div>
          </div>
        ))}
      </div>

      <div className="med-ai-warning">
         <span className="material-symbols-outlined">verified_user</span>
         <p>AI Safety Check: <strong>No drug interactions</strong> detected for current regimen.</p>
      </div>

      <button className="view-log-btn">View Administration Log</button>
    </div>
  );
}
