import React from 'react';
import { motion } from 'framer-motion';
import './LoadingScreen.css';

export default function LoadingScreen({ message = "Initializing Sentinel Hub" }) {
  return (
    <div className="platinum-loading-overlay">
      <div className="loader-content">
        <div className="geometric-loader">
          <motion.div 
            className="loader-ring"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          />
          <motion.div 
            className="loader-core"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </div>
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="loader-text"
        >
          <h3>{message}</h3>
          <div className="telemetry-dots">
            <span>SYNCING BIO-MODELS</span>
            <span>SECURE CHANNEL ACTIVE</span>
            <span>GROQ CO-PILOT READY</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
