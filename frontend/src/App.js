import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LicenseIn from './pages/LicenseIn';
import LicenseOut from './pages/LicenseOut';
import Cadastros from './pages/Cadastros';
import RLM from './pages/RLM';
import RLMDetail from './pages/RLMDetail';
import Acesso from './pages/Acesso';
import SonySony from './pages/SonySony';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="license-in" element={<LicenseIn />} />
          <Route path="license-out" element={<LicenseOut />} />
          <Route path="cadastros" element={<Cadastros />} />
          <Route path="rlm" element={<RLM />} />
          <Route path="rlm/:id" element={<RLMDetail />} />
          <Route path="acesso" element={<Acesso />} />
          <Route path="sony-sony" element={<SonySony />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;