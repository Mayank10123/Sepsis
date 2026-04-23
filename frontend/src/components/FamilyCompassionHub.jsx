import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './FamilyCompassionHub.css';

export default function FamilyCompassionHub() {
  const [activeTab, setActiveTab] = useState('explainer');

  const familyRoadmap = [
    { title: 'AI Physician Translator', desc: 'Real-time conversion of medical jargon to simple English.' },
    { title: 'Family Visit Safety Timer', desc: 'Optimal visiting hours based on patient rest cycles.' },
    { title: 'Hospital Amenities AR', desc: 'Visual guide to cafeterias, chapel, and ICU entrances.' },
    { title: 'Warrior Social Update', desc: 'Secure, non-private status generator for friends/family.' }
  ];

  return (
    <div className="compassion-hub sg-card">
      <header className="compassion-header">
         <span className="material-symbols-outlined">favorite</span>
         <h3>Family Compassion Hub</h3>
      </header>

      <nav className="compassion-nav">
         <button className={activeTab === 'explainer' ? 'active' : ''} onClick={() => setActiveTab('explainer')}>Explain</button>
         <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>Team</button>
         <button className={activeTab === 'vision' ? 'active' : ''} onClick={() => setActiveTab('vision')}>Vision</button>
      </nav>

      <div className="compassion-content">
         {activeTab === 'explainer' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="hub-view">
               <div className="lab-explainer-card">
                  <h4>What is "Lactate"?</h4>
                  <p>Think of it like a body smoke detector. Currently 2.1 — showing steady clearing of the infection.</p>
               </div>
            </motion.div>
         )}

         {activeTab === 'team' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="hub-view">
               <div className="team-profiles-mini">
                  <div className="t-prof">
                     <span className="material-symbols-outlined profile-t">account_circle</span>
                     <div><strong>Dr. Miller</strong><p>Lead ICU Specialist</p></div>
                  </div>
                  <div className="t-prof">
                     <span className="material-symbols-outlined profile-t">account_circle</span>
                     <div><strong>Nurse David</strong><p>Primary Care Nurse</p></div>
                  </div>
               </div>
            </motion.div>
         )}

         {activeTab === 'vision' && (
            <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="hub-view vision-view">
               <h4>Compassion Roadmap</h4>
               <div className="vision-scroll">
                  {familyRoadmap.map((f, i) => (
                     <div key={i} className="vision-item">
                        <span className="v-dot"></span>
                        <div className="v-text">
                           <strong>{f.title}</strong>
                           <p>{f.desc}</p>
                        </div>
                     </div>
                  ))}
                  <p className="v-more">+16 More Compassion Features In Queue</p>
               </div>
            </motion.div>
         )}
      </div>
    </div>
  );
}
