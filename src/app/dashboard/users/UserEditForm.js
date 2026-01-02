"use client";

import { useForm } from "react-hook-form";
import { updateUserInfo, updateUserRole } from "@/app/actions/userActions";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiShield,
  FiSave,
  FiChevronDown,
  FiLoader,
  FiInfo,
  FiCpu,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function UserEditForm({ user, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: user?.role || "USER",
    },
  });

  const onSubmit = async (data) => {
    const t = toast.loading("Synchronizing profile data...");
    try {
      const tasks = [
        updateUserInfo(user.id, {
          name: data.name,
          email: data.email,
        }),
      ];

      if (data.role !== user.role) {
        tasks.push(updateUserRole(user.id, data.role));
      }

      const results = await Promise.all(tasks);
      const failed = results.find((r) => !r.success);

      if (!failed) {
        toast.success("Identity updated successfully", { id: t });
        onSuccess?.();
      } else {
        toast.error(failed.message || "Update synchronization failed", {
          id: t,
        });
      }
    } catch {
      toast.error("Critical system protocol error", { id: t });
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
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative selection:bg-indigo-100"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {/* Header Context */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-slate-100 to-white rounded-3xl flex items-center justify-center border border-slate-100 shadow-inner mb-4">
            <FiCpu className="text-indigo-500" size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500">
            Profile Matrix
          </p>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
            Modify Identity
          </h2>
        </div>

        <div className="space-y-5">
          {/* Nama Lengkap */}
          <div className="space-y-1">
            <label className={labelStyles}>
              <FiUser className="text-indigo-400" /> Full Identity Name
            </label>
            <input
              {...register("name", { required: "Legal name is required" })}
              placeholder="John Doe"
              className={`${inputStyles} ${
                errors.name ? "border-red-200 focus:ring-red-500/5" : ""
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
              <FiMail className="text-indigo-400" /> Email Communication
            </label>
            <input
              {...register("email", {
                required: "System email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid protocol format",
                },
              })}
              type="email"
              placeholder="user@domain.com"
              className={`${inputStyles} ${
                errors.email ? "border-red-200 focus:ring-red-500/5" : ""
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

          {/* Privilege Level */}
          <div className="space-y-1">
            <label className={labelStyles}>
              <FiShield className="text-indigo-400" /> Access Privilege
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

        {/* Information Card */}
        <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 flex gap-3">
          <FiInfo className="text-slate-400 mt-0.5 flex-shrink-0" size={14} />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Changes to{" "}
            <span className="text-slate-800 font-bold tracking-tight">
              Access Privilege
            </span>{" "}
            will take effect immediately upon the next user session
            synchronization.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-70"
          >
            {isSubmitting ? (
              <FiLoader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FiSave size={18} />
                Commit Changes
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
