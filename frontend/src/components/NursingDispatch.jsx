import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NursingDispatch.css';

export default function NursingDispatch() {
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cloudFile, setCloudFile] = useState(null);
  const [ping, setPing] = useState(12);
  const fileInputRef = useRef(null);

  const nurses = [
    { id: 1, name: 'Sarah Jenkins, RN', status: 'Available', workload: 40, specialty: 'ICU / Trauma', avatar: 'SJ' },
    { id: 2, name: 'Mike Ross, NP', status: 'In Room 42', workload: 85, specialty: 'Sepsis Specialist', avatar: 'MR' },
    { id: 3, name: 'Elena Gilbert, RN', status: 'Break', workload: 10, specialty: 'Geriatrics', avatar: 'EG' }
  ];

  const patients = [
    { id: 42, name: 'Jameson Blake', risk: 'Critical' },
    { id: 10, name: 'Robert Chen', risk: 'Stable' },
    { id: 89, name: 'Sarah Miller', risk: 'Watch' }
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        setCloudFile(file.name);
      }, 2000);
    }
  };

  const handleAssign = () => {
    setAssignmentSuccess(true);
    setTimeout(() => {
      setAssignmentSuccess(false);
      setSelectedNurse(null);
    }, 3000);
  };

  return (
    <div className="nursing-dispatch sg-fade-in">
      <header className="dispatch-header">
        <div className="header-text">
          <h2>Nursing Command & Dispatch</h2>
          <p>Real-time personnel allocation and task orchestration.</p>
        </div>
        <div className="dispatch-stats">
          <div className="mega-status-badge">
             <span className="live-dot-pulse"></span>
             <div className="mega-status-text">
                <strong>MEGA SECURE NODE</strong>
                <span>Ping: {ping}ms • Encrypted</span>
             </div>
          </div>
          <div className="stat-pill"><span>Active Nurses</span> <strong>12</strong></div>
          <div className="stat-pill"><span>Avg Workload</span> <strong>62%</strong></div>
        </div>
      </header>

      <div className="dispatch-grid">
        {/* Left: Nurse Roster */}
        <section className="nurse-roster sg-card">
          <h3>Active Roster</h3>
          <div className="roster-list">
            {nurses.map(nurse => (
              <motion.div 
                key={nurse.id} 
                className={`nurse-item ${selectedNurse?.id === nurse.id ? 'selected' : ''}`}
                onClick={() => setSelectedNurse(nurse)}
                whileHover={{ x: 5 }}
              >
                <div className="nurse-avatar">{nurse.avatar}</div>
                <div className="nurse-info">
                  <strong>{nurse.name}</strong>
                  <span>{nurse.specialty} • {nurse.status}</span>
                </div>
                <div className="workload-indicator">
                  <div className="workload-bar" style={{ width: `${nurse.workload}%`, background: nurse.workload > 80 ? '#ef4444' : '#10b981' }}></div>
                  <span className="workload-val">{nurse.workload}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right: Assignment & Messaging */}
        <section className="assignment-panel sg-card">
          {selectedNurse ? (
            <AnimatePresence mode="wait">
              {!assignmentSuccess ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="assign">
                  <h3>Dispatching: {selectedNurse.name}</h3>
                  <div className="form-group">
                    <label>Assign to Patient</label>
                    <select className="sg-input">
                      {patients.map(p => <option key={p.id}>{p.name} (Bed {p.id})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Priority Task</label>
                    <textarea className="sg-input" placeholder="e.g. Confirm IV Saline flow and check SpO2 markers..."></textarea>
                  </div>
                  <div className="mega-cloud-zone" onClick={() => fileInputRef.current.click()}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      onChange={handleFileChange} 
                    />
                    {isUploading ? (
                      <div className="mega-progress">
                         <div className="mega-bar-fill"></div>
                         <span>Encrypting to MEGA...</span>
                      </div>
                    ) : cloudFile ? (
                      <div className="mega-file-active">
                         <span className="material-symbols-outlined">cloud_done</span>
                         <span>{cloudFile} (Securely Linked)</span>
                      </div>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">cloud_upload</span>
                        <div className="mega-text">
                           <strong>Secure MEGA Attachment</strong>
                           <span>Click to upload Clinical Protocols</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button className="sg-btn sg-btn-primary full-width" onClick={handleAssign}>
                    SEND DISPATCH ORDER
                  </button>
                </motion.div>
              ) : (
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} key="success" className="assignment-success">
                  <span className="material-symbols-outlined success-icon">send_and_archive</span>
                  <h4>Dispatch Sent Successfully</h4>
                  <p>{selectedNurse.name} has been notified via Sentinel Pager.</p>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="panel-placeholder">
              <span className="material-symbols-outlined">person_add</span>
              <p>Select a nurse from the roster to assign tasks and send clinical files.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
