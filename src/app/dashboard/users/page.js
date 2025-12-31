// app/dashboard/users/page.js
import prisma from "../../../../lib/prisma";
import UserManagement from "./UserManajement";

export default async function Page() {
    // 1. Ambil data (Pastikan pakai await)
    const allUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // 2. Kirim ke komponen (Pastikan nama prop sesuai: users={allUsers})
    return <UserManagement users={allUsers} />;
}
