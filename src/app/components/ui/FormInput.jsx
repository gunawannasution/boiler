"use client";

export default function FormInput({
    type = "text",
    placeholder,
    value,
    onChange,
    label,
    id,
    error,
    className = "",
    ...props
}) {
    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={id}
                    className="
                        block mb-1.5
                        text-xs font-semibold
                        text-slate-600 dark:text-slate-400
                    "
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`
                    w-full
                    min-h-11                 /* Touch target mobile */
                    px-4
                    text-sm
                    text-slate-800 dark:text-white
                    bg-white dark:bg-slate-800
                    border
                    rounded-xl
                    transition
                    outline-none
                    placeholder:text-slate-400

                    ${error
                        ? "border-red-400 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500"
                    }

                    focus:ring-2 focus:border-transparent
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${className}
                `}
                {...props}
            />

            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1 text-xs text-red-500"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
