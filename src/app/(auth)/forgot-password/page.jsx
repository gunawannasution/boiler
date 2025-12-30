"use client";

import { forgotPassword } from "@/app/actions/authActions";
import { useState } from "react";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import FormInput from "@/app/components/ui/FormInput";
import Button from "@/app/components/ui/Button";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.target);

        try {
            const res = await forgotPassword(formData);

            if (res?.success) {
                setIsSubmitted(true);
            } else {
                setError("Terjadi kesalahan. Silakan coba lagi nanti.");
            }
        } catch {
            setError("Terjadi kesalahan pada server.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 sm:p-10 transition-all">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Mail size={28} />
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        Lupa Password?
                    </h1>
                    <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                        Masukkan email Anda, kami akan mengirimkan link untuk reset password.
                    </p>
                </div>

                {!isSubmitted ? (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
                    >
                        {error && (
                            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">
                                Email Address
                            </label>
                            <FormInput
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="w-full"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            isLoading={isLoading}
                            className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 shadow-lg"
                        >
                            Kirim Link Reset
                        </Button>
                    </form>
                ) : (
                    <div className="text-center space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex flex-col items-center p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                            <CheckCircle2 className="text-emerald-500 mb-3" size={40} />
                            <p className="text-sm font-medium text-emerald-800 leading-relaxed italic">
                                Jika email terdaftar, instruksi reset password telah dikirim.
                            </p>
                        </div>
                        <p className="text-xs text-slate-400">
                            Tidak menerima email? Periksa folder spam atau coba lagi beberapa menit lagi.
                        </p>
                    </div>
                )}

                {/* Back */}
                <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors group"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                        Kembali ke Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
