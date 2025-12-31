"use server";

import prisma from "../../../lib/prisma";
import { hashPassword } from "../../../utils/hash";

/**
 * Mendaftarkan user baru ke sistem
 * @param {Object} payload
 * @param {string} payload.name
 * @param {string} payload.email
 * @param {string} payload.password
 */
export async function registerUser({ name, email, password }) {
    // Validasi email agar unik
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        throw new Error("Email sudah terdaftar");
    }

    // Hash password sebelum disimpan
    const hashedPassword = await hashPassword(password);

    // Simpan user baru
    return prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role: "USER",
        },
    });
}

/**
 * Membuat token untuk proses reset password
 * @param {string} email
 * @returns {string} resetToken
 */
export async function requestResetPassword(email) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("Email tidak ditemukan");
    }

    // Token sederhana (untuk production gunakan UUID/JWT)
    const resetToken = Math.random().toString(36).slice(2, 12);

    await prisma.user.update({
        where: { email },
        data: { resetToken },
    });

    return resetToken;
}

/**
 * Reset password user berdasarkan token
 * @param {Object} payload
 * @param {string} payload.token
 * @param {string} payload.newPassword
 */
export async function resetPassword({ token, newPassword }) {
    const user = await prisma.user.findFirst({
        where: { resetToken: token },
    });

    if (!user) {
        throw new Error("Token tidak valid");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
        },
    });

    return true;
}
