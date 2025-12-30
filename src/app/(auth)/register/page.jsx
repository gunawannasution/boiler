"use client";

import { useState } from "react";
import { registerUser } from "@/app/actions/authActions";
import { useRouter } from "next/navigation";
import FormInput from "../../components/ui/FormInput";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";

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
            setToast({ type: "success", text: "Pendaftaran berhasil! Mengarahkan ke halaman login..." });
            setTimeout(() => router.push("/login"), 1800);
        } catch (err) {
            setToast({ type: "error", text: err.message || "Terjadi kesalahan saat mendaftar." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Buat Akun</h1>
                    <p className="text-gray-500 text-sm mt-2">Isi data di bawah untuk memulai</p>
                </div>

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
                        className="w-full py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-medium transition duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Memproses...
                            </span>
                        ) : (
                            "Daftar Sekarang"
                        )}
                    </Button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Sudah punya akun?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-indigo-600 hover:underline font-medium"
                    >
                        Masuk di sini
                    </button>
                </div>
            </div>

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