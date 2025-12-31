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
        <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden">
                    <div className="p-8">
                        {/* Header */}
                        <div className="text-center mb-8 space-y-2">
                            <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                                M
                            </div>
                            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                Login
                            </h1>
                            <p className="text-sm text-slate-500">
                                Masuk untuk mengakses dashboard
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1 ml-1">
                                    Email
                                </label>
                                <FormInput
                                    placeholder="contoh@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    required
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1 ml-1">
                                    <label className="text-xs font-semibold text-slate-600">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Lupa password?
                                    </Link>
                                </div>
                                <FormInput
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type="password"
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-indigo-600 transition active:scale-[0.99]"
                            >
                                {isLoading ? "Memverifikasi..." : "Masuk Sekarang"}
                            </Button>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 text-center">
                        <p className="text-sm text-slate-600">
                            Belum punya akun?{" "}
                            <Link
                                href="/register"
                                className="font-semibold text-indigo-600 hover:underline"
                            >
                                Daftar gratis
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-slate-400 tracking-wide">
                    © 2025 ModernApp System
                </p>
            </div>
        </div>
    );
}
