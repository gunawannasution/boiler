"use server";

import crypto from "crypto";
import { hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";

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
