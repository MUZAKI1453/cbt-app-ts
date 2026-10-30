import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Teacher {
    id: string;
    name: string;
}

interface Subject {
    id: string;
    name: string;
    guruId?: string;
    guru?: Teacher;
}

export default function SubjectsManagement() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // State Modal
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [name, setName] = useState('');
    const [guruId, setGuruId] = useState('');

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resSub, resTeach] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/subjects', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/admin/teachers', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setSubjects(resSub.data.data || []);
            setTeachers(resTeach.data.data || []);
        } catch (err: any) {
            setMessage({ text: 'Gagal memuat data mata pelajaran.', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { name, guruId: guruId || null };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/admin/subjects/${currentId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Mata pelajaran berhasil diperbarui!', type: 'success' });
            } else {
                await axios.post('http://localhost:5000/api/admin/subjects', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Mata pelajaran berhasil ditambahkan!', type: 'success' });
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Terjadi kesalahan.', type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus mata pelajaran ini?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/subjects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Mata pelajaran berhasil dihapus!', type: 'success' });
            fetchData();
        } catch (err: any) {
            setMessage({ text: 'Gagal menghapus mata pelajaran.', type: 'error' });
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId('');
        setName('');
        setGuruId('');
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Mata Pelajaran</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Pusat pengaturan mata pelajaran dan penugasan guru pengampu.</p>
                </div>

                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    style={{ backgroundColor: '#0565f5' }}
                    className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
                >
                    <span>+</span> Tambah Mapel Baru
                </button>
            </div>

            {message.text && (
                <div className={`p-4 rounded-2xl text-xs font-semibold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/70 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-100">
                            <th className="py-4 px-6 font-bold w-16">No</th>
                            <th className="py-4 px-6 font-bold">Nama Mata Pelajaran</th>
                            <th className="py-4 px-6 font-bold">Guru Pengampu</th>
                            <th className="py-4 px-6 font-bold text-center w-36">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                        {isLoading ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-slate-400">Memuat data mapel...</td>
                            </tr>
                        ) : subjects.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-slate-400">Belum ada mata pelajaran terdaftar.</td>
                            </tr>
                        ) : (
                            subjects.map((sub, index) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-slate-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800">{sub.name}</td>
                                    <td className="py-4 px-6 font-medium text-slate-600">
                                        {sub.guru ? sub.guru.name : <span className="text-slate-400 italic">Belum ditentukan</span>}
                                    </td>
                                    <td className="py-4 px-6 text-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setCurrentId(sub.id);
                                                setName(sub.name);
                                                setGuruId(sub.guruId || '');
                                                setShowModal(true);
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors cursor-pointer"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit Mapel */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100">
                        <h3 className="text-base font-extrabold text-slate-800 mb-4">
                            {isEditing ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Mata Pelajaran</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:bg-white focus:border-[#0565f5] outline-none"
                                    placeholder="Contoh: Matematika, Bahasa Indonesia..."
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Guru Pengampu</label>
                                <select
                                    value={guruId}
                                    onChange={(e) => setGuruId(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:bg-white focus:border-[#0565f5] outline-none cursor-pointer"
                                >
                                    <option value="">-- Pilih Guru Pengampu (Opsional) --</option>
                                    {teachers.map((t) => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    style={{ backgroundColor: '#0565f5' }}
                                    className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all cursor-pointer"
                                >
                                    Simpan Mapel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}