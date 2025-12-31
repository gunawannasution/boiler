"use server";

import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path ini

/**
 * HELPER: Validasi Admin (Keamanan Berlapis)
 */
async function validateAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
        throw new Error("Tindakan terlarang: Anda bukan Administrator.");
    }
    return session;
}

// 1. Toggle Enable/Disable User
export async function toggleUserStatus(userId, currentStatus) {
    try {
        await validateAdmin();
        await prisma.user.update({
            where: { id: userId },
            data: { isActive: !currentStatus }
        });
        revalidatePath("/dashboard/users");
        return { success: true, message: "Status user berhasil diperbarui" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 2. Hapus User
export async function deleteUser(userId) {
    try {
        await validateAdmin();
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath("/dashboard/users");
        return { success: true, message: "User berhasil dihapus" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// 3. Update Password (Digunakan untuk Auto-Reset)
export async function updatePassword(userId, newPassword) {
    try {
        await validateAdmin();
        const hashedPassword = await bcrypt.hash(newPassword, 12); // Round 12 lebih aman untuk 2025

        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                passwordChangedAt: new Date()
            }
        });

        revalidatePath("/dashboard/users");
        return { success: true, message: "Password berhasil diubah" };
    } catch (error) {
        return { success: false, message: "Gagal memperbarui password" };
    }
}

// 4. Update Role
export async function updateUserRole(userId, newRole) {
    try {
        await validateAdmin();
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath("/dashboard/users");
        return { success: true, message: "Role berhasil diubah" };
    } catch (error) {
        return { success: false, message: "Gagal memperbarui role" };
    }
}

// 5. Update Info (Nama & Email)
export async function updateUserInfo(userId, data) {
    try {
        await validateAdmin();

        // Cek jika email sudah digunakan user lain (Pencegahan manual sebelum Prisma error)
        if (data.email) {
            const existing = await prisma.user.findFirst({
                where: { email: data.email, NOT: { id: userId } }
            });
            if (existing) throw new Error("Email ini sudah digunakan oleh akun lain.");
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                name: data.name,
                email: data.email,
            }
        });

        revalidatePath("/dashboard/users");
        return { success: true, message: "Data user berhasil diperbarui" };
    } catch (error) {
        return { success: false, message: error.message || "Terjadi kesalahan sistem" };
    }
}
export async function createUser(data) {
    try {
        //1. Cek apakah email sudah terdaftar
        const existing = await prisma.user.findUnique({
            where: { email: data.email }
        })
        if (existing) return { success: false, message: "Email sudah digunakan" }

        //2. Hash Password menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(data.password, 12)

        //3. Simpan ke database
        await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role || "USER",
                isActive: true
            }
        })
        revalidatePath("/dashboard/users")
        return { success: true, message: "User berhasil dibuat" }
    } catch (error) {
        return { success: false, message: "Gagal membuat user" }
    }

}