"use client";

import { useState } from "react";
import SmartTable from "@/app/components/ui/SmartTable";
import Modal from "@/app/components/ui/Modal";
import IconBtn from "@/app/components/ui/IconBtn";
import UserEditForm from "./UserEditForm";
import UserAddForm from "./userAddForm";
import {
  toggleUserStatus,
  deleteUser,
  updatePassword,
  updateUserRole,
} from "@/app/actions/userActions";
import toast, { Toaster } from "react-hot-toast";
import {
  FiUserPlus,
  FiKey,
  FiTrash2,
  FiEdit3,
  FiShield,
  FiCopy,
  FiRefreshCw,
  FiAlertTriangle,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   PREMIUM SUMMARY CARD
========================= */
const SummaryCard = ({ icon: Icon, label, value, color, description }) => (
  <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
    <div
      className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${color} opacity-[0.05] blur-2xl group-hover:opacity-[0.15] transition-opacity`}
    />

    <div className="flex items-start justify-between relative z-10">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${color} bg-opacity-10 text-current shadow-sm`}
      >
        <Icon size={24} />
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-3xl font-black text-slate-900 tabular-nums leading-none">
          {value}
        </p>
      </div>
    </div>

    <div className="mt-4 flex items-center justify-between relative z-10">
      <p className="text-[11px] font-medium text-slate-400 italic">
        {description}
      </p>
      <FiChevronRight className="text-slate-200 group-hover:translate-x-1 transition-transform" />
    </div>
  </div>
);

export default function UserManagement({ users = [] }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [resetData, setResetData] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const inactiveUsers = totalUsers - activeUsers;
  const adminUsers = users.filter((u) => u.role === "ADMIN").length;

  const handlePrepareReset = (user) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#";
    const password = Array.from({ length: 12 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join("");
    setResetData({
      userId: user.id,
      email: user.email,
      password,
      isSaved: false,
      loading: false,
    });
  };

  const handleConfirmReset = async () => {
    setResetData((p) => ({ ...p, loading: true }));
    const res = await updatePassword(resetData.userId, resetData.password);
    if (res?.success) {
      setResetData((p) => ({ ...p, isSaved: true, loading: false }));
      toast.success("Access Granted: New password generated");
    } else {
      toast.error(res?.message || "Failed to update security credentials");
      setResetData(null);
    }
  };

  const openConfirmModal = (user, type) => {
    const map = {
      role: {
        title: "Privilege Escalation",
        message: `Change ${user.email} permissions to ${
          user.role === "ADMIN" ? "Standard User" : "Administrator"
        }?`,
        btnClass: "bg-slate-900 hover:bg-black",
        fn: () =>
          updateUserRole(user.id, user.role === "ADMIN" ? "USER" : "ADMIN"),
      },
      status: {
        title: user.isActive ? "Deactivate Account" : "Reactivate Account",
        message: `Are you sure you want to change the access status for ${user.email}?`,
        btnClass: user.isActive
          ? "bg-orange-500 hover:bg-orange-600"
          : "bg-emerald-600 hover:bg-emerald-700",
        fn: () => toggleUserStatus(user.id, user.isActive),
      },
      delete: {
        title: "Permanent Removal",
        message: `User ${user.email} will be purged. This action is irreversible.`,
        btnClass: "bg-red-600 hover:bg-red-700",
        fn: () => deleteUser(user.id),
      },
    };

    const action = map[type];
    setConfirmAction({
      ...action,
      onConfirm: async () => {
        setLoadingAction(true);
        const res = await action.fn();
        setLoadingAction(false);
        res.success
          ? toast.success("Operation Successful")
          : toast.error(res.message);
        if (res.success) setConfirmAction(null);
      },
    });
  };

  const columns = [
    {
      header: "User Identity",
      key: "name",
      render: (name, u) => (
        <div className="flex items-center gap-4 py-1">
          <div className="relative group">
            <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center font-black text-slate-500 text-xs border border-white shadow-sm transition-transform group-hover:scale-105">
              {(name || "??").slice(0, 2).toUpperCase()}
            </div>
            {u.role === "ADMIN" && (
              <div className="absolute -top-1 -right-1 bg-amber-400 text-white rounded-full p-1 border-2 border-white">
                <FiStar size={8} />
              </div>
            )}
          </div>
          <div>
            <p className="font-bold text-[15px] text-slate-800 leading-none mb-1.5">
              {name || "Unnamed Entity"}
            </p>
            <p className="text-xs font-medium text-slate-400 tracking-tight">
              {u.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Access Level",
      key: "role",
      render: (role, u) => (
        <button
          onClick={() => openConfirmModal(u, "role")}
          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:ring-4 ${
            role === "ADMIN"
              ? "bg-slate-900 text-white hover:ring-slate-100"
              : "bg-slate-100 text-slate-500 hover:ring-slate-50 border border-slate-200"
          }`}
        >
          {role}
        </button>
      ),
    },
    {
      header: "Security Status",
      key: "isActive",
      render: (active, u) => (
        <button
          onClick={() => openConfirmModal(u, "status")}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
            active
              ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          {active ? "Authorized" : "Suspended"}
        </button>
      ),
    },
    {
      header: "Management",
      align: "center",
      render: (_, u) => (
        <div className="flex justify-center gap-2">
          <IconBtn
            onClick={() => setSelectedUser(u)}
            className="hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            <FiEdit3 size={16} />
          </IconBtn>
          <IconBtn
            onClick={() => handlePrepareReset(u)}
            className="hover:bg-amber-50 hover:text-amber-600 transition-colors"
          >
            <FiKey size={16} />
          </IconBtn>
          <IconBtn
            danger
            onClick={() => openConfirmModal(u, "delete")}
            className="hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <FiTrash2 size={16} />
          </IconBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      <Toaster position="bottom-right" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <FiUsers className="text-slate-400" /> Directory Control
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage platform access and security protocols.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <FiUserPlus size={18} /> Add New Identity
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <SummaryCard
          icon={FiUsers}
          label="Total Population"
          value={totalUsers}
          color="bg-slate-500 text-slate-600"
          description="Registered users"
        />
        <SummaryCard
          icon={FiUserCheck}
          label="Authorized"
          value={activeUsers}
          color="bg-emerald-500 text-emerald-600"
          description="Active accounts"
        />
        <SummaryCard
          icon={FiUserX}
          label="Suspended"
          value={inactiveUsers}
          color="bg-rose-500 text-rose-600"
          description="Banned accounts"
        />
        <SummaryCard
          icon={FiStar}
          label="Administrators"
          value={adminUsers}
          color="bg-amber-500 text-amber-600"
          description="Privileged access"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <SmartTable data={users} columns={columns} />
      </div>

      {/* MODALS */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Identity"
      >
        <UserAddForm onClose={() => setIsAddOpen(false)} />
      </Modal>

      <Modal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        title="Modify Profile"
      >
        <UserEditForm
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      </Modal>

      {/* FIXED PASSWORD RESET MODAL */}
      <Modal
        isOpen={!!resetData}
        onClose={() => setResetData(null)}
        title="Security Protocol"
      >
        <div className="p-2">
          {resetData &&
            (!resetData.isSaved ? (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-amber-100 shadow-inner">
                  <FiRefreshCw
                    size={32}
                    className={resetData?.loading ? "animate-spin" : ""}
                  />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">
                  Reset Password?
                </h4>
                <p className="text-slate-500 text-sm mb-8 px-6 leading-relaxed">
                  Generate temporary access for{" "}
                  <span className="font-bold text-slate-800">
                    {resetData?.email}
                  </span>
                  ?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setResetData(null)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmReset}
                    disabled={resetData?.loading}
                    className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold shadow-lg shadow-amber-200"
                  >
                    {resetData?.loading ? "Processing..." : "Confirm"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-2">
                <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 block">
                    New Access Key
                  </label>
                  <div className="flex items-center justify-between gap-4 mb-8">
                    <span className="text-3xl font-black font-mono truncate">
                      {resetData?.password}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(resetData?.password);
                        toast.success("Copied");
                      }}
                      className="p-3 bg-white/10 rounded-xl"
                    >
                      <FiCopy size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => setResetData(null)}
                    className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title="Confirmation"
      >
        <div className="text-center p-2">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <FiAlertTriangle size={28} />
          </div>
          <h4 className="text-xl font-black text-slate-900 mb-2">
            {confirmAction?.title}
          </h4>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed px-4">
            {confirmAction?.message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold"
            >
              Abort
            </button>
            <button
              onClick={confirmAction?.onConfirm}
              disabled={loadingAction}
              className={`flex-1 py-4 text-white rounded-2xl font-bold shadow-lg ${confirmAction?.btnClass}`}
            >
              {loadingAction ? "Wait..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
