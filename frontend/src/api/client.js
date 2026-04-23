import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  patientLogin: (patient_id, password) =>
    apiClient.post('/api/auth/patient/login', { patient_id, password }),
};

// Patient API
export const patientAPI = {
  getVitals: (patient_id) => apiClient.get(`/api/patient/${patient_id}/vitals`),
  getTrends: (patient_id) => apiClient.get(`/api/patient/${patient_id}/trends`),
  recordVitals: (patient_id, vitals) =>
    apiClient.post(`/api/patient/${patient_id}/vitals`, vitals),
  getStatus: (patient_id) => apiClient.get(`/api/patient/${patient_id}/status`),
};

// Prediction API
export const predictionAPI = {
  predictDeterioration: (patient_id) =>
    apiClient.post(`/api/patient/${patient_id}/predict-deterioration`),
};

// Doctor API
export const doctorAPI = {
  getPatients: () => apiClient.get('/api/doctor/patients'),
  getPatientDetails: (patient_id) => apiClient.get(`/api/doctor/patient/${patient_id}`),
};

// Alerts API
export const alertsAPI = {
  getAlerts: () => apiClient.get('/api/alerts'),
  acknowledgeAlert: (alert_id) => apiClient.post(`/api/alerts/${alert_id}/acknowledge`),
};

// AI API - Groq Integration
export const aiAPI = {
  // Get AI insights for context
  getAIInsights: (data) =>
    apiClient.post('/api/ai/insights', data),

  // Get detailed analysis for an insight
  getDetailedAnalysis: (data) =>
    apiClient.post('/api/ai/analysis', data),

  // Get voice-based suggestions
  getVoiceSuggestion: (data) =>
    apiClient.post('/api/ai/voice-suggestion', data),

  // Get recovery suggestions
  getRecoverySuggestions: (patientId) =>
    apiClient.get(`/api/ai/recovery-suggestions/${patientId}`),

  // Get family care tips
  getFamilyTips: (patientId) =>
    apiClient.get(`/api/ai/family-tips/${patientId}`),

  // Get medication suggestions
  getMedicationSuggestions: (patientId, vitals) =>
    apiClient.post(`/api/ai/medication-suggestions/${patientId}`, { vitals }),

  // Get predictive alerts
  getPredictiveAlerts: (patientId) =>
    apiClient.get(`/api/ai/predictive-alerts/${patientId}`),

  // Generate clinical report
  generateReport: (patientId, data) =>
    apiClient.post(`/api/ai/report/${patientId}`, data),

  // Get real-time chat response
  getChatResponse: (message, context) =>
    apiClient.post('/api/ai/chat', { message, context }),
};

// Messaging API
export const messagingAPI = {
  sendMessage: (recipientId, message) =>
    apiClient.post('/api/messaging/send', { recipientId, message }),

  getMessages: (conversationId) =>
    apiClient.get(`/api/messaging/conversation/${conversationId}`),

  getConversations: () =>
    apiClient.get('/api/messaging/conversations'),
};

// Family API
export const familyAPI = {
  getPatientStatus: (patientId) =>
    apiClient.get(`/api/family/patient/${patientId}/status`),

  getUpdates: (patientId) =>
    apiClient.get(`/api/family/patient/${patientId}/updates`),

  getNotifications: () =>
    apiClient.get('/api/family/notifications'),

  acknowledgeUpdate: (updateId) =>
    apiClient.post(`/api/family/updates/${updateId}/acknowledge`),
};

// Medication API
export const medicationAPI = {
  getMedications: (patientId) =>
    apiClient.get(`/api/patient/${patientId}/medications`),

  addMedication: (patientId, medication) =>
    apiClient.post(`/api/patient/${patientId}/medications`, medication),

  trackDose: (medicationId, dose) =>
    apiClient.post(`/api/medications/${medicationId}/dose`, { dose }),
};

export default apiClient;
