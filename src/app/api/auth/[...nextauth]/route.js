import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../../../lib/prisma";
import { comparePassword } from "../../../../../utils/hash";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email dan Password wajib diisi");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                // Cek keberadaan user dan status aktif
                if (!user) throw new Error("Akun tidak ditemukan");
                if (!user.isActive) throw new Error("Akun Anda telah dinonaktifkan");

                const valid = await comparePassword(
                    credentials.password,
                    user.password
                );

                if (!valid) throw new Error("Password salah");

                // Return objek user (ini akan masuk ke JWT callback pertama kali)
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    passwordChangedAt: user.passwordChangedAt,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60, // 1 Hari (Standard 2025)
    },
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // 1. Saat pertama kali Login
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.passwordChangedAt = user.passwordChangedAt;
            }

            // 2. Fitur Profesional: Update session secara dinamis (tanpa logout)
            // Berguna saat admin mengubah role Anda saat Anda sedang login
            if (trigger === "update" && session) {
                return { ...token, ...session };
            }

            // 3. Keamanan: Cek Invalidate Session jika password berubah
            if (token.passwordChangedAt) {
                const changedTime = new Date(token.passwordChangedAt).getTime();
                const tokenIssuedTime = token.iat * 1000;
                if (tokenIssuedTime < changedTime) {
                    return null; // Memaksa logout
                }
            }

            return token;
        },

        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    // Menambahkan Secret untuk keamanan JWT
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
