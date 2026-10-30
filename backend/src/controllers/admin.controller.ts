import { Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../services/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as XLSX from 'xlsx';

// 1. Ambil Semua Data Guru (Beserta Mapel yang Diampu)
export const getAllTeachers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const teachers = await prisma.user.findMany({
            where: { role: 'TEACHER' },
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true
            },
            orderBy: { name: 'asc' }
        });

        const teachersWithSubjects = await Promise.all(teachers.map(async (teacher) => {
            const subjects = await prisma.subject.findMany({
                where: { guruId: teacher.id }, // Sesuaikan dengan foreign key di model Subject Anda (guruId / teacherId)
                select: { id: true, name: true }
            }).catch(() => []);

            return { ...teacher, subjects };
        }));

        res.json({ message: 'Berhasil mengambil data guru', data: teachersWithSubjects });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// Ambil Daftar Semua Mata Pelajaran (Untuk Pilihan di Form)
export const getAllSubjectsForSelection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }
        const subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
        res.json({ message: 'Berhasil mengambil daftar mapel', data: subjects });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 2. Tambah Guru Manual oleh Admin (Dengan Mapel)
export const createTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { nip, name, password, subjectIds } = req.body;
        if (!nip || !name) {
            res.status(400).json({ error: 'NIP dan Nama wajib diisi!' });
            return;
        }

        const existing = await prisma.user.findUnique({ where: { username: nip } });
        if (existing) {
            res.status(400).json({ error: 'NIP sudah terdaftar!' });
            return;
        }

        const defaultPassword = password ? password : nip;
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newTeacher = await prisma.user.create({
            data: {
                username: nip,
                password: hashedPassword,
                name,
                role: 'TEACHER'
            }
        });

        // Jika ada subjectIds yang dipilih, update tabel Subject agar terikat ke guru ini
        if (subjectIds && Array.isArray(subjectIds) && subjectIds.length > 0) {
            await prisma.subject.updateMany({
                where: { id: { in: subjectIds } },
                data: { guruId: newTeacher.id }
            });
        }

        res.status(201).json({ message: 'Guru berhasil ditambahkan!', data: newTeacher });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 3. Edit Data Guru (Dengan Mapel)
export const updateTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { id } = req.params;
        const { name, password, subjectIds } = req.body;

        const teacher = await prisma.user.findUnique({ where: { id } });
        if (!teacher || teacher.role !== 'TEACHER') {
            res.status(404).json({ error: 'Data guru tidak ditemukan!' });
            return;
        }

        let updateData: any = { name };
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password.trim(), 10);
        }

        const updated = await prisma.user.update({
            where: { id },
            data: updateData
        });

        // Reset dulu mapel yang sebelumnya diampu oleh guru ini, lalu set yang baru
        await prisma.subject.updateMany({
            where: { guruId: id },
            data: { guruId: null } // atau sesuaikan jika menggunakan relasi lain
        }).catch(() => {});

        if (subjectIds && Array.isArray(subjectIds) && subjectIds.length > 0) {
            await prisma.subject.updateMany({
                where: { id: { in: subjectIds } },
                data: { guruId: id }
            });
        }

        res.json({ message: 'Data guru berhasil diperbarui!', data: updated });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 4. Hapus Guru
export const deleteTeacher = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        const { id } = req.params;

        // Lepas relasi mapel terlebih dahulu agar tidak error foreign key constraint
        await prisma.subject.updateMany({
            where: { guruId: id },
            data: { guruId: null }
        }).catch(() => {});

        await prisma.user.delete({ where: { id } });

        res.json({ message: 'Guru berhasil dihapus!' });
    } catch (error: any) {
        res.status(500).json({ error: 'Kesalahan server', details: error.message });
    }
};

// 5. Impor Guru via Excel
export const importTeachersExcel = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ error: 'Akses ditolak!' });
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'File Excel tidak ditemukan!' });
            return;
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

        let berhasil = 0;
        let skip = 0;

        for (const row of sheetData) {
            let rawNip = String(row['NIP'] || row['nip'] || '').trim();
            let rawNama = String(row['Nama'] || row['nama'] || '').trim();

            if (!rawNip || rawNip.toLowerCase() === 'nan' || !rawNama) {
                skip++;
                continue;
            }

            let nip = rawNip.endswith('.0') ? rawNip.slice(0, -2) : rawNip;

            const existing = await prisma.user.findUnique({ where: { username: nip } });
            if (existing) {
                skip++;
                continue;
            }

            const hashedPassword = await bcrypt.hash(nip, 10);
            await prisma.user.create({
                data: {
                    username: nip,
                    password: hashedPassword,
                    name: rawNama,
                    role: 'TEACHER'
                }
            });
            berhasil++;
        }

        res.json({ message: `Import Selesai! Berhasil: ${berhasil}, Lewat/Duplikat: ${skip}` });
    } catch (error: any) {
        res.status(500).json({ error: 'Gagal memproses file Excel', details: error.message });
    }
};