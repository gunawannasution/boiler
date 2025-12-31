"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogOut, User, Shield } from "lucide-react";

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();

    if (["/login", "/register"].includes(pathname)) return null;

    return (
        <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex h-16 items-center justify-between px-4 sm:px-8">
                <Link href="/" className="group flex items-center gap-2">
                    {/* <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-indigo-200 transition-transform group-hover:scale-110">
                        <Shield size={18} />
                    </div> */}
                    <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                        Dashboard <span className="text-indigo-600"></span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {session ? (
                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{session.user.name}</p>
                                <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500">{session.user.role}</p>
                            </div>
                            <button
                                onClick={() => signOut({ callbackUrl: "/login" })}
                                className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-red-50 hover:text-red-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-900/20"
                            >
                                <LogOut size={18} />
                                {/* <span className="hidden md:inline">Keluar</span> */}
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">Masuk</Link>
                            <Link href="/register" className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95">Daftar</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
