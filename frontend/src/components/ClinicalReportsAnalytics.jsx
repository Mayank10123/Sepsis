import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import './ClinicalReportsAnalytics.css';

export default function ClinicalReportsAnalytics() {
  const navigate = useNavigate();

  const complianceData = [
    { ward: 'ICU-A', score: 94.2 },
    { ward: 'ICU-B', score: 88.5 },
    { ward: 'Ward-4', score: 91.0 },
    { ward: 'Ward-2', score: 82.4 },
    { ward: 'ER', score: 96.8 }
  ];

  const stats = [
    { label: 'Bundle Compliance', val: '94.2%', trend: '+2.1%', icon: 'verified' },
    { label: 'Early Alerts', val: '1,284', trend: '-15%', icon: 'notification_important' },
    { label: 'Mortality Rate', val: '8.1%', trend: '-0.3%', icon: 'monitoring' }
  ];

  return (
    <div className="analytics-page sg-fade-in">
      <header className="analytics-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/doctor')}>
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1>Clinical Reports & Analytics</h1>
        </div>
        <div className="header-right">
          <button className="sg-btn sg-btn-primary">
             <span className="material-symbols-outlined">download</span>
             Export PDF
          </button>
        </div>
      </header>

      <main className="analytics-grid">
        {/* Stats Row */}
        <div className="analytics-stats-row">
           {stats.map((s, i) => (
             <div key={i} className="stat-card sg-card">
                <div className="stat-icon-bg"><span className="material-symbols-outlined">{s.icon}</span></div>
                <div className="stat-info">
                   <span className="s-label">{s.label}</span>
                   <span className="s-val">{s.val}</span>
                   <span className="s-trend success">{s.trend} improvement</span>
                </div>
             </div>
           ))}
        </div>

        <div className="analytics-main-row">
           {/* Chart Section */}
           <div className="chart-section sg-card">
              <div className="section-head">
                 <h3>Protocol Compliance by Ward</h3>
                 <span className="material-symbols-outlined">filter_list</span>
              </div>
              <div className="chart-box">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={complianceData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                       <XAxis dataKey="ward" tick={{fontSize: 12, fontWeight: 600}} axisLine={false} tickLine={false} />
                       <YAxis hide={true} domain={[0, 100]} />
                       <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                       <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                          {complianceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#003f87' : '#acc7ff'} />
                          ))}
                       </Bar>
                    </BarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Sentinel Insight */}
           <div className="insight-panel sg-card">
              <div className="insight-head">
                 <span className="material-symbols-outlined filled">bolt</span>
                 <h3>Sentinel AI Analysis</h3>
              </div>
              <div className="insight-content">
                 <p className="ai-quote">"ER shows highest compliance due to recent training. Ward-2 requires intervention for lactate lab turnaround times."</p>
                 <div className="insight-actions">
                    <button className="sg-btn sg-btn-secondary full-width">Schedule Training</button>
                    <button className="sg-btn sg-btn-outline full-width">View Ward-2 Detail</button>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
