"use client";

export default function Button({
    type = "button",
    children,
    onClick,
    variant = "primary", // primary | secondary | outline
    size = "md", // sm | md | lg
    className = "",
    disabled = false,
}) {
    /**
     * Base:
     * - min-h-[44px] → standar touch target mobile
     * - inline-flex + items-center → konsisten untuk icon + text
     * - select-none → mencegah highlight aneh di mobile
     */
    const baseClasses = `
        inline-flex items-center justify-center
        font-semibold rounded-lg
        min-h-[44px]
        select-none
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-70
        dark:focus:ring-offset-slate-900
    `;

    /**
     * Size:
     * Padding & font disesuaikan agar tetap nyaman di HP
     */
    const sizeClasses = {
        sm: "px-3 text-xs",
        md: "px-4 text-sm",
        lg: "px-6 text-base",
    };

    /**
     * Variant:
     * Kontras aman untuk mobile & dark mode
     */
    const variantClasses = {
        primary: `
            bg-indigo-600 text-white
            hover:bg-indigo-700
            focus:ring-indigo-500
            disabled:bg-indigo-400
        `,
        secondary: `
            bg-slate-100 text-slate-800
            hover:bg-slate-200
            focus:ring-slate-500
            dark:bg-slate-800 dark:text-slate-200
            dark:hover:bg-slate-700
            disabled:bg-slate-200 dark:disabled:bg-slate-800
        `,
        outline: `
            border border-indigo-600
            text-indigo-600
            hover:bg-indigo-50
            focus:ring-indigo-500
            dark:hover:bg-indigo-50/10
        `,
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${baseClasses}
                ${sizeClasses[size]}
                ${variantClasses[variant]}
                ${className}
            `}
        >
            {children}
        </button>
    );
}