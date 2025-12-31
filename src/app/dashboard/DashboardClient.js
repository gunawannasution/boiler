"use client";

import {
    FiUsers,
    FiShoppingCart,
    FiDollarSign,
    FiPackage
} from "react-icons/fi";

import StatCard from "../components/ui/StatCard";
// import DashboardHeader from "./DashboardHeader";

export default function DashboardClient({ session }) {
    const userName = session?.user?.name || "User";
    const role = session?.user?.role || "USER";

    return (
        <div className="space-y-8">
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-sm text-slate-500">
                    Ringkasan aktivitas toko hari ini
                </p>
            </div>

            {/* Welcome Header */}
            {/* <DashboardHeader userName={userName} role={role} /> */}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    title="Total Pesanan"
                    value="1.248"
                    icon={FiShoppingCart}
                    accent="indigo"
                />
                <StatCard
                    title="Pendapatan"
                    value="Rp 128.450.000"
                    icon={FiDollarSign}
                    accent="emerald"
                />
                <StatCard
                    title="Produk Aktif"
                    value="342"
                    icon={FiPackage}
                    accent="amber"
                />
                <StatCard
                    title="Pelanggan"
                    value="856"
                    icon={FiUsers}
                    accent="rose"
                />
            </div>

            {/* Placeholder */}
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-500">
                    Grafik penjualan dan aktivitas terbaru akan ditampilkan di sini
                </p>
            </div>
        </div>
    );
}
