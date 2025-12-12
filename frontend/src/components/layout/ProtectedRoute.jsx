import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const isAdmin = user.role === 'admin';

    // If page requires admin but user is NOT admin -> send to dashboard
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    // If page is for students but user IS admin
    // We only redirect admins away from strictly student-only pages (dashboard, profile, progress)
    // Shared pages like Leaderboard are allowed
    const isStudentOnlyPage = !requireAdmin && !window.location.pathname.includes('/leaderboard');

    if (isStudentOnlyPage && isAdmin) {
        return <Navigate to="/admin" replace />;
    }

    return children;
}
