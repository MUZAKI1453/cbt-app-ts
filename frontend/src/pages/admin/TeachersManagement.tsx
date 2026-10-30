import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Subject {
    id: string;
    name: string;
}

interface Teacher {
    id: string;
    username: string;
    name: string;
    subjects?: Subject[];
}

export default function TeachersManagement() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });

    // State Modal Tambah/Edit
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState('');
    const [nip, setNip] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

    const token = localStorage.getItem('token');

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [resTeachers, resSubjects] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/teachers', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/admin/subjects', { // Pastikan endpoint subjects tersedia atau sesuaikan
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(() => ({ data: { data: [] } }))
            ]);

            setTeachers(resTeachers.data.data);
            setAvailableSubjects(resSubjects.data.data || []);
            setMessage({ text: '', type: '' });
        } catch (err: any) {
            setMessage({ text: 'Gagal memuat data dari server.', type: 'error' });
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
            const payload = {
                name,
                password,
                subjectIds: selectedSubjectIds,
                ...(isEditing ? {} : { nip })
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/api/admin/teachers/${currentId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Data guru berhasil diperbarui!', type: 'success' });
            } else {
                await axios.post('http://localhost:5000/api/admin/teachers', payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessage({ text: 'Guru baru berhasil ditambahkan!', type: 'success' });
            }
            setShowModal(false);
            resetForm();
            fetchData();
        } catch (err: any) {
            setMessage({ text: err.response?.data?.error || 'Terjadi kesalahan.', type: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus guru ini?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/teachers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Guru berhasil dihapus!', type: 'success' });
            fetchData();
        } catch (err: any) {
            setMessage({ text: 'Gagal menghapus guru.', type: 'error' });
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file_excel', file);

        try {
            const res = await axios.post('http://localhost:5000/api/admin/teachers/import', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage({ text: res.data.message, type: 'success' });
            fetchData();
        } catch (err: any) {
            setMessage({ text: 'Gagal memproses file Excel.', type: 'error' });
        }
        e.target.value = '';
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId('');
        setNip('');
        setName('');
        setPassword('');
        setSelectedSubjectIds([]);
    };

    const toggleSubjectSelection = (subId: string) => {
        if (selectedSubjectIds.includes(subId)) {
            setSelectedSubjectIds(selectedSubjectIds.filter(id => id !== subId));
        } else {
            setSelectedSubjectIds([...selectedSubjectIds, subId]);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">Kelola Data Guru</h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Daftar pengajar aktif dan pengaturan mata pelajaran yang diampu.</p>
                </div>

                <div className="flex items-center gap-2.5">
                    <label className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center gap-2">
                        <span>📁</span> Impor Excel
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="hidden" />
                    </label>

                    <button
                        onClick={() => { resetForm(); setShowModal(true); }}
                        style={{ backgroundColor: '#0565f5' }}
                        className="px-4 py-2.5 rounded-xl text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all cursor-pointer flex items-center gap-2"
                    >
                        <span>+</span> Tambah Guru Baru
                    </button>
                </div>
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
                            <th className="py-4 px-6 font-bold">NIP / Username</th>
                            <th className="py-4 px-6 font-bold">Nama Lengkap & Gelar</th>
                            <th className="py-4 px-6 font-bold">Mapel Diampu</th>
                            <th className="py-4 px-6 font-bold text-center w-36">Aksi</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-400">Memuat data guru...</td>
                            </tr>
                        ) : teachers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-10 text-slate-400">Belum ada data guru terdaftar.</td>
                            </tr>
                        ) : (
                            teachers.map((teacher, index) => (
                                <tr key={teacher.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-slate-400">{index + 1}</td>
                                    <td className="py-4 px-6 font-bold text-slate-800">{teacher.username}</td>
                                    <td className="py-4 px-6 font-medium text-slate-900">{teacher.name}</td>
                                    <td className="py-4 px-6">
                                        {teacher.subjects && teacher.subjects.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {teacher.subjects.map((sub) => (
                                                    <span key={sub.id} className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0565f5] text-[10px] font-bold">
                                                            {sub.name}
                                                        </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Belum ada mapel</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(true);
                                                setCurrentId(teacher.id);
                                                setName(teacher.name);
                                                setPassword('');
                                                setSelectedSubjectIds(teacher.subjects ? teacher.subjects.map(s => s.id) : []);
                                                setShowModal(true);
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(teacher.id)}
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

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-base font-extrabold text-slate-800 mb-4">
                            {isEditing ? 'Edit Data Guru' : 'Tambah Guru Baru'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {!isEditing && (
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">NIP / Username</label>
                                    <input
                                        type="text"
                                        value={nip}
                                        onChange={(e) => setNip(e.target.value)}
                                        required
                                        className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:bg-white focus:border-[#0565f5] outline-none"
                                        placeholder="Masukkan NIP..."
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap & Gelar</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:bg-white focus:border-[#0565f5] outline-none"
                                    placeholder="Contoh: Budi Santoso, S.Pd"
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    {isEditing ? 'Password Baru (Opsional)' : 'Kata Sandi (Default NIP)'}
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-900 focus:bg-white focus:border-[#0565f5] outline-none"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Pilihan Mata Pelajaran */}
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Pilih Mata Pelajaran yang Diampu</label>
                                {availableSubjects.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">Belum ada data mata pelajaran yang dibuat.</p>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-100 rounded-xl bg-slate-50">
                                        {availableSubjects.map((sub) => (
                                            <label key={sub.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubjectIds.includes(sub.id)}
                                                    onChange={() => toggleSubjectSelection(sub.id)}
                                                    className="rounded border-slate-300 text-[#0565f5] focus:ring-[#0565f5]"
                                                />
                                                <span className="truncate">{sub.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
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
                                    Simpan Data
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}