import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { comparePassword } from "../../../../../utils/hash";

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) return null;

                const isValid = await comparePassword(credentials.password, user.password);
                if (!isValid) return null;

                return { id: user.id, name: user.name, email: user.email, role: user.role };
            },
        }),
    ],
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            session.user.role = token.role;
            return session;
        },
    },
    pages: { signIn: "/login", error: "/login" }, // arahkan error ke login
};

const handler = NextAuth(authOptions);

// **Wajib export untuk App Router**:
export { handler as GET, handler as POST };
