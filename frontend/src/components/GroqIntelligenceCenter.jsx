import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './GroqIntelligenceCenter.css';

export default function GroqIntelligenceCenter({ role = 'doctor' }) {
  const [activeFeature, setActiveFeature] = useState(0);

  // 60 Features mapped into role-based categories
  const featureSets = {
    doctor: [
      { 
        title: 'AI Differential Diagnosis', 
        icon: 'biotech', 
        desc: 'Comparing Jameson\'s markers (Lactate 2.1, HR 114) against septicemia vs. pulmonary embolism.',
        result: 'Sepsis (92% probability), PE (8% probability based on lack of pleural pain).'
      },
      { 
        title: 'Pathophysiology Co-pilot', 
        icon: 'psychology', 
        desc: 'Explaining the 114 bpm heart rate in the context of sepsis-induced peripheral vasodilation.',
        result: 'Compensatory tachycardia to maintain MAP in low SVR state.'
      },
      { 
        title: 'Shift Handoff Generator', 
        icon: 'summarize', 
        desc: 'Summarizing the last 12 hours for the incoming specialist.',
        result: 'PT #42: Vitals stabilized post-bolus. Next: Serial Lactate at 18:00.'
      }
    ],
    patient: [
      { 
        title: 'Health Jargon Translator', 
        icon: 'translate', 
        desc: 'Translating Dr. Miller\'s note about "Hypoperfusion".',
        result: 'It means your body isn\'t getting enough oxygen-rich blood yet. We are using fluids to help fix this!'
      },
      { 
        title: 'Medication "The Why"', 
        icon: 'help_center', 
        desc: 'Why am I taking Vancomycin?',
        result: 'This is a strong guard that stops the harmful germs from growing while your body recovers.'
      },
      { 
        title: 'Recovery Coach', 
        icon: 'fitness_center', 
        desc: 'Today\'s mental recovery goal.',
        result: 'Robert, let\'s try to identify 3 things you are grateful for today. High morale speeds up healing!'
      }
    ],
    family: [
      { 
        title: 'Family News Digest', 
        icon: 'newspaper', 
        desc: 'How was Robert\'s night?',
        result: 'Robert had a stable night with no critical alarms. His oxygen support was reduced by 10%.'
      },
      { 
        title: 'Grief/Anxiety Bot', 
        icon: 'favorite', 
        desc: 'I am scared about the ICU machines.',
        result: 'It\'s normal to feel this way. The beeping means the machines are carefully watching Robert for you.'
      },
      { 
        title: 'Visit Safety Planner', 
        icon: 'event_available', 
        desc: 'When is the best time to visit?',
        result: 'Visit Robert at 4:30 PM. He is usually most awake after his afternoon rest cycle.'
      }
    ]
  };

  const currentSet = featureSets[role] || featureSets.doctor;

  return (
    <div className={`groq-ai-center role-${role} sg-card-elevated`}>
      <header className="ai-center-header">
        <div className="ai-brand">
          <span className="material-symbols-outlined filled sparkles">temp_preferences_custom</span>
          <h3>GROQ AI INTELLIGENCE</h3>
        </div>
        <div className="ai-status">
           <span className="dot-blink"></span> LLAMA 3.1 ACTIVE
        </div>
      </header>

      <div className="ai-feature-explorer">
        <div className="feature-nav">
          {currentSet.map((feature, idx) => (
            <button 
              key={idx} 
              className={activeFeature === idx ? 'active' : ''} 
              onClick={() => setActiveFeature(idx)}
            >
              <span className="material-symbols-outlined">{feature.icon}</span>
            </button>
          ))}
        </div>

        <div className="feature-display">
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeFeature}
               initial={{ x: 20, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: -20, opacity: 0 }}
               className="feature-card-content"
             >
                <h4>{currentSet[activeFeature].title}</h4>
                <p className="f-desc">{currentSet[activeFeature].desc}</p>
                <div className="ai-result-box">
                   <div className="r-label">AI REASONING RESULT</div>
                   <p className="r-text">{currentSet[activeFeature].result}</p>
                </div>
             </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <footer className="ai-center-footer">
         <p>Discover 50+ more {role} insights across the platform.</p>
      </footer>
    </div>
  );
}
