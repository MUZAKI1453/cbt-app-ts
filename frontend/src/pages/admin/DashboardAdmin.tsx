import React, { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import TeachersManagement from './TeachersManagement';
import SubjectsManagement from './SubjectsManagement'; // <--- Impor Kelola Mapel

export default function DashboardAdmin() {
    const [activeMenu, setActiveMenu] = useState('dashboard');

    return (
        <div className="min-h-screen bg-[#f4f6f9] font-sans pt-24 pb-12">
            <AdminNavbar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

            <main className="container mx-auto px-4 sm:px-6">
                {activeMenu === 'dashboard' && (
                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-2">Dashboard Utama Admin</h2>
                        <p className="text-xs sm:text-sm text-slate-500">Selamat datang kembali di panel administrasi CBT SMPIP Baitussalam.</p>
                    </div>
                )}

                {activeMenu === 'teachers' && <TeachersManagement />}
                {activeMenu === 'subjects' && <SubjectsManagement />} {/* <--- Render Kelola Mapel */}

                {activeMenu === 'students' && (
                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-2">Manajemen Data Siswa</h2>
                        <p className="text-xs sm:text-sm text-slate-500">Fitur pengelolaan data NIS dan akun ujian siswa.</p>
                    </div>
                )}

                {activeMenu === 'exams' && (
                    <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mb-2">Pengaturan Jadwal Ujian</h2>
                        <p className="text-xs sm:text-sm text-slate-500">Pusat kontrol pembuatan ujian dan monitoring jalannya CBT.</p>
                    </div>
                )}
            </main>
        </div>
    );
}