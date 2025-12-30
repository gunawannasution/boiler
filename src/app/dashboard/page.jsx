"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        // Hanya redirect jika status benar-benar sudah selesai loading dan user tidak terautentikasi
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    // 1. Tangani status loading dengan UI yang lebih bersih
    if (status === "loading") {
        return (
            <div className="flex h-96 items-center justify-center">
                <p className="animate-pulse text-slate-500">Memuat data...</p>
            </div>
        );
    }

    // 2. Proteksi Render: Jika tidak ada session (saat proses redirect), jangan render konten bawah.
    // Ini mencegah error "Cannot read properties of null (reading 'user')"
    if (!session?.user) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <p className="text-slate-600">
                    Selamat datang kembali,
                    <span className="font-semibold text-indigo-600 ml-1">
                        {session.user.name}
                    </span>
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    Role: {session.user.role || "User"}
                </div>
            </div>
        </div>
    );
}
