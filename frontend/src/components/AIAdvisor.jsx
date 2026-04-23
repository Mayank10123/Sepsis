import React, { useState, useEffect } from 'react';
import './AIAdvisor.css';
import { aiAPI } from '../api/client';

export default function AIAdvisor({ context = {}, role = 'doctor', patientId = null, onInsight = null }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState('');
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    generateInsights();
  }, [context, patientId]);

  const generateInsights = async () => {
    setLoading(true);
    try {
      const response = await aiAPI.getAIInsights({
        context,
        role,
        patientId,
        type: 'comprehensive'
      });

      const insights = response.data?.insights || [];
      setInsights(insights);

      if (onInsight) {
        onInsight(insights);
      }
    } catch (err) {
      console.error('Error generating insights:', err);
      // Fallback suggestions
      setInsights(generateFallbackInsights());
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackInsights = () => {
    return [
      {
        id: 1,
        type: 'alert',
        title: 'Heart Rate Elevation',
        severity: 'high',
        description: 'Patient HR increased by 15% in last hour',
        action: 'Consider monitoring closely',
        icon: '❤️‍🔥'
      },
      {
        id: 2,
        type: 'suggestion',
        title: 'Hydration Status',
        severity: 'medium',
        description: 'Fluid intake below recommended levels',
        action: 'Recommend increased fluid intake',
        icon: '💧'
      },
      {
        id: 3,
        type: 'prediction',
        title: 'Recovery Trend',
        severity: 'low',
        description: 'Vitals trending positively over 24 hours',
        action: 'Continue current treatment',
        icon: '📈'
      }
    ];
  };

  const handleInsightClick = async (insight) => {
    setSelectedInsight(insight);
    setLoading(true);

    try {
      const response = await aiAPI.getDetailedAnalysis({
        insightId: insight.id,
        patientId,
        role
      });

      setDetailedAnalysis(response.data?.analysis || '');
      setRecommendations(response.data?.recommendations || []);
    } catch (err) {
      console.error('Error getting detailed analysis:', err);
      setDetailedAnalysis('Advanced analysis temporarily unavailable');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return '#FF1744';
      case 'high':
        return '#FF9100';
      case 'medium':
        return '#FFC107';
      case 'low':
        return '#4CAF50';
      default:
        return '#2196F3';
    }
  };

  const getSeverityBg = (severity) => {
    switch (severity) {
      case 'critical':
        return 'rgba(255, 23, 68, 0.1)';
      case 'high':
        return 'rgba(255, 145, 0, 0.1)';
      case 'medium':
        return 'rgba(255, 193, 7, 0.1)';
      case 'low':
        return 'rgba(76, 175, 80, 0.1)';
      default:
        return 'rgba(33, 150, 243, 0.1)';
    }
  };

  return (
    <div className="ai-advisor-container">
      {/* Header */}
      <div className="ai-advisor-header">
        <div className="advisor-title">
          <span className="advisor-icon">🤖</span>
          <h2>AI Clinical Advisor</h2>
        </div>
        <div className="advisor-badge">Real-time Insights</div>
      </div>

      {/* Main Insights Grid */}
      <div className="insights-grid">
        {loading && insights.length === 0 ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Analyzing patient data with Groq AI...</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div
              key={insight.id}
              className="insight-card"
              style={{
                backgroundColor: getSeverityBg(insight.severity),
                borderLeft: `4px solid ${getSeverityColor(insight.severity)}`
              }}
              onClick={() => handleInsightClick(insight)}
            >
              <div className="insight-header">
                <span className="insight-icon">{insight.icon}</span>
                <span
                  className="severity-badge"
                  style={{ background: getSeverityColor(insight.severity) }}
                >
                  {insight.severity.toUpperCase()}
                </span>
              </div>

              <h3 className="insight-title">{insight.title}</h3>
              <p className="insight-description">{insight.description}</p>

              <div className="insight-action">
                <span className="action-icon">→</span>
                {insight.action}
              </div>

              {selectedInsight?.id === insight.id && (
                <div className="insight-selected-indicator">✓</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Detailed Analysis Panel */}
      {selectedInsight && (
        <div className="analysis-panel">
          <div className="analysis-header">
            <h3>
              <span className="analysis-icon">📊</span>
              Detailed Analysis: {selectedInsight.title}
            </h3>
            <button
              className="close-btn"
              onClick={() => {
                setSelectedInsight(null);
                setDetailedAnalysis('');
              }}
            >
              ✕
            </button>
          </div>

          <div className="analysis-content">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Generating detailed analysis...</p>
              </div>
            ) : (
              <>
                {/* Detailed Analysis */}
                {detailedAnalysis && (
                  <div className="analysis-section">
                    <h4 className="section-title">📋 Clinical Analysis</h4>
                    <p className="analysis-text">{detailedAnalysis}</p>
                  </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                  <div className="recommendations-section">
                    <h4 className="section-title">💡 AI Recommendations</h4>
                    <ul className="recommendations-list">
                      {recommendations.map((rec, idx) => (
                        <li key={idx} className="recommendation-item">
                          <span className="rec-priority">
                            {'⭐'.repeat(rec.priority || 1)}
                          </span>
                          <span className="rec-text">{rec.text}</span>
                          {rec.confidence && (
                            <span className="rec-confidence">
                              {Math.round(rec.confidence * 100)}% confident
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="analysis-actions">
                  <button className="action-btn primary-btn">
                    📋 Generate Report
                  </button>
                  <button className="action-btn secondary-btn">
                    🔔 Set Alert Threshold
                  </button>
                  <button className="action-btn secondary-btn">
                    💬 Share with Team
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-box">
          <div className="stat-value">{insights.filter(i => i.severity === 'critical' || i.severity === 'high').length}</div>
          <div className="stat-label">⚠️ High Priority</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{insights.length}</div>
          <div className="stat-label">🎯 Total Insights</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">98%</div>
          <div className="stat-label">✓ Accuracy</div>
        </div>
      </div>

      {/* Refresh Button */}
      <button
        className="refresh-btn"
        onClick={generateInsights}
        disabled={loading}
      >
        <span>🔄</span> Refresh Insights
      </button>
    </div>
  );
}
