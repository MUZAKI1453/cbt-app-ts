import React, { useState } from 'react';
import axios from 'axios';

interface LoginPageProps {
    onLoginSuccess?: () => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('Memproses akses...');
        setIsSuccess(false);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            const { token, user } = response.data;
            setIsSuccess(true);
            setMessage(`Login Berhasil! Selamat datang, ${user.name} (${user.role})`);

            localStorage.setItem('token', token);
            localStorage.setItem('role', user.role);

            setTimeout(() => {
                if (onLoginSuccess) {
                    onLoginSuccess();
                } else {
                    window.location.reload();
                }
            }, 800);

        } catch (err: any) {
            setIsSuccess(false);
            setMessage(err.response?.data?.error || 'Gagal masuk. Periksa kembali username dan password Anda.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#eef4ff] p-4 sm:p-6 font-sans relative overflow-hidden">

            {/* Aksen Dekoratif Background */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Kartu Login Terpusat */}
            <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-blue-900/10 border border-white/80 p-8 sm:p-10 relative z-10">

                {/* Logo dan Header */}
                <div className="text-center flex flex-col items-center mb-8">
                    <img
                        src="/assets/Logo_smpip.png"
                        alt="Logo Sekolah"
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain mb-4 drop-shadow-md"
                    />
                    <h1
                        style={{ color: '#0565f5' }}
                        className="text-xl sm:text-2xl font-extrabold tracking-tight drop-shadow-sm"
                    >
                        SMPIP BAITUSSALAM
                    </h1>
                </div>

                {/* Form Isian */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username / NIS / NIP</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading || isSuccess}
                            className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#0565f5] focus:ring-4 focus:ring-[#0565f5]/10 outline-none transition-all shadow-inner"
                            placeholder="Masukkan username Anda..."
                        />
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Kata Sandi</label>
                        <div className="relative flex items-center">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading || isSuccess}
                                className="w-full rounded-2xl bg-slate-50/80 border border-slate-200 px-4 py-3.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#0565f5] focus:ring-4 focus:ring-[#0565f5]/10 outline-none transition-all shadow-inner"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                            >
                                {showPassword ? 'Sembunyikan' : 'Lihat'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || isSuccess}
                        style={{ backgroundColor: '#0565f5' }}
                        className="w-full mt-2 rounded-2xl py-4 font-bold text-sm text-white hover:opacity-95 transition-all duration-200 disabled:opacity-70 cursor-pointer shadow-lg shadow-blue-500/30 active:scale-[0.99]"
                    >
                        {isLoading ? 'Memproses Akses...' : 'MASUK SEKARANG'}
                    </button>
                </form>

                {/* Informasi Bantuan */}
                <div className="mt-6 text-center text-xs text-slate-400">
                    Kendala akun atau lupa password? <br />
                    Silakan hubungi Administrator / Operator sekolah.
                </div>

                {/* Notifikasi Pesan */}
                {message && (
                    <div className={`mt-4 rounded-2xl p-3.5 text-xs font-medium ${isSuccess ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                        {message}
                    </div>
                )}

                {/* Footer Copyright */}
                <div className="mt-6 text-center text-[11px] text-slate-400 border-t border-slate-100 pt-4">
                    &copy; {new Date().getFullYear()} SMP Islam Plus Baitussalam
                </div>

            </div>
        </div>
    );
}