"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import FormInput from "@/app/components/ui/FormInput";
import Button from "@/app/components/ui/Button";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                callbackUrl: "/dashboard",
            });

            // Jika credentials salah, NextAuth akan return error
            if (res?.error) {
                setError("Email atau password salah. Silakan coba lagi.");
                setIsLoading(false);
            }
        } catch {
            setError("Koneksi ke server terputus.");
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-indigo-50 p-4 sm:p-6">
            {/* Main Card */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                <div className="p-7 sm:p-8">
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold shadow-lg">
                            M
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-900 tracking-tight">
                            Halo, Kembali!
                        </h1>
                        <p className="text-slate-500 mt-1 text-sm">
                            Silakan masuk untuk mengakses dashboard Anda
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1.5 ml-1">
                                Email
                            </label>
                            <FormInput
                                placeholder="contoh@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                required
                                className="w-full px-4 py-3.5 text-slate-800 placeholder-slate-400 border-slate-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent rounded-xl shadow-sm transition"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-xs font-semibold text-slate-600 ml-1">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    Lupa Password?
                                </Link>
                            </div>
                            <FormInput
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                required
                                className="w-full px-4 py-3.5 text-slate-800 placeholder-slate-400 border-slate-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent rounded-xl shadow-sm transition"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-3.5 font-semibold rounded-xl text-white text-sm shadow-md transition-all duration-200 ${isLoading
                                    ? "bg-slate-300 cursor-not-allowed"
                                    : "bg-linear-to-r from-slate-900 to-slate-800 hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.99] shadow-lg"
                                }`}
                        >
                            {isLoading ? "Memverifikasi..." : "Masuk Sekarang"}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <div className="px-7 py-4 bg-slate-50 border-t border-slate-200 text-center">
                    <p className="text-sm text-slate-600">
                        Belum punya akun?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Daftar Gratis
                        </Link>
                    </p>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-xs tracking-wide">
                &copy; 2025 ModernApp System. All rights reserved.
            </p>
        </div>
    );
}
