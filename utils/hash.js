import bcrypt from "bcryptjs";

// Fungsi untuk hash password sebelum disimpan ke database
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

// Fungsi untuk membandingkan password input dengan password hashed
export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
