import React, { useState, useEffect } from 'react';
import './SentinelBriefing.css';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export default function SentinelBriefing({ role = 'doctor', patientId = '42' }) {
  const [briefing, setBriefing] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateBriefing();
  }, [role]);

  const generateBriefing = async () => {
    setLoading(true);
    const context = role === 'doctor' 
      ? 'A clinical ICU handoff briefing for the incoming shift. Focus on lactate trends, MAP, and sepsis protocol compliance.' 
      : 'A compassionate, reassuring status update for the family of a patient in the ICU. Use simple language and focus on the care being provided.';
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-70b-versatile',
          messages: [
            { 
              role: 'system', 
              content: `You are the SepsisGuard Sentinel AI. Task: ${context}. 
              Patient: Jameson Blake (#42). 
              Current Status: Elevated risk (45%), Lactate 2.1, HR 114. 
              Constraint: Max 3 short sentences.` 
            }
          ],
          temperature: 0.3
        })
      });

      const data = await response.json();
      setBriefing(data.choices[0].message.content);
    } catch (err) {
      setBriefing(role === 'doctor' ? 'Shift error: Risk elevated for #42. MAP target 65 mmHg.' : 'Robert is being closely watched by our expert team. His vitals are stable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`sentinel-briefing sg-card ${role}`}>
      <div className="briefing-header">
        <div className="b-title">
          <span className="material-symbols-outlined filled">bolt</span>
          <h3>{role === 'doctor' ? 'Sentinel Shift Briefing' : 'AI Family Update'}</h3>
        </div>
        <button className="refresh-btn" onClick={generateBriefing}>
          <span className={`material-symbols-outlined ${loading ? 'sg-spin' : ''}`}>sync</span>
        </button>
      </div>

      <div className="briefing-content">
        {loading ? (
          <div className="b-skeleton">
            <div className="s-line full"></div>
            <div className="s-line mid"></div>
          </div>
        ) : (
          <p className="b-p">"{briefing}"</p>
        )}
      </div>

      {role === 'doctor' && (
        <div className="briefing-actions">
           <button className="sg-btn sg-btn-primary">Acknowledge Briefing</button>
        </div>
      )}
    </div>
  );
}
