import React, { useState, useEffect } from 'react';
import { patientAPI } from '../api/client';

/**
 * Virtual SmartWatch Integration Component
 * Simulates hospital-issued smartwatch data streaming
 * Demonstrates hardware integration capabilities
 */
export default function SmartWatchIntegration({ patientId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [watchData, setWatchData] = useState({
    hr: 72,
    o2: 98,
    temp: 37.0,
    rr: 16,
    battery: 100,
    lastSync: new Date().toLocaleTimeString()
  });
  const [streaming, setStreaming] = useState(false);
  const [connectionHistory, setConnectionHistory] = useState([]);
  const [simMode, setSimMode] = useState('normal'); // 'normal' or 'alert'

  const connectWatch = async () => {
    try {
      setIsConnected(true);
      setConnectionHistory([...connectionHistory, { 
        time: new Date().toLocaleTimeString(), 
        event: '✅ Connected to SmartWatch Hospital-Issue-001' 
      }]);
    } catch (err) {
      console.error('Failed to connect watch:', err);
      setConnectionHistory([...connectionHistory, { 
        time: new Date().toLocaleTimeString(), 
        event: '❌ Connection failed' 
      }]);
    }
  };

  const disconnectWatch = () => {
    setIsConnected(false);
    setStreaming(false);
    setConnectionHistory([...connectionHistory, { 
      time: new Date().toLocaleTimeString(), 
      event: '🔌 Disconnected from SmartWatch' 
    }]);
  };

  const startStreaming = async () => {
    setStreaming(true);
    setConnectionHistory([...connectionHistory, { 
      time: new Date().toLocaleTimeString(), 
      event: '📡 Real-time data streaming started' 
    }]);

    // Simulate real-time data streaming
    const interval = setInterval(() => {
      setWatchData(prev => {
        let newData = { ...prev };
        
        if (simMode === 'alert') {
          // Simulate deteriorating vitals
          newData.hr = Math.min(120, prev.hr + Math.random() * 4);
          newData.temp = Math.min(39.5, prev.temp + Math.random() * 0.3);
          newData.rr = Math.min(30, prev.rr + Math.random() * 2);
          newData.o2 = Math.max(85, prev.o2 - Math.random() * 2);
        } else {
          // Normal variation
          newData.hr = 72 + (Math.random() - 0.5) * 8;
          newData.o2 = 98 - Math.random() * 2;
          newData.temp = 37.0 + (Math.random() - 0.5) * 0.5;
          newData.rr = 16 + (Math.random() - 0.5) * 3;
        }
        
        newData.battery = Math.max(0, prev.battery - 0.1);
        newData.lastSync = new Date().toLocaleTimeString();
        return newData;
      });
    }, 1500);

    return () => clearInterval(interval);
  };

  const stopStreaming = () => {
    setStreaming(false);
    setConnectionHistory([...connectionHistory, { 
      time: new Date().toLocaleTimeString(), 
      event: '⏸️ Data streaming paused' 
    }]);
  };

  const syncData = async () => {
    try {
      await patientAPI.recordVitals(patientId, {
        hr: watchData.hr,
        o2: watchData.o2,
        temp: watchData.temp,
        rr: watchData.rr,
        source: 'hospital_smartwatch',
        device_id: 'WATCH-001'
      });
      setConnectionHistory([...connectionHistory, { 
        time: new Date().toLocaleTimeString(), 
        event: '☁️ Data synced to cloud' 
      }]);
    } catch (err) {
      console.error('Sync failed:', err);
    }
  };

  const triggerAlertMode = () => {
    setSimMode(simMode === 'alert' ? 'normal' : 'alert');
    setConnectionHistory([...connectionHistory, { 
      time: new Date().toLocaleTimeString(), 
      event: simMode === 'alert' ? '🟢 Switched to normal mode' : '🔴 Switched to alert simulation' 
    }]);
  };

  return (
    <div className="smartwatch-container">
      <style>{`
        .smartwatch-container {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 28px;
          margin: 24px 0;
          color: white;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.4);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .smartwatch-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .smartwatch-title {
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .watch-icon {
          font-size: 28px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }

        .connection-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: blink 1s infinite;
        }

        .status-dot.connected {
          background: #4ade80;
          box-shadow: 0 0 10px #4ade80;
        }

        .status-dot.disconnected {
          background: #f87171;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .watch-display {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .vitals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 16px;
          margin-bottom: 16px;
        }

        .vital-display {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }

        .vital-display:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .vital-icon {
          font-size: 24px;
          margin-bottom: 8px;
        }

        .vital-value {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .vital-unit {
          font-size: 12px;
          opacity: 0.8;
        }

        .battery-bar {
          background: rgba(0, 0, 0, 0.2);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 8px;
        }

        .battery-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ade80, #22c55e);
          border-radius: 4px;
          transition: width 0.3s ease;
        }

        .device-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 12px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .controls {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .btn {
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: rgba(255, 255, 255, 0.95);
          color: #667eea;
        }

        .btn-primary:hover:not(:disabled) {
          background: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .connection-log {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          padding: 16px;
          max-height: 200px;
          overflow-y: auto;
          font-size: 12px;
          line-height: 1.6;
        }

        .log-entry {
          padding: 4px 0;
          opacity: 0.9;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .log-entry:last-child {
          opacity: 1;
        }

        .streaming-indicator {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(34, 197, 94, 0.2);
          border-radius: 8px;
          font-size: 12px;
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.5);
          animation: pulse 1.5s infinite;
        }

        .streaming-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          animation: pulse-dot 1.5s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @media (max-width: 768px) {
          .smartwatch-container {
            padding: 16px;
            margin: 16px 0;
          }

          .vitals-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .controls {
            grid-template-columns: 1fr;
          }

          .smartwatch-title {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="smartwatch-header">
        <div className="smartwatch-title">
          <span className="watch-icon">⌚</span>
          Hospital SmartWatch
        </div>
        <div className="connection-badge">
          <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {isConnected && (
        <div className="watch-display">
          <div className="vitals-grid">
            <div className="vital-display">
              <div className="vital-icon">❤️</div>
              <div className="vital-value">{watchData.hr.toFixed(0)}</div>
              <div className="vital-unit">HR (bpm)</div>
            </div>
            <div className="vital-display">
              <div className="vital-icon">💨</div>
              <div className="vital-value">{watchData.o2.toFixed(1)}</div>
              <div className="vital-unit">O₂ (%)</div>
            </div>
            <div className="vital-display">
              <div className="vital-icon">🌡️</div>
              <div className="vital-value">{watchData.temp.toFixed(1)}</div>
              <div className="vital-unit">Temp (°C)</div>
            </div>
            <div className="vital-display">
              <div className="vital-icon">💨</div>
              <div className="vital-value">{watchData.rr.toFixed(0)}</div>
              <div className="vital-unit">RR (bpm)</div>
            </div>
          </div>

          <div className="device-info">
            <div>🔋 Battery: {watchData.battery.toFixed(0)}%</div>
            <div>📡 Last Sync: {watchData.lastSync}</div>
          </div>

          <div className="battery-bar">
            <div className="battery-fill" style={{ width: `${watchData.battery}%` }}></div>
          </div>

          {streaming && (
            <div style={{ marginTop: '12px' }}>
              <div className="streaming-indicator">
                <div className="streaming-dot"></div>
                Real-time Streaming
              </div>
            </div>
          )}
        </div>
      )}

      <div className="controls">
        {!isConnected ? (
          <button className="btn btn-primary" onClick={connectWatch}>
            🔗 Connect Watch
          </button>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={disconnectWatch}>
              🔌 Disconnect
            </button>
            {!streaming ? (
              <button className="btn btn-primary" onClick={startStreaming}>
                📡 Start Streaming
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={stopStreaming}>
                ⏸️ Stop Streaming
              </button>
            )}
            <button className="btn btn-primary" onClick={syncData} disabled={!isConnected}>
              ☁️ Sync Data
            </button>
            <button className="btn btn-secondary" onClick={triggerAlertMode}>
              {simMode === 'alert' ? '🟢 Normal' : '🔴 Simulate Alert'}
            </button>
          </>
        )}
      </div>

      <div>
        <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Connection Log
        </div>
        <div className="connection-log">
          {connectionHistory.map((entry, idx) => (
            <div key={idx} className="log-entry">
              {entry.time} • {entry.event}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
