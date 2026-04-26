import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SentinelWardMap from './SentinelWardMap';
import ClinicalIntelligenceSuite from './ClinicalIntelligenceSuite';
import NursingDispatch from './NursingDispatch';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [docName] = useState(localStorage.getItem('name') || 'Dr. Jameson');
  const [activeTab, setActiveTab] = useState('overview'); // overview, patients, analytics

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const patients = [
    { id: '42', name: 'Jameson Blake', age: 54, gender: 'M', ward: 'ICU-3', riskScore: 45, status: 'Rising Risk', timeInWard: '14h', critical: true },
    { id: '18', name: 'Elena Rodriguez', age: 62, gender: 'F', ward: 'Ward-2', riskScore: 28, status: 'Stable', timeInWard: '2d', critical: false },
    { id: '09', name: 'David Chen', age: 41, gender: 'M', ward: 'ER-A', riskScore: 12, status: 'Recovering', timeInWard: '8h', critical: false }
  ];

  const alerts = [
    { id: 1, type: 'critical', badge: 'CRITICAL', time: '12m ago', title: 'Lactate Alert (#42)', message: 'Lactate increased from 1.4 to 2.1 mmol/L in 2 hours.' },
    { id: 2, type: 'positive', badge: 'STABLE', time: '45m ago', title: 'Vitals Stabilized (#18)', message: 'Elena’s BP is back in target range (MAP 68 mmHg).' },
    { id: 3, type: 'info', badge: 'PROTOCOL', time: '1h ago', title: 'Hour-1 Bundle Met', message: 'Antibiotics administered for high-risk triage #09.' }
  ];

  const [todos, setTodos] = useState([
    { id: 1, task: 'Review Bed 42 Vitals spike', priority: 'High', deadline: '15:30', done: false, notes: '' },
    { id: 2, task: 'Approve Ceftriaxone for Room 89', priority: 'Medium', deadline: '16:00', done: false, notes: '' },
    { id: 3, task: 'Sign discharge for Elena Rodriguez', priority: 'Low', deadline: 'ASAP', done: false, notes: '' }
  ]);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ topic: '', priority: 'High', deadline: '' });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'CRITICAL: Bed 42 SpO2', msg: 'Oxygen saturation dropped to 88%. Check Biometric Vest.', type: 'critical', time: '2m ago', read: false },
    { id: 2, title: 'New Lab Results', msg: 'Lactate levels for Jameson Blake (ICU-3) are now available.', type: 'info', time: '15m ago', read: false },
    { id: 3, title: 'Nurse Assigned', msg: 'Nurse Elena has been assigned to Ward 2.', type: 'success', time: '1h ago', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddNote = (id, note) => {
    setTodos(todos.map(t => t.id === id ? { ...t, notes: note } : t));
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.topic) return;
    
    const taskObj = {
      id: Date.now(),
      task: newTask.topic,
      priority: newTask.priority,
      deadline: newTask.deadline || 'No Deadline',
      notes: '',
      done: false
    };
    
    setTodos([taskObj, ...todos]);
    setShowTaskForm(false);
    setNewTask({ topic: '', priority: 'High', deadline: '' });
  };

  const renderOverview = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="doc-content-grid">
      {/* Left Column */}
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="doc-left-col">
        {/* Stats Row */}
        <div className="stats-row sg-stagger">
          <div className="stat-card">
            <div className="stat-head">CRITICAL PATIENTS</div>
            <div className="stat-main">
              <span className="stat-number danger">04</span>
              <span className="stat-sub danger">+1 this hour</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-head">WARD CAPACITY</div>
            <div className="stat-main">
              <span className="stat-number">92</span>
              <span className="stat-unit">%</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-head">BUNDLE COMPLIANCE</div>
            <div className="stat-main">
              <span className="stat-number">98</span>
              <span className="stat-unit">%</span>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="patient-table-container">
          <div className="table-header-row">
            <div className="th-col">Patient & Ward</div>
            <div className="th-col">AI Risk Index</div>
            <div className="th-col">Status</div>
            <div className="th-col">Actions</div>
          </div>

          <div className="patient-list">
            {patients.map((p) => (
              <div key={p.id} className={`patient-row ${p.critical ? 'critical-row' : ''}`} onClick={() => navigate(`/patient/${p.id}`)}>
                {p.critical && <span className="critical-badge-float">CRITICAL WATCH</span>}
                <div className="pr-col pr-patient">
                  <div className={`patient-id-badge ${p.critical ? 'critical' : ''}`}>{p.id}</div>
                  <div className="patient-info-text">
                    <span className="patient-name-text">{p.name}</span>
                    <span className="patient-ward-text">{p.ward} • {p.age}{p.gender}</span>
                  </div>
                </div>
                <div className="pr-col pr-risk">
                  <span className={`risk-score ${p.riskScore > 35 ? 'high' : p.riskScore > 25 ? 'medium' : 'low'}`}>{p.riskScore}%</span>
                  <span className={`risk-label ${p.riskScore > 35 ? 'high' : ''}`}>AI Sepsis Probability</span>
                </div>
                <div className="pr-col pr-status">
                  <div className={`status-chip ${p.critical ? 'rising' : 'stable'}`}>
                    <span className="material-symbols-outlined status-arrow">{p.critical ? 'trending_up' : 'trending_flat'}</span>
                    {p.status}
                  </div>
                </div>
                <div className="pr-col pr-actions">
                   <button className="view-vitals-btn">VIEW VITALS</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Action Engine (Todo) */}
        <div className="todo-container sg-card-elevated">
          <div className="todo-header">
            <h3>Clinical Action Engine</h3>
            <span className="todo-count">{todos.filter(t => !t.done).length} Pending</span>
          </div>
          <div className="todo-list">
            {todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.done ? 'done' : ''} ${todo.priority.toLowerCase()}`}>
                <button className="todo-check" onClick={() => toggleTodo(todo.id)}>
                   <span className="material-symbols-outlined">
                     {todo.done ? 'check_circle' : 'radio_button_unchecked'}
                   </span>
                </button>
                <div className="todo-body">
                   <div className="todo-text-group">
                      <strong>{todo.task}</strong>
                      <span className="todo-meta">{todo.deadline && `🕒 ${todo.deadline}`}</span>
                   </div>
                   <div className="todo-actions-group">
                      <span className="todo-priority-tag">{todo.priority}</span>
                      <button className="note-toggle-btn" onClick={() => {
                        const n = prompt("Add Clinical Note:", todo.notes);
                        if (n !== null) handleAddNote(todo.id, n);
                      }}>
                         <span className="material-symbols-outlined">edit_note</span>
                      </button>
                   </div>
                </div>
                {todo.notes && (
                  <div className="todo-note-display">
                     <span className="material-symbols-outlined">sticky_note_2</span>
                     {todo.notes}
                  </div>
                )}
              </div>
            ))}
          </div>

          <AnimatePresence>
            {showTaskForm ? (
              <motion.form 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }} 
                exit={{ height: 0, opacity: 0 }}
                className="task-composer-form"
                onSubmit={handleCreateTask}
              >
                 <div className="composer-row">
                    <input 
                      type="text" 
                      placeholder="Task Topic (e.g. Review MRI)" 
                      className="sg-input"
                      value={newTask.topic}
                      onChange={(e) => setNewTask({...newTask, topic: e.target.value})}
                    />
                    <select 
                      className="sg-input"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                       <option value="High">High Priority</option>
                       <option value="Medium">Medium</option>
                       <option value="Low">Low</option>
                    </select>
                 </div>
                 <div className="composer-row">
                    <input 
                      type="text" 
                      placeholder="Deadline (e.g. 14:00 PM)" 
                      className="sg-input"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                    />
                    <div className="sync-toggle">
                       <input type="checkbox" id="nurseSync" />
                       <label htmlFor="nurseSync">Broadcast to All Nurses</label>
                    </div>
                 </div>
                 <div className="composer-actions">
                    <button type="submit" className="sg-btn sg-btn-primary">CREATE & SYNC</button>
                    <button type="button" className="sg-btn sg-btn-outline" onClick={() => setShowTaskForm(false)}>CANCEL</button>
                 </div>
              </motion.form>
            ) : (
              <button className="add-task-btn" onClick={() => setShowTaskForm(true)}>
                 <span className="material-symbols-outlined">add</span> COMPOSE NEW CLINICAL TASK
              </button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Right Column (Alerts + Performance) */}
      <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="doc-right-col">
        {/* Recent Alerts */}
        <div className="alerts-panel">
          <div className="alerts-panel-header">
            <h3>Recent Alerts</h3>
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className="alerts-list sg-stagger">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card alert-${alert.type}`}>
                <div className="alert-card-top">
                  <span className={`alert-type-badge ${alert.type}`}>{alert.badge}</span>
                  <span className="alert-time">{alert.time}</span>
                </div>
                <h4 className="alert-card-title">{alert.title}</h4>
                <p className="alert-card-msg">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Performance */}
        <div className="performance-card">
          <div className="perf-header">DAILY PERFORMANCE</div>
          <div className="perf-score">
            <span className="perf-number">98%</span>
            <span className="material-symbols-outlined filled perf-check">verified</span>
          </div>
          <p className="perf-label">Protocol Compliance</p>
          <div className="perf-bar-bg">
            <div className="perf-bar-fill" style={{ width: '98%' }}></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderPatients = () => (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="doc-full-patients-view">
        <div className="patients-grid-header sg-card">
           <div className="search-filter-row">
              <div className="topbar-search">
                 <span className="material-symbols-outlined search-icon">search</span>
                 <input type="text" placeholder="Search patients by name, ward, or ID..." className="search-input" style={{width: '400px'}} />
              </div>
              <div className="filter-chips">
                 <span className="filter-chip active">All Patients</span>
                 <span className="filter-chip">Critical Only</span>
                 <span className="filter-chip">Recently Admitted</span>
              </div>
           </div>
        </div>

        <div className="patient-cards-grid">
           {patients.map(p => (
             <div key={p.id} className={`p-mini-card sg-card ${p.critical ? 'critical-border' : ''}`} onClick={() => navigate(`/patient/${p.id}`)}>
                <div className="p-mini-top">
                   <div className="p-mini-avatar">{p.name.charAt(0)}</div>
                   <div className="p-mini-meta">
                      <h4>{p.name}</h4>
                      <p>{p.ward} • {p.age}{p.gender}</p>
                   </div>
                   <div className={`p-mini-score ${p.critical ? 'high' : ''}`}>{p.riskScore}%</div>
                </div>
                <div className="p-mini-vitals">
                   <div className="v-mini"><span>HR</span> <strong>114</strong></div>
                   <div className="v-mini"><span>MAP</span> <strong>62</strong></div>
                   <div className="v-mini"><span>TEMP</span> <strong>38.9</strong></div>
                </div>
                <button className="sg-btn sg-btn-outline full-width">View Full Profile</button>
             </div>
           ))}
        </div>
    </motion.div>
  );

  return (
    <div className="doc-dashboard">
      {/* SIDEBAR */}
      <aside className="doc-sidebar">
        <div className="sidebar-top">
          <div className="sidebar-logo">
            <span className="material-symbols-outlined filled logo-icon">shield_with_heart</span>
            <span className="logo-text">SepsisGuard</span>
          </div>

          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="profile-info">
              <div className="profile-name">{docName}</div>
              <div className="profile-dept">ICU Specialist</div>
            </div>
          </div>

          <button className="protocol-btn" onClick={() => navigate('/analytics')}>
            <span className="material-symbols-outlined">analytics</span>
            View Clinical Analytics
          </button>

          <nav className="sidebar-nav">
            <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <span className="material-symbols-outlined">dashboard</span> Overview
            </button>
            <button className={`nav-link ${activeTab === 'patients' ? 'active' : ''}`} onClick={() => setActiveTab('patients')}>
              <span className="material-symbols-outlined">group</span> My Patients
            </button>
            <button className={`nav-link ${activeTab === 'intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('intelligence')}>
              <span className="material-symbols-outlined">psychology</span> Clinical Intelligence
            </button>
            <button className={`nav-link ${activeTab === 'ward' ? 'active' : ''}`} onClick={() => setActiveTab('ward')}>
              <span className="material-symbols-outlined">map</span> Ward Heatmap
            </button>
            <button className={`nav-link ${activeTab === 'nursing' ? 'active' : ''}`} onClick={() => setActiveTab('nursing')}>
              <span className="material-symbols-outlined">assignment_ind</span> Nursing Dispatch
            </button>
            <Link to="/analytics" className="nav-link">
              <span className="material-symbols-outlined">monitoring</span> Performance
            </Link>
            <Link to="/settings" className="nav-link">
              <span className="material-symbols-outlined">settings</span> App Settings
            </Link>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <Link to="/support" className="nav-link footer-link">
            <span className="material-symbols-outlined">help</span> Help Center
          </Link>
          <button onClick={handleLogout} className="nav-link footer-link logout-btn" style={{background: 'transparent', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer'}}>
            <span className="material-symbols-outlined">logout</span> Log Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="doc-main">
        {/* Top Bar */}
        <header className="doc-topbar">
          <div className="topbar-left">
            <div className="topbar-title">
              {activeTab === 'overview' ? 'Clinical Overview' : 
               activeTab === 'patients' ? 'Patient Roster' : 
               activeTab === 'intelligence' ? 'Clinical Intelligence' : 
               activeTab === 'ward' ? 'Ward Heatmap' : 'Nursing Command'}
            </div>
          </div>
          <div className="topbar-right">
            <div className="voice-hint-pill" onClick={() => navigate('/patient/42')}>
               <span className="material-symbols-outlined">settings_voice</span>
               <span>"Hey Sentinel..."</span>
            </div>
            
            <div className="notif-hub-wrapper">
               <button className="topbar-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                  <span className="material-symbols-outlined">notifications</span>
                  {unreadCount > 0 && <span className="notif-dot"></span>}
               </button>
               
               <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.95 }}
                      className="notif-dropdown sg-card"
                    >
                       <div className="notif-dropdown-header">
                          <h4>Sentinel Alert Hub</h4>
                          <button className="mark-read-btn" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>Mark all as read</button>
                       </div>
                       <div className="notif-dropdown-list">
                          {notifications.map(n => (
                            <div key={n.id} className={`notif-dropdown-item ${n.read ? 'read' : ''} ${n.type}`}>
                               <div className="notif-item-icon">
                                  <span className="material-symbols-outlined">
                                     {n.type === 'critical' ? 'warning' : n.type === 'success' ? 'check_circle' : 'info'}
                                  </span>
                               </div>
                               <div className="notif-item-content">
                                  <div className="notif-item-title">{n.title}</div>
                                  <div className="notif-item-msg">{n.msg}</div>
                                  <div className="notif-item-time">{n.time}</div>
                               </div>
                            </div>
                          ))}
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div className="topbar-avatar" onClick={() => navigate('/settings')}>
              JD
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'patients' && renderPatients()}
          {activeTab === 'intelligence' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="intelligence-view">
               <ClinicalIntelligenceSuite extended={true} />
            </motion.div>
          )}

          {activeTab === 'ward' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="ward-view">
               <SentinelWardMap />
            </motion.div>
          )}

          {activeTab === 'nursing' && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="nursing-view">
               <NursingDispatch />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default DoctorDashboard;
