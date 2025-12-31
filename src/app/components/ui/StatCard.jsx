"use client";

export default function StatCard({ title, value, icon: Icon, accent = "indigo" }) {
    const accentMap = {
        indigo: "bg-indigo-50 text-indigo-600",
        emerald: "bg-emerald-50 text-emerald-600",
        amber: "bg-amber-50 text-amber-600",
        rose: "bg-rose-50 text-rose-600"
    };

    return (
        <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
            <div className="p-6 flex items-center gap-4">
                <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${accentMap[accent]}`}
                >
                    <Icon size={22} />
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {title}
                    </p>
                    <p className="mt-1 text-xl font-extrabold text-slate-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}
