import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    // Password asli yang nanti diketik saat login: "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Buat akun Admin
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: hashedPassword,
            name: 'Administrator Utama',
            role: 'ADMIN',
        },
    });

    console.log('Akun Admin berhasil dibuat:', admin.username);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });