import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageOfferings from './pages/admin/ManageOfferings';
import ManageQuestions from './pages/admin/ManageQuestions';
import ReviewApplications from './pages/admin/ReviewApplications';
import Clients from './pages/admin/Clients';

// User Pages
import NewApplicationForm from './pages/user/NewApplicationForm';
import SuccessPage from './pages/user/SuccessPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root to user home */}
          <Route path="/" element={<Navigate to="/user" replace />} />

          {/* User Routes */}
          <Route path="/user" element={<NewApplicationForm />} />
          <Route path="/user/success" element={<SuccessPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/offerings" element={<ManageOfferings />} />
          <Route path="/admin/offerings/:offeringId/questions" element={<ManageQuestions />} />
          <Route path="/admin/applications" element={<ReviewApplications />} />
          <Route path="/admin/clients" element={<Clients />} />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/user" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
