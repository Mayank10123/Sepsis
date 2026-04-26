import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './PatientHealingCenter.css';

export default function PatientHealingCenter() {
  const [activeTab, setActiveTab] = useState('milestones');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.volume = 0.6; // Set comfortable healing volume
      audioRef.current.play().catch(err => console.error("Audio Playback Error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const roadmap = [
    { title: 'AR Breathing Games', desc: 'Climb a virtual mountain using your steady breath.' },
    { title: 'Digital Memory Lane', desc: 'Family photos tied to calming vital-synced audio.' },
    { title: 'Circadian Room Sync', desc: 'AI smart-lights matching your natural sleep cycle.' },
    { title: 'Patient Peer Connect', desc: 'Secure video chat with other Sepsis Warriors.' }
  ];

  return (
    <div className="healing-center sg-card">
      <header className="healing-header">
         <span className="material-symbols-outlined">health_and_safety</span>
         <h3>Patient Healing Center</h3>
      </header>

      <nav className="healing-nav">
         <button className={activeTab === 'milestones' ? 'active' : ''} onClick={() => setActiveTab('milestones')}>Goals</button>
         <button className={activeTab === 'audio' ? 'active' : ''} onClick={() => setActiveTab('audio')}>Audio</button>
         <button className={activeTab === 'vision' ? 'active' : ''} onClick={() => setActiveTab('vision')}>Vision</button>
      </nav>

      <div className="healing-content">
         <AnimatePresence mode="wait">
            {activeTab === 'milestones' && (
               <motion.div key="m" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="healing-view">
                  <div className="milestone-stars">
                     <span className="material-symbols-outlined star filled">star</span>
                     <span className="material-symbols-outlined star filled">star</span>
                     <span className="material-symbols-outlined star">star</span>
                  </div>
                  <h4>Great Job, Robert!</h4>
                  <p>You reached <strong>2 out of 3</strong> goals today.</p>
               </motion.div>
            )}

            {activeTab === 'audio' && (
               <motion.div key="a" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="healing-view">
                  <div className="audio-control">
                     <div className={`ripple-container ${isPlaying ? 'active' : ''}`}>
                        <span className="material-symbols-outlined ripple-icon">graphic_eq</span>
                     </div>
                     <p>Vitals-Synced Soundscape: <strong>Deep Forest</strong></p>
                     <button className={`sg-btn ${isPlaying ? 'sg-btn-outline' : 'sg-btn-primary'}`} onClick={toggleAudio}>
                        {isPlaying ? 'PAUSE HEALING' : 'PLAY CALMING AUDIO'}
                     </button>
                     {isPlaying && (
                       <div className="mini-visualizer">
                          <div className="v-bar"></div>
                          <div className="v-bar"></div>
                          <div className="v-bar"></div>
                       </div>
                     )}
                     <audio ref={audioRef} loop onError={() => alert("Deep Forest Signal Interrupted. Checking clinical bridge...")}>
                        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
                     </audio>
                  </div>
               </motion.div>
            )}

            {activeTab === 'vision' && (
               <motion.div key="v" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="healing-view vision-view">
                  <h4>Healing Roadmap</h4>
                  <div className="vision-scroll">
                     {roadmap.map((f, i) => (
                        <div key={i} className="vision-item">
                           <span className="v-dot" style={{background: '#10b981'}}></span>
                           <div className="v-text">
                              <strong>{f.title}</strong>
                              <p>{f.desc}</p>
                           </div>
                        </div>
                     ))}
                     <p className="v-more" style={{color: '#10b981'}}>+16 More Healing Features Added</p>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}
