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
    updateUserRole
} from "@/app/actions/userActions";
import toast, { Toaster } from "react-hot-toast";
import {
    FiUserPlus,
    FiKey,
    FiTrash2,
    FiEdit3,
    FiShield,
    FiCheckCircle,
    FiCopy,
    FiRefreshCw,
    FiAlertTriangle,
    FiUsers,
    FiUserCheck,
    FiUserX,
    FiStar
} from "react-icons/fi";

/* =========================
   SUMMARY CARD
========================= */
const SummaryCard = ({ icon: Icon, label, value, color }) => (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-100 border border-slate-50 p-5">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.08]`} />
        <div className="relative flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} text-white`}>
                <Icon size={22} />
            </div>
            <div>
                <p className="text-[11px] uppercase tracking-widest font-black text-slate-400">
                    {label}
                </p>
                <p className="text-2xl font-black text-slate-900">
                    {value}
                </p>
            </div>
        </div>
    </div>
);

export default function UserManagement({ users = [] }) {
    const [selectedUser, setSelectedUser] = useState(null);
    const [resetData, setResetData] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [loadingAction, setLoadingAction] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);

    /* =========================
       SUMMARY COUNTS
    ========================= */
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;
    const adminUsers = users.filter(u => u.role === "ADMIN").length;

    /* =========================
       RESET PASSWORD
    ========================= */
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
            loading: false
        });
    };

    const handleConfirmReset = async () => {
        setResetData(p => ({ ...p, loading: true }));
        const res = await updatePassword(resetData.userId, resetData.password);

        if (res?.success) {
            setResetData(p => ({ ...p, isSaved: true, loading: false }));
            toast.success("Password berhasil diperbarui");
        } else {
            toast.error(res?.message || "Gagal reset password");
            setResetData(null);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Password disalin");
    };

    /* =========================
       CONFIRM MODAL
    ========================= */
    const openConfirmModal = (user, type) => {
        const map = {
            role: {
                title: "Ubah Hak Akses",
                message: `Ubah ${user.email} menjadi ${user.role === "ADMIN" ? "USER" : "ADMIN"
                    }?`,
                btnClass: "bg-indigo-600 hover:bg-indigo-700",
                fn: () =>
                    updateUserRole(
                        user.id,
                        user.role === "ADMIN" ? "USER" : "ADMIN"
                    )
            },
            status: {
                title: user.isActive ? "Nonaktifkan Akun" : "Aktifkan Akun",
                message: `Status akun ${user.email} akan diubah`,
                btnClass: user.isActive
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-green-600 hover:bg-green-700",
                fn: () => toggleUserStatus(user.id, user.isActive)
            },
            delete: {
                title: "Hapus Permanen",
                message: `User ${user.email} akan dihapus selamanya`,
                btnClass: "bg-red-600 hover:bg-red-700",
                fn: () => deleteUser(user.id)
            }
        };

        const action = map[type];
        setConfirmAction({
            ...action,
            onConfirm: async () => {
                setLoadingAction(true);
                const res = await action.fn();
                setLoadingAction(false);
                res.success ? toast.success("Berhasil") : toast.error(res.message);
                if (res.success) setConfirmAction(null);
            }
        });
    };

    /* =========================
       TABLE COLUMNS
    ========================= */
    const columns = [
        {
            header: "Pengguna",
            key: "name",
            render: (name, u) => (
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex w-10 h-10 rounded-2xl bg-slate-100 items-center justify-center font-black text-slate-400 text-xs">
                        {(name || "??").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{name || "No Name"}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Role",
            key: "role",
            align: "center",
            render: (role, u) => (
                <button
                    onClick={() => openConfirmModal(u, "role")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${role === "ADMIN"
                        ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                        : "bg-slate-50 text-slate-500 border-slate-100"
                        }`}
                >
                    <FiShield size={12} />
                    {role}
                </button>
            )
        },
        {
            header: "Status",
            key: "isActive",
            align: "center",
            render: (active, u) => (
                <button
                    onClick={() => openConfirmModal(u, "status")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${active
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-red-50 text-red-700 border-red-100"
                        }`}
                >
                    <span
                        className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500 animate-pulse" : "bg-red-500"
                            }`}
                    />
                    {active ? "Aktif" : "Banned"}
                </button>
            )
        },
        {
            header: "Aksi",
            align: "center",
            render: (_, u) => (
                <div className="flex justify-center gap-1">
                    <IconBtn title="Edit" onClick={() => setSelectedUser(u)}>
                        <FiEdit3 size={18} />
                    </IconBtn>
                    <IconBtn title="Reset Password" onClick={() => handlePrepareReset(u)}>
                        <FiKey size={18} />
                    </IconBtn>
                    <IconBtn
                        danger
                        title="Hapus"
                        onClick={() => openConfirmModal(u, "delete")}
                    >
                        <FiTrash2 size={18} />
                    </IconBtn>
                </div>
            )
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-14 space-y-10">
            <Toaster position="top-right" />

            {/* HEADER */}
            <div className="pt-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900">
                        User Management
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 italic mt-2">
                        Security, role, dan kontrol akses pengguna
                    </p>
                </div>

                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-3 bg-slate-900 hover:bg-indigo-600 text-white px-7 py-4 rounded-2xl font-bold shadow-2xl transition active:scale-95"
                >
                    <FiUserPlus size={22} />
                    Tambah User
                </button>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard icon={FiUsers} label="Total" value={totalUsers} color="from-slate-900 to-slate-700" />
                <SummaryCard icon={FiUserCheck} label="Active" value={activeUsers} color="from-green-500 to-emerald-500" />
                <SummaryCard icon={FiUserX} label="Inactive" value={inactiveUsers} color="from-red-500 to-rose-500" />
                <SummaryCard icon={FiStar} label="Admin" value={adminUsers} color="from-indigo-500 to-purple-500" />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-100 overflow-hidden">
                <SmartTable
                    columns={columns}
                    data={users}
                    rowClass={(u) =>
                        u && !u.isActive ? "opacity-70 bg-slate-50/50" : ""
                    }
                    emptyMessage="Belum ada user"
                />
            </div>

            {/* MODALS */}
            <Modal isOpen={!!resetData} onClose={() => setResetData(null)} title="Reset Password">
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-center">
                        <p className="text-indigo-300 text-[10px] uppercase tracking-widest font-black">
                            Generated Password
                        </p>
                        <div className="flex justify-center items-center gap-3 mt-2">
                            <code className="text-2xl font-mono font-bold text-white tracking-widest">
                                {resetData?.password}
                            </code>
                            <button
                                onClick={() => copyToClipboard(resetData?.password)}
                                className="text-slate-400 hover:text-white"
                            >
                                <FiCopy size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setResetData(null)}
                            className="flex-1 py-4 font-bold text-slate-400"
                        >
                            Batal
                        </button>
                        {!resetData?.isSaved && (
                            <button
                                onClick={handleConfirmReset}
                                disabled={resetData?.loading}
                                className="flex-2 py-4 bg-slate-900 text-white rounded-2xl font-bold flex justify-center items-center gap-2"
                            >
                                {resetData?.loading ? (
                                    <FiRefreshCw className="animate-spin" />
                                ) : (
                                    "Aktifkan"
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>

            <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Tambah User">
                <UserAddForm onSuccess={() => setIsAddOpen(false)} />
            </Modal>

            <Modal isOpen={!!selectedUser} onClose={() => setSelectedUser(null)} title="Edit User">
                <UserEditForm user={selectedUser} onSuccess={() => setSelectedUser(null)} />
            </Modal>
        </div>
    );
}
