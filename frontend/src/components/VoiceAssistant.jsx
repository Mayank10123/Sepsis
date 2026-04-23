import React, { useState, useRef, useEffect } from 'react';
import './VoiceAssistant.css';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export default function VoiceAssistant({ patientId = '42', role = 'doctor', context = 'clinical_rounding' }) {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showWaves, setShowWaves] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    // Initialize Web Speech API for recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        processWithGroq(result);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setShowWaves(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setShowWaves(false);
      };
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser.');
      return;
    }
    setAiResponse('');
    setTranscript('');
    setIsListening(true);
    setShowWaves(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processWithGroq = async (text) => {
    setIsProcessing(true);
    
    const systemPrompt = `You are the SepsisGuard Voice Assistant for a ${role}. 
    CONTEXT: Listening to patient #42 (Jameson Blake). 
    TASK: Provide immediate, stabilizing recovery suggestions or clinical protocols based on the user's input.
    STREYLE: Extremely concise (1-2 sentences). Calm, professional, and authoritative.
    IF DESTABILIZING: Suggest immediate actions like fluid challenges or antibiotic escalation.`;

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
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
          ],
          temperature: 0.5,
          max_tokens: 150
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      setAiResponse(content);
      speak(content);
    } catch (err) {
      console.error('Groq processing error:', err);
      const fallback = "System busy. Ensure patient hydration and monitor MAP closely.";
      setAiResponse(fallback);
      speak(fallback);
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  return (
    <div className="voice-assistant-panel sg-card">
      <div className="voice-header">
        <div className="voice-title">
           <span className="material-symbols-outlined filled">mic</span>
           <h3>Clinical Voice Support</h3>
        </div>
        <div className={`voice-status ${isListening ? 'active' : ''}`}>
           {isListening ? 'Listening...' : isProcessing ? 'Thinking...' : isSpeaking ? 'Speaking...' : 'Ready'}
        </div>
      </div>

      <div className="voice-visualizer">
        {showWaves ? (
          <div className="voice-waves">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        ) : (
          <div className={`mic-circle ${isListening ? 'pulse' : ''}`} onClick={isListening ? stopListening : startListening}>
             <span className="material-symbols-outlined">mic</span>
          </div>
        )}
      </div>

      <div className="voice-transcript-area">
        {transcript && (
          <div className="transcript-box sg-slide-up">
            <span className="tag">User Input</span>
            <p>"{transcript}"</p>
          </div>
        )}
        {aiResponse && (
          <div className="response-box sg-slide-up">
            <span className="tag ai">AI Direction</span>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>

      <div className="voice-footer">
        <p className="voice-hint">
          {isListening ? "Say 'Stabilize patient' or 'What are the vitals?'" : "Tap the mic to start clinical voice command."}
        </p>
      </div>
    </div>
  );
}
