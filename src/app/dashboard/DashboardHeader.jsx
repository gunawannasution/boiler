"use client";

export default function DashboardHeader({ userName, role }) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-xl shadow-slate-200/60">
            <div className="p-6 sm:p-8">
                <p className="text-slate-600 text-sm">
                    Selamat datang kembali,{userName}
                </p>

                {/* <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {userName}
                </h2> */}

                <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                    Role: {role}
                </div>
            </div>

            {/* Decorative gradient */}
            <div className="absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-indigo-100/60 to-transparent pointer-events-none" />
        </div>
    );
}
