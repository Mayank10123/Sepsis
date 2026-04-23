import React from 'react';
import { motion } from 'framer-motion';
import './GroqPrescriptiveEngine.css';

export default function GroqPrescriptiveEngine({ role = 'patient' }) {
  const instructions = {
    patient: [
      { type: 'action', title: 'Movement Order', desc: 'Perform 10min shallow leg raises to prevent muscle atrophy.', icon: 'directions_walk' },
      { type: 'nutrition', title: 'Prescriptive Meal', desc: 'Consume High-Protein (30g) Whey with Omega-3. Reduces systemic inflammation.', icon: 'restaurant' },
      { type: 'audio', title: 'Rest Cycle', desc: 'Sync 20min Theta-wave audio. Deep healing predicted window starts now.', icon: 'headphones' }
    ],
    doctor: [
      { type: 'order', title: 'Intervention', desc: 'Adjust IV Saline to 125ml/hr for the next 4 hours.', icon: 'water_drop' },
      { type: 'order', title: 'Lab STAT', desc: 'Order CRP and Procalcitonin to confirm antibiotic efficacy.', icon: 'biotech' },
      { type: 'order', title: 'Positioning', desc: 'Elevate head of bed to 30° to optimize SpO2 markers seen in Vest.', icon: 'vertical_align_top' }
    ]
  };

  const current = instructions[role];

  return (
    <div className="prescriptive-engine sg-card-elevated">
      <header className="pre-header">
         <span className="material-symbols-outlined">auto_fix_high</span>
         <div className="pre-title">
            <h3>GROQ PRESCRIPTIVE ORDERS</h3>
            <p>Based on Multi-Modal Fusion</p>
         </div>
      </header>

      <div className="pre-list">
         {current.map((item, i) => (
           <motion.div 
             key={i} 
             className={`pre-item ${item.type}`}
             initial={{ x: -20, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             transition={{ delay: i * 0.1 }}
           >
              <div className="pre-icon">
                 <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <div className="pre-text">
                 <h4>{item.title}</h4>
                 <p>{item.desc}</p>
                 <button className="pre-confirm">CONFIRM EXECUTION</button>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
