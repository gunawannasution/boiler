// //library untuk lupa password
// import crypto from "crypto";
// import bcrypt from "bcryptjs";

// // Generate token aman
// export function generateResetToken() {
//     return crypto.randomBytes(32).toString("hex");
// }

// // Hash password
// export async function hashPassword(password) {
//     return await bcrypt.hash(password, 12);
// }

// D:\laragon\www\boiler\utils\auth.js
import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Generate token aman untuk reset password
 * Menggunakan standard crypto Node.js
 */
export function generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
}

/**
 * Hash password secara aman
 * @param {string} password - Password mentah
 * @returns {Promise<string>} - Password yang sudah di-hash
 */
export async function hashPassword(password) {
    // Salt 12 adalah standar keamanan yang direkomendasikan tahun 2026
    const salt = await bcrypt.genSalt(12);
    return await bcrypt.hash(password, salt);
}

/**
 * Verifikasi password
 */
export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
