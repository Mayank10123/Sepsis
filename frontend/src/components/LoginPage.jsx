import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [portal, setPortal] = useState('doctors');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simulate a brief loading state for premium feel
      await new Promise(resolve => setTimeout(resolve, 800));

      if (portal === 'doctors') {
        localStorage.setItem('token', 'sg-doctor-token');
        localStorage.setItem('role', 'doctor');
        localStorage.setItem('doctor_id', userId || 'SG-9920-SENT');
        localStorage.setItem('name', 'Dr. Clinical Sentinel');
        navigate('/doctor');
      } else if (portal === 'patients') {
        localStorage.setItem('token', 'sg-patient-token');
        localStorage.setItem('role', 'patient');
        localStorage.setItem('patient_id', userId || '8842');
        localStorage.setItem('name', 'Patient');
        navigate('/patient');
      } else if (portal === 'family') {
        localStorage.setItem('token', 'sg-family-token');
        localStorage.setItem('role', 'family');
        localStorage.setItem('family_id', userId || 'FAM-042');
        localStorage.setItem('name', 'Family Member');
        navigate('/family');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const portals = [
    { id: 'doctors', label: 'Doctors', icon: 'medical_services' },
    { id: 'patients', label: 'Patients', icon: 'person' },
    { id: 'family', label: 'Family', icon: 'family_restroom' }
  ];

  return (
    <div className="login-wrapper">
      {/* Background */}
      <div className="login-bg">
        <div className="login-bg-gradient"></div>
      </div>

      {/* Main Login Card */}
      <main className="login-container">
        {/* Left Brand Panel */}
        <div className="login-brand-panel">
          <div className="brand-blur brand-blur-1"></div>
          <div className="brand-blur brand-blur-2"></div>

          <div className="brand-content">
            <div className="brand-logo">
              <span className="material-symbols-outlined filled brand-shield">shield_with_heart</span>
              <h1 className="brand-title">SepsisGuard Live</h1>
            </div>

            <h2 className="brand-heading">
              Precision<br />Monitoring.<br />
              <span className="brand-accent">Human-Centric Care.</span>
            </h2>

            <p className="brand-subtitle">
              Access live monitoring and AI-driven alerts.
              Use (doctor@sg.ai) #demo
            </p>
          </div>

          <div className="brand-feature-card">
            <div className="feature-icon-circle">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div className="feature-text">
              <p className="feature-title">Real-time Vitals</p>
              <p className="feature-desc">AI-driven early detection</p>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="login-form-panel">
          <div className="form-inner">
            {/* Mobile Branding */}
            <div className="mobile-brand">
              <span className="material-symbols-outlined filled mobile-shield">shield_with_heart</span>
              <h1 className="mobile-brand-title">SepsisGuard Live</h1>
            </div>

            {/* Welcome */}
            <div className="welcome-section">
              <h2 className="welcome-title">Welcome Back</h2>
              <p className="welcome-subtitle">Select your portal to continue</p>
            </div>

            {/* Portal Chips */}
            <div className="portal-chips">
              {portals.map(p => (
                <button
                  key={p.id}
                  className={`portal-chip ${portal === p.id ? 'active' : ''}`}
                  onClick={() => setPortal(p.id)}
                  type="button"
                >
                  <span className="material-symbols-outlined">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="login-form">
              {/* Username */}
              <div className="form-group">
                <label className="form-label">USERNAME / CLINICAL ID</label>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">badge</span>
                  <input
                    type="text"
                    placeholder="Enter your ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    id="login-user-id"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">PASSWORD</label>
                  <a href="#" className="forgot-link">Forgot?</a>
                </div>
                <div className="input-wrapper">
                  <span className="material-symbols-outlined input-icon">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="form-input"
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                    tabIndex={-1}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="remember-group">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="remember-checkbox"
                />
                <label htmlFor="remember" className="remember-label">
                  Keep me signed in on this device
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="login-error">
                  <span className="material-symbols-outlined">error</span>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} className="login-submit-btn">
                {loading ? (
                  <span className="submit-loading">
                    <span className="sg-spinner" style={{ width: 20, height: 20, borderWidth: 2, borderTopColor: '#fff' }}></span>
                    Signing In...
                  </span>
                ) : (
                  <>
                    Sign In to Dashboard
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="form-footer">
              <p>Need assistance? <a href="#" className="admin-link">Contact System Admin</a></p>
            </div>
          </div>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="page-footer">
        <div className="footer-left">© 2024 SEPSISGUARD LIVE MONITORING SYSTEM</div>
        <div className="footer-right">
          <a href="#">SECURITY PROTOCOL</a>
          <a href="#">PRIVACY POLICY</a>
          <a href="#">HIPAA COMPLIANCE</a>
        </div>
      </footer>
    </div>
  );
}
