"use client";

import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Modal */}
            <div
                className="
          relative w-full md:max-w-xl
          max-h-[100dvh] md:max-h-[90vh]
          bg-white
          rounded-t-[2.5rem] md:rounded-[2.75rem]
          shadow-2xl
          flex flex-col
          animate-in slide-in-from-bottom md:zoom-in
        "
            >
                {/* Header (Fixed) */}
                <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-slate-100">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Body (Scrollable if needed) */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
