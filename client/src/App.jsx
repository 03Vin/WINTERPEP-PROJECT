import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Timetable from './pages/Timetable';
import Curriculum from './pages/Curriculum';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Attendance from './pages/Attendance';
import Resources from './pages/Resources';
import { useAuth } from './context/AuthContext';

const DashboardRedirect = () => {
    const { user } = useAuth();
    if (user?.role === 'admin') return <AdminDashboard />;
    if (user?.role === 'teacher') return <TeacherDashboard />;
    return <StudentDashboard />;
};

function App() {
    const { user, loading } = useAuth();

    if (loading) return null;

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />

            <Route path="/dashboard" element={user ? <Layout><DashboardRedirect /></Layout> : <Navigate to="/login" />} />
            <Route path="/timetable" element={user ? <Layout><Timetable /></Layout> : <Navigate to="/login" />} />
            <Route path="/curriculum" element={user ? <Layout><Curriculum /></Layout> : <Navigate to="/login" />} />
            <Route path="/resources" element={user ? <Layout><Resources /></Layout> : <Navigate to="/login" />} />
            <Route path="/attendance" element={user && (user.role === 'teacher' || user.role === 'admin') ? <Layout><Attendance /></Layout> : <Navigate to="/dashboard" />} />
            <Route path="/profile" element={user ? <Layout><Profile /></Layout> : <Navigate to="/login" />} />

            <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
    );
}

export default App;
