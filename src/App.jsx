import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AssistanceBookingPage } from './pages/AssistanceBookingPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApplicationDetailPage } from './pages/ApplicationDetailPage';
import { AdmitCardsPage } from './pages/AdmitCardsPage';
import { ResultsPage } from './pages/ResultsPage';
import { ProfilePage } from './pages/ProfilePage';
import { MembershipPage } from './pages/MembershipPage';
import { ProDashboardPage } from './pages/ProDashboardPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { TermsPage } from './pages/TermsPage';
import { RefundPolicyPage } from './pages/RefundPolicyPage';
import { ZeroCredentialPolicyPage } from './pages/ZeroCredentialPolicyPage';
import { HowAssistanceWorksPage } from './pages/HowAssistanceWorksPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AgentDashboardPage } from './pages/agent/AgentDashboardPage';

import { ToastProvider } from './context/ToastContext';

export const App = () => {
  return (
    <ToastProvider>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/admit-cards" element={<AdmitCardsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/zero-credential-policy" element={<ZeroCredentialPolicyPage />} />
          <Route path="/how-assistance-works" element={<HowAssistanceWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Candidate Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pro"
            element={
              <ProtectedRoute>
                <ProDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assistance/book"
            element={
              <ProtectedRoute>
                <AssistanceBookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications/:id"
            element={
              <ProtectedRoute>
                <ApplicationDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Desk Agent Routes */}
          <Route
            path="/agent"
            element={
              <ProtectedRoute requireAgent={true}>
                <AgentDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
        <Footer />
      </div>
    </ToastProvider>
  );
};

export default App;
