import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import ProtectedRoute from './components/ProtectedRoute';
import { navigationService } from './services/navigation';

function NavigationInitializer() {
  const navigate = useNavigate();
  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <NavigationInitializer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/workspace/:workspaceId" element={
          <ProtectedRoute><Workspace /></ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
