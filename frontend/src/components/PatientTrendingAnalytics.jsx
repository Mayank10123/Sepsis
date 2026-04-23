import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './PatientTrendingAnalytics.css';

export default function PatientTrendingAnalytics() {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('heart-rate');

  const metrics = {
    'heart-rate': {
      name: 'Heart Rate (bpm)',
      current: 88,
      avg: 82,
      trend: 'up',
      trendValue: '+6',
      unit: 'bpm',
      status: 'Elevated'
    },
    'temperature': {
      name: 'Temperature (°C)',
      current: 37.8,
      avg: 37.2,
      trend: 'up',
      trendValue: '+0.6',
      unit: '°C',
      status: 'Elevated'
    },
    'oxygen': {
      name: 'Oxygen Saturation (%)',
      current: 95,
      avg: 97,
      trend: 'down',
      trendValue: '-2',
      unit: '%',
      status: 'Concern'
    },
    'lactate': {
      name: 'Lactate (mmol/L)',
      current: 2.1,
      avg: 1.5,
      trend: 'up',
      trendValue: '+0.6',
      unit: 'mmol/L',
      status: 'Elevated'
    }
  };

  const activeMetric = metrics[selectedMetric];

  const trendData = [
    { time: '12d ago', value: 78 },
    { time: '10d ago', value: 80 },
    { time: '8d ago', value: 79 },
    { time: '6d ago', value: 85 },
    { time: '4d ago', value: 84 },
    { time: '2d ago', value: 86 },
    { time: 'Now', value: 88 }
  ];

  return (
    <div className="trending-wrapper">
      {/* Navigation Sidebar */}
      <aside className="trending-nav-sidebar">
        <div className="trending-nav-logo">🛡️ SepsisGuard Live</div>
        
        <div className="trending-nav-profile">
          <div className="trending-nav-avatar">👨‍⚕️</div>
          <div className="trending-nav-info">
            <p className="trending-nav-name">Dr. Clinical Sentinel</p>
            <p className="trending-nav-dept">ICU Department</p>
          </div>
        </div>

        <nav className="trending-nav">
          <Link to="/doctor" className="trending-nav-item">📊 Overview</Link>
          <Link to="/doctor" className="trending-nav-item">👥 My Patients</Link>
          <Link to="/analytics" className="trending-nav-item">📈 Reports</Link>
          <Link to="/alerts" className="trending-nav-item">⚠️ Alerts</Link>
          <Link to="/resources" className="trending-nav-item">📚 Resources</Link>
        </nav>
        
        <button className="trending-nav-protocol">⚕️ Sepsis Protocol</button>

        <div className="trending-nav-footer">
          <Link to="/settings" className="trending-nav-footer-link">⚙️ Settings</Link>
          <Link to="/support" className="trending-nav-footer-link">❓ Support</Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="trending-main-wrapper">
      {/* Header */}
      <header className="trending-header">
        <h1>Patient Trending Analytics</h1>
        <div className="trending-header-controls">
          <select 
            className="trending-time-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="24hours">Last 24 Hours</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
          <button className="trending-export-btn" onClick={() => alert('Exporting trending data...')}>
            📊 Export
          </button>
        </div>
      </header>

      <div className="trending-content">
        {/* Left: Metric Selector */}
        <div className="trending-sidebar">
          <h3>Select Metric</h3>
          <div className="metric-selector">
            {Object.entries(metrics).map(([key, metric]) => (
              <button
                key={key}
                className={`metric-button ${selectedMetric === key ? 'active' : ''}`}
                onClick={() => setSelectedMetric(key)}
              >
                <span className="metric-name">{metric.name}</span>
                <span className="metric-current">{metric.current}{metric.unit}</span>
              </button>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="trending-summary">
            <h3>Summary Statistics</h3>
            <div className="stat-row">
              <span>Highest Reading:</span>
              <strong>92 bpm</strong>
            </div>
            <div className="stat-row">
              <span>Lowest Reading:</span>
              <strong>75 bpm</strong>
            </div>
            <div className="stat-row">
              <span>Readings Taken:</span>
              <strong>28</strong>
            </div>
            <div className="stat-row">
              <span>Anomalies Detected:</span>
              <strong>2</strong>
            </div>
          </div>
        </div>

        {/* Right: Chart & Details */}
        <div className="trending-main">
          {/* Metric Card */}
          <div className="trending-metric-card">
            <div className="metric-header">
              <h2>{activeMetric.name}</h2>
              <span className={`metric-status ${activeMetric.status.toLowerCase().replace(' ', '-')}`}>
                {activeMetric.status}
              </span>
            </div>

            <div className="metric-values">
              <div className="value-display">
                <p className="value-label">Current Value</p>
                <p className="value-large">{activeMetric.current}</p>
                <p className="value-unit">{activeMetric.unit}</p>
              </div>

              <div className="value-display">
                <p className="value-label">Average ({timeRange})</p>
                <p className="value-large">{activeMetric.avg}</p>
                <p className="value-unit">{activeMetric.unit}</p>
              </div>

              <div className="value-display">
                <p className="value-label">Trend</p>
                <p className={`value-trend ${activeMetric.trend}`}>
                  {activeMetric.trend === 'up' ? '↑' : '↓'} {activeMetric.trendValue}
                </p>
                <p className="value-unit">{activeMetric.trend === 'up' ? 'Increasing' : 'Decreasing'}</p>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="trending-chart-container">
            <h3>Trend Over Time</h3>
            <div className="trending-chart">
              {trendData.map((data, idx) => (
                <div key={idx} className="chart-column">
                  <div 
                    className="chart-bar"
                    style={{height: `${(data.value / 100) * 180}px`}}
                    title={`${data.time}: ${data.value}${activeMetric.unit}`}
                  ></div>
                  <span className="chart-label">{data.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="trending-recommendations">
            <h3>Clinical Recommendations</h3>
            <div className="recommendations-list">
              <div className="recommendation-item green">
                <span className="rec-icon">✓</span>
                <div>
                  <p className="rec-title">Monitoring Frequency</p>
                  <p className="rec-text">Current trend indicates continuous monitoring remains appropriate</p>
                </div>
              </div>
              <div className="recommendation-item warning">
                <span className="rec-icon">!</span>
                <div>
                  <p className="rec-title">Alert Threshold</p>
                  <p className="rec-text">Consider adjusting alert thresholds based on 7-day average</p>
                </div>
              </div>
              <div className="recommendation-item info">
                <span className="rec-icon">i</span>
                <div>
                  <p className="rec-title">Data Quality</p>
                  <p className="rec-text">98% data completeness - High quality trending data available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="trending-actions">
            <button className="action-btn primary" onClick={() => alert('Opening detailed analysis...')}>
              📈 Detailed Analysis
            </button>
            <button className="action-btn secondary" onClick={() => alert('Generating PDF report...')}>
              📄 Generate Report
            </button>
            <button className="action-btn secondary" onClick={() => alert('Comparing with other patients...')}>
              🔍 Compare with Peers
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
