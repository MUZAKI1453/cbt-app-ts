import React from 'react';

export default function DashboardTeacher() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.reload();
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h1 style={{ color: '#1f2937', margin: 0 }}>Dashboard Guru</h1>
                    <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>Kelola bank soal dan ujian siswa di sini.</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ backgroundColor: '#dc2626', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Keluar (Logout)
                </button>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginTop: 0, color: '#1d4ed8' }}>Buat Ujian Baru</h3>
                    <p style={{ color: '#4b5563', fontSize: '14px' }}>Tambahkan jadwal ujian baru, tentukan durasi dan bobot nilai.</p>
                    <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                        + Tambah Ujian
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginTop: 0, color: '#047857' }}>Bank Soal</h3>
                    <p style={{ color: '#4b5563', fontSize: '14px' }}>Buat dan edit pertanyaan pilihan ganda atau esai.</p>
                    <button style={{ backgroundColor: '#059669', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                        Kelola Soal
                    </button>
                </div>

                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                    <h3 style={{ marginTop: 0, color: '#b45309' }}>Hasil & Nilai Siswa</h3>
                    <p style={{ color: '#4b5563', fontSize: '14px' }}>Lihat laporan hasil ujian dan analisis jawaban siswa.</p>
                    <button style={{ backgroundColor: '#d97706', color: 'white', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
                        Lihat Nilai
                    </button>
                </div>
            </div>
        </div>
    );
}