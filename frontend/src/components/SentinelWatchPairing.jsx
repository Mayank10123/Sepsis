import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './SentinelWatchPairing.css';

export default function SentinelWatchPairing({ onPairingComplete }) {
  const [status, setStatus] = useState('idle'); // idle, searching, found, pairing, synced
  const [progress, setProgress] = useState(0);

  const startPairing = () => {
    setStatus('searching');
    setTimeout(() => setStatus('found'), 2500);
  };

  const confirmPairing = () => {
    setStatus('pairing');
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setStatus('synced');
        if (onPairingComplete) onPairingComplete();
      }
    }, 100);
  };

  return (
    <div className="hardware-integration-area">
      <div className="hardware-card sg-card-elevated">
        <header className="hw-header">
           <div className="hw-title">
              <span className="material-symbols-outlined filled">watch</span>
              <h3>Sentinel Wearable v4</h3>
           </div>
           <span className={`hw-status-badge ${status}`}>{status.toUpperCase()}</span>
        </header>

        <div className="hw-visualizer">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hw-state-box">
                <div className="watch-silhouette">
                   <span className="material-symbols-outlined">sensors</span>
                </div>
                <p>No device detected nearby.</p>
                <button className="sg-btn sg-btn-primary" onClick={startPairing}>Search for Watch</button>
              </motion.div>
            )}

            {status === 'searching' && (
              <motion.div key="searching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="hw-state-box">
                <div className="radar-animation">
                   <div className="ripple"></div>
                   <div className="ripple"></div>
                   <div className="ripple"></div>
                   <span className="material-symbols-outlined">bluetooth_searching</span>
                </div>
                <p>Scanning for BLE signals...</p>
              </motion.div>
            )}

            {status === 'found' && (
              <motion.div key="found" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }} className="hw-state-box">
                <div className="device-found-box">
                   <span className="material-symbols-outlined filled success-icon">watch</span>
                   <div className="device-meta">
                      <h4>SentinelWatch 4S-992</h4>
                      <p>Signal Strength: Excellent</p>
                   </div>
                </div>
                <button className="sg-btn sg-btn-primary full-width" onClick={confirmPairing}>Pair Device</button>
              </motion.div>
            )}

            {status === 'pairing' && (
              <motion.div key="pairing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hw-state-box">
                 <div className="pairing-progress">
                    <svg viewBox="0 0 100 100" className="progress-circle">
                       <circle cx="50" cy="50" r="45" className="bg" />
                       <circle cx="50" cy="50" r="45" className="fg" style={{ strokeDashoffset: 283 - (283 * progress) / 100 }} />
                    </svg>
                    <span className="progress-val">{progress}%</span>
                 </div>
                 <p>Encrypting biometric stream...</p>
              </motion.div>
            )}

            {status === 'synced' && (
              <motion.div key="synced" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="hw-state-box">
                 <div className="sync-success">
                    <span className="material-symbols-outlined filled">verified</span>
                    <h4>Securely Linked</h4>
                    <p>Live health data is now streaming to your care team.</p>
                 </div>
                 <div className="live-data-stream">
                    <div className="stream-pill"><span className="dot hr"></span> 82 BPM</div>
                    <div className="stream-pill"><span className="dot temp"></span> 37.6°C</div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="hw-footer">
           <span className="material-symbols-outlined">security</span>
           <p>End-to-End Encrypted Health Loop</p>
        </footer>
      </div>
    </div>
  );
}
