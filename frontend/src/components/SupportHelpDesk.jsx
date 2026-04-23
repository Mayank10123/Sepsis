import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SupportHelpDesk.css';

export default function SupportHelpDesk() {
  const navigate = useNavigate();

  const faqs = [
    { q: 'How does the AI calculate the risk score?', a: 'The SepsisGuard AI uses a deep neural network trained on over 200,000 historic ICU cases. It analyzes 12+ vital signals including lactate trends, MAP, and HR/RR ratios.' },
    { q: 'Can I integrate my hospital EHR?', a: 'Yes, SepsisGuard Live supports direct HL7/FHIR integration. Contact your local IT administrator for mapping details.' },
    { q: 'What is the "Critical Watch" trigger?', a: 'A "Critical Watch" is triggered when the AI score rises by >15% in a single hour or when any single vital meets "Sentinel Alert" thresholds.' }
  ];

  return (
    <div className="support-page sg-fade-in">
       <header className="support-header">
          <div className="header-left">
             <button className="back-btn" onClick={() => navigate('/doctor')}><span className="material-symbols-outlined">arrow_back</span></button>
             <h1>Help Desk & Support</h1>
          </div>
       </header>

       <main className="support-grid">
          {/* Main Support Area */}
          <div className="support-main-content">
             <section className="search-section sg-card">
                <h2>Browse Support Topics</h2>
                <div className="search-box">
                   <span className="material-symbols-outlined">search</span>
                   <input type="text" placeholder="Search for clinical guides, IT support, or FAQs..." />
                </div>
             </section>

             <section className="faq-section">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-list sg-stagger">
                   {faqs.map((f, i) => (
                     <div key={i} className="faq-item sg-card">
                        <h4>{f.q}</h4>
                        <p>{f.a}</p>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Contact Card */}
          <aside className="support-sidebar">
             <div className="contact-card sg-card">
                <div className="c-icon-bg"><span className="material-symbols-outlined">support_agent</span></div>
                <h3>Internal IT Support</h3>
                <p>Urgent technical issues? Contact the 24/7 Ward-Level IT desk.</p>
                <div className="c-links">
                   <a href="tel:+12345678" className="c-btn"><span className="material-symbols-outlined">call</span> (123) 456-78</a>
                   <a href="mailto:it@hospital.com" className="c-btn"><span className="material-symbols-outlined">mail</span> Email IT Desk</a>
                </div>
             </div>

             <div className="network-card sg-card">
                <div className="n-status-head">
                   <span className="status-dot-pulse"></span>
                   <h3>Network Status</h3>
                </div>
                <p>Clinical Network: <strong>OPERATIONAL</strong></p>
                <div className="n-latency">Latency: <strong>42ms (Optimal)</strong></div>
             </div>
          </aside>
       </main>
    </div>
  );
}
