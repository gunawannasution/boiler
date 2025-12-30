"use server";

import prisma from "../../../lib/prisma";
import crypto from "crypto";
import { hashPassword } from "../../../lib/auth";
import { sendResetEmail } from "../../../lib/mailer";

/* REGISTER */
export async function registerUser({ name, email, password }) {
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
        where: { email: normalizedEmail }
    });
    if (existing) throw new Error("Email sudah terdaftar");

    const hashed = await hashPassword(password);

    return prisma.user.create({
        data: {
            name,
            email: normalizedEmail,
            password: hashed,
            role: "USER"
        }
    });
}

/* FORGOT PASSWORD */
export async function forgotPassword(formData) {
    try {
        const email = formData.get("email")?.toLowerCase().trim();
        if (!email) return { success: true };

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return { success: true };

        if (user.resetTokenExpiry && user.resetTokenExpiry > new Date()) {
            return { success: true };
        }

        const token = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
        await sendResetEmail(user.email, resetLink);

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: true };
    }
}

/* RESET PASSWORD */
export async function resetPassword(formData) {
    const token = formData.get("token");
    const password = formData.get("password");

    if (!token || !password || password.length < 8) {
        return { message: "Data tidak valid" };
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await prisma.user.findFirst({
        where: {
            resetToken: hashedToken,
            resetTokenExpiry: { gt: new Date() }
        }
    });

    if (!user) {
        return { message: "Token tidak valid atau kadaluarsa" };
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            passwordChangedAt: new Date()
        }
    });

    return { message: "Password berhasil diubah" };
}
