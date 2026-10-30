import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Exam {
    id: string;
    title: string;
    description: string;
    duration: number;
}

export default function DashboardStudent() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/exams', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExams(response.data);
            } catch (err: any) {
                setError('Gagal memuat daftar ujian.');
            } finally {
                setLoading(false);
            }
        };

        fetchExams();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload();
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: '#1f2937', margin: 0 }}>Dashboard Siswa</h1>
                    <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Selamat datang! Siapkan diri Anda untuk mengikuti ujian.</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Keluar (Logout)
                </button>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <h3 style={{ borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', color: '#374151', marginTop: 0 }}>Daftar Ujian Tersedia</h3>

                {loading && <p style={{ color: '#6b7280' }}>Memuat data ujian...</p>}
                {error && <p style={{ color: '#dc2626' }}>{error}</p>}

                {!loading && exams.length === 0 && (
                    <p style={{ color: '#6b7280', marginTop: '15px' }}>Belum ada ujian aktif saat ini.</p>
                )}

                <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
                    {exams.map((exam) => (
                        <li key={exam.id} style={{ border: '1px solid #e5e7eb', padding: '16px', borderRadius: '8px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ margin: '0 0 6px 0', color: '#111827', fontSize: '16px' }}>{exam.title}</h4>
                                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>{exam.description} • Durasi: <strong>{exam.duration} Menit</strong></p>
                            </div>
                            <button
                                style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                onClick={() => alert(`Memulai ujian: ${exam.title}`)}
                            >
                                Mulai Ujian
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}