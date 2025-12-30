import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            // Hanya izinkan akses jika ada token
            authorized: ({ token }) => !!token,
        },
        pages: {
            // Beritahu NextAuth bahwa halaman login kita ada di /login
            // Ini penting agar middleware tidak memproteksi halaman ini sendiri
            // redirect kesini jiga belum login
            signIn: "/login",
        },
    }
);

// Tentukan halaman mana yang WAJIB LOGIN
export const config = {
    matcher: [
        /*
         * Tangkap semua rute kecuali:
         * 1. /login (halaman login)
         * 2. /api/auth (endpoint next-auth)
         * 3. /_next (file internal next.js)
         * 4. /favicon.ico, /images, dll (file statis)
         */
        "/dashboard/:path*",
        "/admin/:path*",
        "/profile/:path*",
        // Jangan masukkan "/" jika itu adalah landing page publik
    ]
};
