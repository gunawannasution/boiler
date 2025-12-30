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
                // ✅ Validasi input dasar
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const valid = await comparePassword(
                    credentials.password,
                    user.password
                );

                if (!valid) return null;

                // ✅ Data minimal untuk session
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
    },

    callbacks: {
        /**
         * JWT callback
         * - sync role
         * - invalidate token jika password berubah
         */
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.passwordChangedAt = user.passwordChangedAt;
            }

            // 🔐 invalidate session jika password diubah
            if (
                token.passwordChangedAt &&
                token.iat * 1000 < new Date(token.passwordChangedAt).getTime()
            ) {
                return null;
            }

            return token;
        },

        /**
         * Session callback
         */
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
