"use client";

import { useEffect, useState } from "react";

/**
 * Toast
 * ----------------------------------------------------
 * props:
 * - message: string
 * - type: info | success | error
 * - duration: number (ms)
 */
export default function Toast({
    message,
    type = "info",
    duration = 3000,
}) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration);
        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    const typeClasses = {
        success: "bg-emerald-600",
        error: "bg-red-600",
        info: "bg-indigo-600",
    };

    const icon = {
        success: "✓",
        error: "✕",
        info: "ℹ",
    };

    return (
        <div
            className="
                fixed z-9999
                bottom-4 inset-x-4
                sm:bottom-6 sm:right-6 sm:left-auto
                max-w-full sm:max-w-sm
                animate-in fade-in slide-in-from-bottom-4 duration-200
            "
            role="status"
            aria-live="polite"
        >
            <div
                className={`
                    flex items-start gap-3
                    px-4 py-3
                    rounded-xl
                    shadow-lg
                    text-white
                    text-sm
                    ${typeClasses[type]}
                `}
            >
                {/* Icon */}
                <span className="mt-0.5 font-bold">{icon[type]}</span>

                {/* Message */}
                <p className="flex-1 leading-snug">{message}</p>

                {/* Close (opsional, tapi mobile-friendly) */}
                <button
                    onClick={() => setVisible(false)}
                    aria-label="Tutup notifikasi"
                    className="
                        ml-2
                        min-w-8 min-h-8
                        flex items-center justify-center
                        rounded-md
                        text-white/80
                        hover:text-white
                        transition
                        active:scale-95
                    "
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
