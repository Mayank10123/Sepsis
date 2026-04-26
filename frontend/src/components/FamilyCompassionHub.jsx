import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './FamilyCompassionHub.css';

export default function FamilyCompassionHub({ extended = false }) {
  const [activeTab, setActiveTab] = useState('explainer');

  const familyRoadmap = [
    { title: 'AI Physician Translator', desc: 'Real-time conversion of medical jargon to simple English.' },
    { title: 'Family Visit Safety Timer', desc: 'Optimal visiting hours based on patient rest cycles.' },
    { title: 'Hospital Amenities AR', desc: 'Visual guide to cafeterias, chapel, and ICU entrances.' },
    { title: 'Warrior Social Update', desc: 'Secure, non-private status generator for friends/family.' }
  ];

  return (
    <div className={`compassion-hub sg-card ${extended ? 'extended' : ''}`}>
      <header className="compassion-header">
         <span className="material-symbols-outlined">favorite</span>
         <h3>Family Compassion Hub</h3>
      </header>

      <nav className="compassion-nav">
         <button className={activeTab === 'explainer' ? 'active' : ''} onClick={() => setActiveTab('explainer')}>Explain</button>
         <button className={activeTab === 'message' ? 'active' : ''} onClick={() => setActiveTab('message')}>Message</button>
         <button className={activeTab === 'healing' ? 'active' : ''} onClick={() => setActiveTab('healing')}>Healing</button>
         <button className={activeTab === 'team' ? 'active' : ''} onClick={() => setActiveTab('team')}>Team</button>
         <button className={activeTab === 'vision' ? 'active' : ''} onClick={() => setActiveTab('vision')}>Vision</button>
      </nav>

      <div className="compassion-content">
         <AnimatePresence mode="wait">
            {activeTab === 'explainer' && (
               <motion.div key="explainer" initial={{opacity: 0, x: -10}} animate={{opacity: 1, x: 0}} exit={{opacity: 0}} className="hub-view">
                  <div className="lab-explainer-card">
                     <div className="metaphor-tag">AI METAPHOR</div>
                     <h4>What is "Lactate"?</h4>
                     <p>Think of it like a <strong>body smoke detector</strong>. Currently 2.1 — showing steady clearing of the infection. Robert's "smoke" is clearing.</p>
                  </div>
                  <div className="lab-explainer-card">
                     <div className="metaphor-tag">HEALING LOGIC</div>
                     <h4>Blood Pressure (MAP)</h4>
                     <p>Like the <strong>water pressure</strong> in a garden hose. Dr. Miller is keeping it at 68 — perfect for Robert's organs to "thrive".</p>
                  </div>
               </motion.div>
            )}

            {activeTab === 'message' && (
               <motion.div key="message" initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} exit={{opacity: 0}} className="hub-view message-view">
                  <div className="message-wall">
                     <div className="post-it-note">
                        <span className="material-symbols-outlined">push_pin</span>
                        <p>"Robert, we're all rooting for you! The kids sent drawings today."</p>
                        <span className="p-from">— Maria & Kids</span>
                     </div>
                     <button className="add-note-btn">
                        <span className="material-symbols-outlined">edit_square</span>
                        Post a Message
                     </button>
                  </div>
               </motion.div>
            )}

            {activeTab === 'healing' && (
               <motion.div key="healing" initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0}} className="hub-view healing-view">
                  <div className="floral-gift-grid">
                     <div className="gift-card">
                        <span className="material-symbols-outlined flower">filter_vintage</span>
                        <strong>Send Lilies</strong>
                        <p>Virtual bedside bouquet</p>
                     </div>
                     <div className="gift-card active">
                        <span className="material-symbols-outlined flower">eco</span>
                        <strong>Synced Audio</strong>
                        <p>Listen with Robert</p>
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'team' && (
               <motion.div key="team" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="hub-view">
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
               <motion.div key="vision" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="hub-view vision-view">
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
         </AnimatePresence>
      </div>
    </div>
  );
}
