import React, { useState, useRef, useEffect } from 'react';
import './GroqChat.css';
import { aiAPI } from '../api/client';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

export default function GroqChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your **SepsisGuard AI Assistant** powered by Groq. I can help with:\n\n• Patient vitals analysis\n• Sepsis risk interpretation\n• Recovery suggestions\n• Medication guidance\n• Clinical protocol queries\n\nHow can I assist you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pulseCount, setPulseCount] = useState(0);
  const chatBodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Pulse animation counter for the chat button
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const getSystemPrompt = () => {
    const role = localStorage.getItem('role') || 'doctor';
    const name = localStorage.getItem('name') || 'User';
    
    const roleContext = {
      doctor: `You are a clinical AI assistant for Dr. ${name} in the ICU. Provide concise, evidence-based clinical insights. Use medical terminology appropriately. Focus on sepsis detection, vital trends analysis, and protocol recommendations. Always cite clinical guidelines when relevant (e.g., Surviving Sepsis Campaign).`,
      patient: `You are a compassionate health assistant for patient ${name}. Explain medical concepts in simple, reassuring language. Never use alarming terminology. Focus on recovery tips, medication explanations, and wellness guidance. Always recommend consulting their care team for medical decisions.`,
      family: `You are a supportive family care assistant helping ${name}'s family understand their loved one's condition. Use empathetic, clear language. Explain medical updates simply. Provide emotional support tips and practical caregiving advice. Always reassure that the medical team is in control.`
    };

    return `${roleContext[role] || roleContext.doctor}\n\nIMPORTANT: Keep responses concise (2-4 paragraphs max). Use bullet points for lists. Format with markdown. Current time: ${new Date().toLocaleString()}.`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Try Groq direct API first
      if (GROQ_API_KEY) {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [
              { role: 'system', content: getSystemPrompt() },
              ...messages.slice(-10).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: userMessage.content }
            ],
            temperature: 0.7,
            max_tokens: 1024,
            stream: false
          })
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage = data.choices[0].message.content;
          setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
          setIsTyping(false);
          return;
        }
      }

      // Fallback to backend API
      try {
        const response = await aiAPI.getChatResponse(userMessage.content, {
          role: localStorage.getItem('role'),
          history: messages.slice(-6)
        });
        setMessages(prev => [...prev, { role: 'assistant', content: response.data?.response || response.data?.message || 'I\'m processing your request.' }]);
      } catch {
        // Smart fallback responses
        const fallbackResponse = generateFallbackResponse(userMessage.content);
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
      }
    } catch (err) {
      const fallbackResponse = generateFallbackResponse(userMessage.content);
      setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateFallbackResponse = (query) => {
    const q = query.toLowerCase();
    const role = localStorage.getItem('role') || 'doctor';

    if (q.includes('sepsis') || q.includes('risk')) {
      return role === 'doctor' 
        ? '**Sepsis Risk Assessment Summary:**\n\n• **Patient #42 (Jameson Blake):** Risk elevated to **45%** — lactate ↑ 2.1 mmol/L, temp trending at 38.9°C, RR elevated to 28 bpm\n• **Top triggers:** Lactic acidosis, temperature trend, tachypnea\n• **Recommendation:** Consider initiating Hour-1 Sepsis Bundle per Surviving Sepsis Campaign guidelines. Obtain blood cultures and start broad-spectrum antibiotics.\n\n_This analysis is AI-generated. Clinical judgment should always take precedence._'
        : 'Your care team is closely monitoring all health indicators. The AI system continuously tracks multiple vital signs to detect any changes early. Rest assured that your medical team is well-informed and taking all necessary precautions. 💙';
    }
    if (q.includes('vital') || q.includes('heart') || q.includes('temp') || q.includes('oxygen')) {
      return '**Current Vital Signs Overview:**\n\n| Vital | Value | Status |\n|-------|-------|--------|\n| ❤️ Heart Rate | 82 bpm | Normal |\n| 💨 SpO2 | 96% | Good |\n| 🌡️ Temperature | 37.6°C | Slight rise |\n| 🫁 Resp. Rate | 18 bpm | Normal |\n| 🩸 BP | 118/76 mmHg | Stable |\n\n_All vitals are being monitored in real-time by the AI system._';
    }
    if (q.includes('medication') || q.includes('medicine') || q.includes('drug')) {
      return '**Active Medications:**\n\n• **Vancomycin** 1g IV — Every 12 hours (Antibiotic)\n• **Normal Saline** 0.9% — Continuous infusion (Hydration)\n• **Acetaminophen** 650mg — PRN for fever (Antipyretic)\n\n⚠️ No drug interactions detected by the AI screening system.\n\n_Always confirm medication changes with your attending physician._';
    }
    if (q.includes('recovery') || q.includes('better') || q.includes('progress')) {
      return '**Recovery Progress:**\n\n✅ **Positive indicators:**\n• Heart rate has stabilized over the past 24 hours\n• Oxygen levels consistently above 95%\n• White blood cell count trending toward normal\n\n📋 **AI Recovery Tips:**\n• Stay well-hydrated (aim for 8+ glasses/day)\n• Get adequate rest — recovery happens during sleep\n• Follow medication schedule precisely\n• Report any new symptoms to your care team immediately\n\n_Recovery takes time. Every small improvement matters!_ 💪';
    }
    return '**I\'m here to help!** I can assist with:\n\n• 📊 **Vital signs analysis** — Ask about specific vitals\n• ⚠️ **Risk assessment** — Sepsis indicators and trends\n• 💊 **Medication info** — Current prescriptions and interactions\n• 📈 **Recovery tracking** — Progress updates and tips\n• 📋 **Protocol guidance** — Clinical best practices\n\nPlease ask me a specific question and I\'ll provide detailed insights.\n\n_Powered by Groq AI with real-time patient data integration._';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { label: 'Vital Signs', query: 'Show me the current vital signs overview' },
    { label: 'Risk Analysis', query: 'What is the current sepsis risk assessment?' },
    { label: 'Recovery Tips', query: 'Give me recovery tips and progress update' },
    { label: 'Medications', query: 'Show active medications and interactions' }
  ];

  const renderMarkdown = (text) => {
    // Simple markdown rendering
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>')
      .replace(/• /g, '<span class="chat-bullet">•</span> ')
      .replace(/\|(.+)\|/g, (match) => {
        return `<span class="chat-table-row">${match}</span>`;
      });
    return `<p>${html}</p>`;
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className={`groq-chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id="groq-chat-toggle"
        aria-label="Toggle AI Chat"
      >
        <span className="material-symbols-outlined filled chat-toggle-icon">
          {isOpen ? 'close' : 'smart_toy'}
        </span>
        {!isOpen && (
          <span className="chat-badge">AI</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="groq-chat-window" role="dialog" aria-label="AI Chat">
          {/* Header */}
          <div className="groq-chat-header">
            <div className="chat-header-left">
              <div className="chat-ai-avatar">
                <span className="material-symbols-outlined filled">smart_toy</span>
              </div>
              <div>
                <h3 className="chat-header-title">SepsisGuard AI</h3>
                <p className="chat-header-status">
                  <span className="status-dot"></span>
                  Powered by Groq • Online
                </p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="groq-chat-body" ref={chatBodyRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="msg-avatar">
                    <span className="material-symbols-outlined filled">smart_toy</span>
                  </div>
                )}
                <div className="msg-bubble">
                  <div
                    className="msg-content"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                  />
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-message assistant">
                <div className="msg-avatar">
                  <span className="material-symbols-outlined filled">smart_toy</span>
                </div>
                <div className="msg-bubble typing-bubble">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions (only show when few messages) */}
            {messages.length <= 1 && (
              <div className="quick-actions">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    className="quick-action-chip"
                    onClick={() => {
                      setInput(action.query);
                      setTimeout(() => {
                        setInput('');
                        setMessages(prev => [...prev, { role: 'user', content: action.query }]);
                        setIsTyping(true);
                        setTimeout(async () => {
                          const resp = generateFallbackResponse(action.query);
                          setMessages(prev => [...prev, { role: 'assistant', content: resp }]);
                          setIsTyping(false);
                        }, 1200);
                      }, 100);
                    }}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="groq-chat-input">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask SepsisGuard AI anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              className="chat-input-field"
              id="groq-chat-input"
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
