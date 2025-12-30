"use client";

export default function Button({
    type = "button",
    children,
    onClick,
    variant = "primary", // primary | secondary | outline
    size = "md", // sm | md | lg
    className = "",
    disabled = false
}) {
    const baseClasses = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900";
    const sizeClasses = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };
    const variantClasses = {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400",
        secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-500 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:bg-slate-200 dark:disabled:bg-slate-800",
        outline: "border border-indigo-600 text-indiko-600 hover:bg-indigo-50 dark:hover:bg-indigo-50/10 focus:ring-indigo-500"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        >
            {children}
        </button>
    );
}