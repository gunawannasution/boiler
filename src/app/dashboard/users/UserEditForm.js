"use client";

import { useForm } from "react-hook-form";
import { updateUserInfo, updateUserRole } from "@/app/actions/userActions";
import toast from "react-hot-toast";
import {
    FiUser,
    FiMail,
    FiShield,
    FiSave,
    FiChevronDown
} from "react-icons/fi";

export default function UserEditForm({ user, onSuccess }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            name: user?.name || "",
            email: user?.email || "",
            role: user?.role || "USER"
        }
    });

    const onSubmit = async (data) => {
        const t = toast.loading("Memperbarui data pengguna...");
        try {
            const tasks = [
                updateUserInfo(user.id, {
                    name: data.name,
                    email: data.email
                })
            ];

            if (data.role !== user.role) {
                tasks.push(updateUserRole(user.id, data.role));
            }

            const results = await Promise.all(tasks);
            const failed = results.find((r) => !r.success);

            if (!failed) {
                toast.success("Profil berhasil diperbarui", { id: t });
                onSuccess?.();
            } else {
                toast.error(failed.message || "Gagal memperbarui data", { id: t });
            }
        } catch {
            toast.error("Kesalahan sistem", { id: t });
        }
    };

    const inputBase =
        "w-full px-5 py-4 rounded-2xl bg-slate-50 text-slate-800 font-medium outline-none transition-all duration-200";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Info hint */}
            <div className="text-center">
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-indigo-500">
                    Edit Profile
                </p>
                <p className="text-sm text-slate-500 mt-1">
                    Perbarui informasi dan hak akses pengguna
                </p>
            </div>

            {/* Nama */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <FiUser className="text-indigo-500" />
                    Nama Lengkap
                </label>
                <input
                    {...register("name", { required: "Nama tidak boleh kosong" })}
                    placeholder="Nama lengkap"
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
                        required: "Email tidak boleh kosong",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Format email tidak valid"
                        }
                    })}
                    type="email"
                    placeholder="email@domain.com"
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

            {/* Role */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <FiShield className="text-indigo-500" />
                    Hak Akses
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

            {/* Submit */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-black shadow-xl shadow-slate-200 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <FiSave size={18} />
                            Simpan Perubahan
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
