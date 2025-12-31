"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";
import { FiUserPlus } from "react-icons/fi";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const router = useRouter();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setToast(null);

        try {
            await registerUser({ name, email, password });
            setToast({
                type: "success",
                text: "Pendaftaran berhasil. Mengarahkan ke login..."
            });
            setTimeout(() => router.push("/login"), 1600);
        } catch (err) {
            setToast({
                type: "error",
                text: err?.message || "Terjadi kesalahan saat mendaftar"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] flex items-center justify-center px-4 py-10 bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Card */}
            <div className="relative w-full max-w-md">
                {/* Soft glow */}
                <div className="absolute -inset-6 bg-indigo-100/40 rounded-[3rem] blur-2xl pointer-events-none" />

                <div className="relative bg-white rounded-[2.75rem] border border-slate-100 shadow-2xl shadow-slate-200/60 px-8 py-10">
                    {/* Header */}
                    <div className="text-center mb-8 space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.35em] text-indigo-500">
                            Registration
                        </p>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            Buat Akun Baru
                        </h1>
                        <p className="text-sm text-slate-500">
                            Lengkapi data untuk mulai menggunakan sistem
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="space-y-5">
                        <FormInput
                            placeholder="Nama lengkap"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                            required
                        />

                        <FormInput
                            placeholder="Alamat email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                            required
                        />

                        <FormInput
                            placeholder="Kata sandi"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            required
                        />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Memproses...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <FiUserPlus size={18} />
                                    Daftar Sekarang
                                </span>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center text-sm text-slate-500">
                        Sudah punya akun?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="font-bold text-indigo-600 hover:underline"
                        >
                            Masuk di sini
                        </button>
                    </div>
                </div>
            </div>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.text}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
