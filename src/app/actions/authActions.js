//action lupa password
"use server";

import { db } from "../../../lib/db";
import { generateResetToken } from "../../../lib/auth";
import { sendResetEmail } from "../../../lib/mailer";
import crypto from "crypto";
import { hashPassword } from "../../../lib/auth";


export async function forgotPassword(formData) {
    const email = formData.get("email");

    const user = await db.user.findUnique({ where: { email } });
    if (!user) return { success: true }; // anti user enumeration

    const token = generateResetToken();
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await db.user.update({
        where: { email },
        data: {
            reset_token: hashedToken,
            reset_token_expiry: new Date(Date.now() + 15 * 60 * 1000)
        }
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;
    await sendResetEmail(email, resetLink);

    return { success: true };
}
export async function resetPassword(formData) {
    const token = formData.get("token");
    const password = formData.get("password");

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await db.user.findFirst({
        where: {
            reset_token: hashedToken,
            reset_token_expiry: { gt: new Date() }
        }
    });

    if (!user) {
        return { message: "Token tidak valid atau kadaluarsa" };
    }

    const hashedPassword = await hashPassword(password);

    await db.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null
        }
    });

    return { message: "Password berhasil diubah" };
}