import React, { useState } from 'react';

interface AdminNavbarProps {
    activeMenu: string;
    setActiveMenu: (menu: string) => void;
}

export default function AdminNavbar({ activeMenu, setActiveMenu }: AdminNavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload();
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 text-white font-sans shadow-md"
            style={{ backgroundColor: '#0565f5' }}
        >
            <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between h-20">

                {/* Brand / Logo Sekolah */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMenu('dashboard')}>
                    <img
                        src="/assets/Logo_smpip.png"
                        alt="Logo SMPIP"
                        className="w-10 h-10 object-contain drop-shadow-sm"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <span className="font-extrabold text-base sm:text-lg tracking-wide drop-shadow-xs">
                        SMPIP BAITUSSALAM
                    </span>
                </div>

                {/* Tombol Toggler Mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="lg:hidden p-2 rounded-xl bg-white/10 text-white focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>

                {/* Menu Navigasi */}
                <div className={`lg:flex items-center justify-between flex-1 pl-8 ${
                    isMobileMenuOpen
                        ? 'absolute top-20 left-0 right-0 bg-[#0452cb] shadow-xl p-5 flex flex-col gap-4 border-t border-white/10 rounded-b-3xl'
                        : 'hidden'
                }`}>

                    <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-1 lg:gap-2">
                        <li>
                            <button
                                onClick={() => { setActiveMenu('dashboard'); setIsMobileMenuOpen(false); }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    activeMenu === 'dashboard' ? 'bg-white/25 text-white shadow-inner' : 'text-white/90 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                Dashboard Utama
                            </button>
                        </li>

                        {/* Dropdown Data Master */}
                        <li className="relative">
                            <button
                                onClick={() => setIsMasterDropdownOpen(!isMasterDropdownOpen)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                                Data Master <span className="text-xs">▾</span>
                            </button>

                            {isMasterDropdownOpen && (
                                <ul className="absolute left-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-xl py-2 z-50 border border-slate-100">
                                    <li>
                                        <button
                                            onClick={() => { setActiveMenu('teachers'); setIsMasterDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
                                        >
                                            Kelola Guru
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { setActiveMenu('subjects'); setIsMasterDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
                                        >
                                            Kelola Mapel
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => { setActiveMenu('students'); setIsMasterDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-slate-100 text-slate-700 cursor-pointer"
                                        >
                                            Data Siswa
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>

                        <li>
                            <button
                                onClick={() => { setActiveMenu('exams'); setIsMobileMenuOpen(false); }}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                    activeMenu === 'exams' ? 'bg-white/25 text-white shadow-inner' : 'text-white/90 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                Pengaturan Ujian
                            </button>
                        </li>
                    </ul>

                    {/* Tombol Logout */}
                    <div className="mt-4 lg:mt-0">
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-900/20 transition-all duration-200 cursor-pointer active:scale-95"
                        >
                            Logout
                        </button>
                    </div>

                </div>

            </div>
        </nav>
    );
}