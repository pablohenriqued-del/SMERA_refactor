import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import LicenseIn from './pages/LicenseIn';
import LicenseOut from './pages/LicenseOut';
import LicenseOutApproval from './pages/LicenseOutApproval';
import Cadastros from './pages/Cadastros';
import RLM from './pages/RLM';
import RLMDetail from './pages/RLMDetail';
import Acesso from './pages/Acesso';
import SonySony from './pages/SonySony';
import './App.css';

const FullScreenLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center" data-testid="auth-loading">
    <Loader2 className="h-8 w-8 text-sony-red animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === undefined) return <FullScreenLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="license-in" element={<LicenseIn />} />
            <Route path="license-out" element={<LicenseOut />} />
            <Route path="license-out/:id/approval" element={<LicenseOutApproval />} />
            <Route path="cadastros" element={<Cadastros />} />
            <Route path="rlm" element={<RLM />} />
            <Route path="rlm/:id" element={<RLMDetail />} />
            <Route path="acesso" element={<Acesso />} />
            <Route path="sony-sony" element={<SonySony />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors theme="dark" />
    </AuthProvider>
  );
}

export default App;
