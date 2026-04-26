import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GroqPrescriptiveEngine.css';

export default function GroqPrescriptiveEngine({ role = 'patient' }) {
  const [executedOrders, setExecutedOrders] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleExecute = (id) => {
    setExecutedOrders([...executedOrders, id]);
    // In a real app, this would hit the backend EPR system
  };

  const instructions = {
    patient: [
      { id: 'p1', type: 'action', title: 'Movement Order', desc: 'Perform 10min shallow leg raises to prevent muscle atrophy.', icon: 'directions_walk' },
      { id: 'p2', type: 'nutrition', title: 'Prescriptive Meal', desc: 'Consume High-Protein (30g) Whey with Omega-3.', icon: 'restaurant' },
      { id: 'p3', type: 'audio', title: 'Rest Cycle', desc: 'Sync 20min Theta-wave audio for deep healing.', icon: 'headphones' }
    ],
    doctor: [
      { id: 'd1', type: 'order', title: 'Intervention', desc: 'Adjust IV Saline to 125ml/hr for the next 4 hours.', icon: 'water_drop' },
      { id: 'd2', type: 'order', title: 'Lab STAT', desc: 'Order CRP and Procalcitonin to confirm efficacy.', icon: 'biotech' },
      { id: 'd3', type: 'order', title: 'Positioning', desc: 'Elevate head of bed to 30° to optimize SpO2 markers.', icon: 'vertical_align_top' }
    ]
  };

  const current = instructions[role];

  return (
    <div className="prescriptive-engine sg-card-elevated">
      <header className="pre-header">
         <span className="material-symbols-outlined filled sparkles">auto_fix_high</span>
         <div className="pre-title">
            <h3>GROQ PRESCRIPTIVE ORDERS</h3>
            <p>Multi-Modal Hardware Fusion</p>
         </div>
      </header>

      <div className="pre-list">
         {current.map((item, i) => {
           const isDone = executedOrders.includes(item.id);
           return (
             <motion.div 
               key={item.id} 
               className={`pre-item ${item.type} ${isDone ? 'executed' : ''}`}
               initial={{ x: -20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: i * 0.1 }}
             >
                <div className="pre-icon">
                   <span className="material-symbols-outlined">{isDone ? 'check_circle' : item.icon}</span>
                </div>
                <div className="pre-text">
                   <h4>{item.title} {isDone && <span className="executed-tag">LOGGED</span>}</h4>
                   <p>{item.desc}</p>
                   {item.id === 'p3' && (
                     <div className="audio-player-mini">
                        <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleAudio}>
                           <span className="material-symbols-outlined">{isPlaying ? 'pause_circle' : 'play_circle'}</span>
                           {isPlaying ? 'STOP SOUNDSCAPE' : 'PLAY SOUNDSCAPE'}
                        </button>
                        {isPlaying && (
                          <div className="vitals-visualizer">
                             <div className="bar"></div>
                             <div className="bar"></div>
                             <div className="bar"></div>
                             <div className="bar"></div>
                          </div>
                        )}
                        <audio ref={audioRef} loop>
                           <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" type="audio/mpeg" />
                        </audio>
                     </div>
                   )}
                   <button 
                     className={`pre-confirm ${isDone ? 'done' : ''}`} 
                     onClick={() => !isDone && handleExecute(item.id)}
                     disabled={isDone}
                   >
                      {isDone ? 'ORDER EXECUTED' : 'CONFIRM EXECUTION'}
                   </button>
                </div>
             </motion.div>
           );
         })}
      </div>
    </div>
  );
}
