"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
    LayoutDashboard,
    Home,
    ShieldCheck,
    Users,
    LogOut,
    ChevronLeft,
    Menu,
    Settings,
    CircleUser
} from "lucide-react";

export default function Sidebar() {
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const menuItems = [
        { name: "Beranda", href: "/", icon: Home },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    const adminItems = [
        { name: "Admin Panel", href: "/admin", icon: ShieldCheck },
        { name: "Kelola User", href: "/admin/users", icon: Users },
    ];

    return (
        <aside
            className={`relative flex flex-col bg-slate-950 text-slate-300 transition-all duration-300 ease-in-out min-h-screen border-r border-slate-800 z-50 ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Tombol Toggle Collapse */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1 shadow-xl z-50 transition-transform active:scale-90"
            >
                {isCollapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
            </button>

            {/* Header / Logo */}
            <div className="p-6 mb-6 flex items-center gap-3 overflow-hidden">
                <div className="bg-indigo-600 p-2 rounded-xl shrink-0 shadow-lg shadow-indigo-500/20">
                    <Settings className="text-white" size={24} />
                </div>
                {!isCollapsed && (
                    <span className="font-black text-xl text-white tracking-tight animate-in fade-in duration-500">
                        PRO<span className="text-indigo-500">DASH</span>
                    </span>
                )}
            </div>

            {/* Navigasi Utama */}
            <nav className="flex-1 px-3 space-y-1.5">
                <p className={`px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ${isCollapsed && "text-center px-0"}`}>
                    {isCollapsed ? "•••" : "Menu Utama"}
                </p>

                {menuItems.map((item) => (
                    <SidebarLink
                        key={item.name}
                        item={item}
                        isCollapsed={isCollapsed}
                        active={isActive(item.href)}
                    />
                ))}

                {/* Khusus Admin */}
                {session?.user?.role === "ADMIN" && (
                    <div className="pt-8">
                        <p className={`px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ${isCollapsed && "text-center px-0"}`}>
                            {isCollapsed ? "•••" : "Administrator"}
                        </p>
                        {adminItems.map((item) => (
                            <SidebarLink
                                key={item.name}
                                item={item}
                                isCollapsed={isCollapsed}
                                active={isActive(item.href)}
                            />
                        ))}
                    </div>
                )}
            </nav>

            {/* Bagian Bawah: Profil & Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/30">
                <div className={`flex items-center gap-3 mb-4 px-2 ${isCollapsed && "justify-center px-0"}`}>
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                        <CircleUser size={20} className="text-indigo-400" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden animate-in slide-in-from-left-2">
                            <span className="text-sm font-bold text-white truncate">{session?.user?.name || "Guest"}</span>
                            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{session?.user?.role || "User"}</span>
                        </div>
                    )}
                </div>

                {session && (
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-red-500/10 hover:text-red-500 ${isCollapsed ? "justify-center" : ""
                            }`}
                    >
                        <LogOut size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
                        {!isCollapsed && <span className="text-sm font-bold">Keluar</span>}
                    </button>
                )}
            </div>
        </aside>
    );
}

// Sub-komponen Link untuk kode yang lebih rapi
function SidebarLink({ item, isCollapsed, active }) {
    return (
        <Link
            href={item.href}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "hover:bg-slate-800/50 hover:text-white text-slate-400"
                } ${isCollapsed ? "justify-center" : ""}`}
        >
            <item.icon
                size={20}
                className={`shrink-0 transition-transform group-hover:scale-110 ${active ? "text-white" : "group-hover:text-indigo-400"}`}
            />
            {!isCollapsed && <span className="text-sm font-semibold tracking-wide">{item.name}</span>}

            {/* Tooltip saat collapsed (opsional) */}
            {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-1 bg-slate-800 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-100">
                    {item.name}
                </div>
            )}
        </Link>
    );
}
