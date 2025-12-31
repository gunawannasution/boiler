"use client";

export default function IconBtn({
    children,
    onClick,
    danger = false,
    title
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2.5 rounded-xl transition-all active:scale-90 ${danger
                    ? "text-slate-400 hover:text-red-600 hover:bg-red-50"
                    : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
        >
            {children}
        </button>
    );
}
