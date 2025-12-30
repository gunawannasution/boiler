"use server";

import prisma from "../../../lib/prisma";
import { hashPassword } from "../../../utils/hash";

const prisma = new PrismaClient();

/**
 * Register user baru
 * @param {Object} param0 { name, email, password }
 */
export async function registerUser({ name, email, password }) {
    // Cek email sudah ada atau belum
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email sudah terdaftar");

    // Hash password sebelum simpan
    const hashed = await hashPassword(password);

    // Simpan user baru ke database
    return await prisma.user.create({
        data: { name, email, password: hashed, role: "USER" },
    });
}

/**
 * Request reset password: buat token reset
 */
export async function requestResetPassword(email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Email tidak ditemukan");

    // Token sederhana, bisa diganti dengan UUID / JWT untuk production
    const token = Math.random().toString(36).substring(2, 12);

    // Simpan token ke database
    await prisma.user.update({ where: { email }, data: { resetToken: token } });

    return token; // nanti bisa dikirim via email
}

/**
 * Reset password user berdasarkan token
 */
export async function resetPassword({ token, newPassword }) {
    const user = await prisma.user.findFirst({ where: { resetToken: token } });
    if (!user) throw new Error("Token tidak valid");

    // Hash password baru
    const hashed = await hashPassword(newPassword);

    // Update password dan hapus token
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed, resetToken: null } });

    return true;
}
