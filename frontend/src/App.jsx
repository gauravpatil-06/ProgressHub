import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

import Landing from './pages/Landing/Landing';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/user/Dashboard/Dashboard';
import Progress from './pages/user/Progress/Progress';
import Leaderboard from './pages/user/Leaderboard/Leaderboard';
import Profile from './pages/user/Profile/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLectures from './pages/admin/AdminLectures';
import Layout from './components/layout/Layout';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Layout isAdmin={true} />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="lectures" element={<AdminLectures />} />
          </Route>

          {/* User Protected Routes inside Layout */}
          <Route path="/" element={
            <ProtectedRoute requireAdmin={false}>
              <Layout isAdmin={false} />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
