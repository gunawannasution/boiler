//library untuk lupa password
import crypto from "crypto";
import bcrypt from "bcryptjs";

// Generate token aman
export function generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
}

// Hash password
export async function hashPassword(password) {
    return await bcrypt.hash(password, 12);
}
