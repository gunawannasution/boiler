"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Redirect hanya setelah status final
    useEffect(() => {
        if (status === "unauthenticated") {
            router.replace("/login");
        }
    }, [status, router]);

    // Loading state yang bersih & profesional
    if (status === "loading") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                    <p className="text-sm text-slate-500 animate-pulse">
                        Memuat dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Saat redirect berlangsung, jangan render apa pun
    if (status !== "authenticated") {
        return null;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">
                Dashboard
            </h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition hover:shadow-md">
                <p className="text-slate-600">
                    Selamat datang kembali,
                    <span className="font-semibold text-indigo-600 ml-1">
                        {session.user.name || "User"}
                    </span>
                </p>

                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    Role: {session.user.role ?? "USER"}
                </div>
            </div>
        </div>
    );
}
