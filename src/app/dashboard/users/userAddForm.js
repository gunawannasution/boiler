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
  FiChevronDown,
  FiLoader,
  FiStar, // Menggunakan FiStar sebagai pengganti FiSparkles
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function UserAddForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      role: "USER",
    },
  });

  const onSubmit = async (data) => {
    const t = toast.loading("Establishing new identity...");
    try {
      const res = await createUser(data);
      if (res.success) {
        reset();
        onSuccess?.();
        toast.success("Identity successfully registered", { id: t });
      } else {
        toast.error(res.message || "Registration failed", { id: t });
      }
    } catch {
      toast.error("System protocol error", { id: t });
    }
  };

  const inputStyles = `
        w-full px-5 py-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl
        text-sm text-slate-800 placeholder:text-slate-400
        focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5
        transition-all duration-300 outline-none
    `;

  const labelStyles =
    "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center gap-2 ml-1";

  return (
    <div className="relative selection:bg-indigo-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)]"
      >
        {/* Decorative Element - Menggunakan FiStar agar tidak error */}
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none text-indigo-900">
          <FiStar size={80} />
        </div>

        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 mb-4">
            <FiStar size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Access Control
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Register Identity
          </h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">
            Define credentials and privilege levels for the new operative.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <FiUser className="text-indigo-400" /> Full Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="e.g. Alexander Pierce"
                className={`${inputStyles} ${
                  errors.name ? "border-red-300 focus:ring-red-500/5" : ""
                }`}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 mt-2 ml-1"
                  >
                    {errors.name.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <FiMail className="text-indigo-400" /> Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email format",
                  },
                })}
                type="email"
                placeholder="name@company.com"
                className={`${inputStyles} ${
                  errors.email ? "border-red-300 focus:ring-red-500/5" : ""
                }`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 mt-2 ml-1"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Password */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <FiLock className="text-indigo-400" /> Secure Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                type="password"
                placeholder="••••••••"
                className={`${inputStyles} ${
                  errors.password ? "border-red-300 focus:ring-red-500/5" : ""
                }`}
              />
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-bold text-red-500 mt-2 ml-1"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Role Selection */}
            <div className="space-y-1">
              <label className={labelStyles}>
                <FiShield className="text-indigo-400" /> Permission Level
              </label>
              <div className="relative group">
                <select
                  {...register("role")}
                  className={`${inputStyles} appearance-none cursor-pointer pr-12`}
                >
                  <option value="USER">Standard Operative</option>
                  <option value="ADMIN">System Administrator</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none">
                  <FiChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <FiPlusCircle size={18} />
                  <span>Initialize Identity</span>
                </>
              )}
            </motion.button>
            <p className="text-center text-[10px] text-slate-400 mt-6 font-medium uppercase tracking-[0.1em]">
              System Security Protocol v4.0 Active
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
