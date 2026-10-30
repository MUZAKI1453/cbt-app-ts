import React, { useState } from 'react';
import LoginPage from './LoginPage'; // <--- Diperbaiki (karena LoginPage.tsx ada di folder src/)
import DashboardStudent from './pages/student/DashboardStudent';
import DashboardTeacher from './pages/teacher/DashboardTeacher';
import DashboardAdmin from './pages/admin/DashboardAdmin';

function App() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));

    const handleLoginSuccess = () => {
        setToken(localStorage.getItem('token'));
        setRole(localStorage.getItem('role'));
    };

    // Jika sudah login, arahkan ke dashboard sesuai role masing-masing
    if (token) {
        if (role === 'ADMIN') return <DashboardAdmin />;
        if (role === 'TEACHER') return <DashboardTeacher />;
        return <DashboardStudent />;
    }

    // Jika belum login, tampilkan halaman Login universal
    return (
        <LoginPage
            onLoginSuccess={handleLoginSuccess}
        />
    );
}

export default App;