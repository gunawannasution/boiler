"use client";

import { createUser } from "@/app/actions/userActions";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiLock,
    FiShield,
    FiPlusCircle,
    FiChevronDown
} from "react-icons/fi";

export default function UserAddForm({ onSuccess }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            role: "USER"
        }
    });

    const onSubmit = async (data) => {
        const t = toast.loading("Menyimpan data pengguna...");
        try {
            const res = await createUser(data);
            if (res.success) {
                reset();
                onSuccess?.();
                toast.success("User berhasil ditambahkan", { id: t });
            } else {
                toast.error(res.message || "Gagal menambahkan user", { id: t });
            }
        } catch {
            toast.error("Kesalahan sistem", { id: t });
        }
    };

    const inputBase =
        "w-full px-5 py-4 rounded-2xl bg-slate-50 text-slate-800 font-medium outline-none transition-all duration-200";

    return (
        <div className="relative">
            {/* Soft background accent */}
            <div className="absolute -inset-6 bg-gradient-to-br from-indigo-50 via-white to-white rounded-[3rem] blur-2xl opacity-70 pointer-events-none" />

            <div className="relative bg-white rounded-[2.75rem] p-8 md:p-10 shadow-2xl shadow-slate-100 border border-slate-100">
                {/* Header */}
                <div className="mb-8 text-center space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-indigo-500">
                        Create New User
                    </p>
                    <h2 className="text-2xl font-black text-slate-900">
                        Informasi Akun
                    </h2>
                    <p className="text-sm text-slate-500">
                        Lengkapi data pengguna untuk memberikan akses sistem
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Nama */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                            <FiUser className="text-indigo-500" />
                            Nama Lengkap
                        </label>
                        <input
                            {...register("name", { required: "Nama wajib diisi" })}
                            placeholder="John Doe"
                            className={`${inputBase} ${errors.name
                                    ? "border border-red-200 bg-red-50"
                                    : "border border-slate-100 focus:border-indigo-500 focus:bg-white"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                            <FiMail className="text-indigo-500" />
                            Email
                        </label>
                        <input
                            {...register("email", {
                                required: "Email wajib diisi",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Format email tidak valid"
                                }
                            })}
                            type="email"
                            placeholder="john@example.com"
                            className={`${inputBase} ${errors.email
                                    ? "border border-red-200 bg-red-50"
                                    : "border border-slate-100 focus:border-indigo-500 focus:bg-white"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Password */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                                <FiLock className="text-indigo-500" />
                                Password
                            </label>
                            <input
                                {...register("password", {
                                    required: "Password wajib diisi",
                                    minLength: { value: 6, message: "Minimal 6 karakter" }
                                })}
                                type="password"
                                placeholder="••••••••"
                                className={`${inputBase} ${errors.password
                                        ? "border border-red-200 bg-red-50"
                                        : "border border-slate-100 focus:border-indigo-500 focus:bg-white"
                                    }`}
                            />
                            {errors.password && (
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                                <FiShield className="text-indigo-500" />
                                Role
                            </label>
                            <div className="relative">
                                <select
                                    {...register("role")}
                                    className={`${inputBase} border border-slate-100 focus:border-indigo-500 appearance-none cursor-pointer`}
                                >
                                    <option value="USER">Standard User</option>
                                    <option value="ADMIN">Administrator</option>
                                </select>
                                <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full mt-8 flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black shadow-2xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <FiPlusCircle size={20} />
                                Simpan Pengguna
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
