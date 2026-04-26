import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import GroqChat from './components/GroqChat';
import './global.css';

// Lazy load components for performance
const LoginPage = lazy(() => import('./components/LoginPage'));
const DoctorDashboard = lazy(() => import('./components/DoctorDashboard'));
const PatientDashboard = lazy(() => import('./components/PatientDashboard'));
const FamilyDashboard = lazy(() => import('./components/FamilyDashboard'));
const DoctorViewPatient42Detail = lazy(() => import('./components/DoctorViewPatient42Detail'));
const ClinicalReportsAnalytics = lazy(() => import('./components/ClinicalReportsAnalytics'));
const SettingsDoctorProfile = lazy(() => import('./components/SettingsDoctorProfile'));
const SupportHelpDesk = lazy(() => import('./components/SupportHelpDesk'));

// Components are lazy-loaded below

// Private Route logic (simplified)
const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/doctor" element={
              <PrivateRoute role="doctor">
                <DoctorDashboard />
              </PrivateRoute>
            } />
            
            <Route path="/patient" element={
              <PrivateRoute role="patient">
                <PatientDashboard />
              </PrivateRoute>
            } />

            <Route path="/patient/:id" element={
              <PrivateRoute role="doctor">
                <DoctorViewPatient42Detail />
              </PrivateRoute>
            } />
            
            <Route path="/family" element={
              <PrivateRoute role="family">
                <FamilyDashboard />
              </PrivateRoute>
            } />

            <Route path="/analytics" element={
              <PrivateRoute role="doctor">
                <ClinicalReportsAnalytics />
              </PrivateRoute>
            } />

            <Route path="/settings" element={
              <PrivateRoute role="doctor">
                <SettingsDoctorProfile />
              </PrivateRoute>
            } />

            <Route path="/support" element={
              <PrivateRoute role="doctor">
                <SupportHelpDesk />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Suspense>
        
        {/* Global AI Chat - Available across all authenticated views */}
        <GroqChat />
      </div>
    </Router>
  );
}

export default App;
