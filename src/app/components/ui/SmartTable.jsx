"use client";

/**
 * SmartTable
 * ------------------------------------------------------
 * - Mobile friendly (horizontal scroll aman)
 * - Touch target nyaman
 * - Responsif dari HP kecil sampai desktop
 * - Fleksibel via konfigurasi kolom
 *
 * @param {Array} columns - [{ header, key, render?, className? }]
 * @param {Array} data - Data array dari database
 * @param {Function} rowClass - (item) => string (opsional)
 * @param {string} emptyMessage - Pesan data kosong
 */
export default function SmartTable({
    columns,
    data = [],
    rowClass,
    emptyMessage = "Data tidak ditemukan",
}) {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Wrapper scroll horizontal khusus mobile */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 will-change-scroll">
                <table className="w-full text-left border-collapse min-w-130 sm:min-w-150">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    scope="col"
                                    className={`
                                        px-4 md:px-6 py-3 md:py-4
                                        text-[10px] md:text-xs
                                        font-bold uppercase tracking-wide
                                        text-slate-500
                                        whitespace-nowrap
                                        ${col.className || ""}
                                    `}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-50">
                        {data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id ?? rowIndex}
                                    className={`
                                        transition-colors
                                        hover:bg-slate-50/60
                                        ${rowClass ? rowClass(item) : ""}
                                    `}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`
                                                px-4 md:px-6 py-3 md:py-4
                                                text-sm text-slate-700
                                                whitespace-normal
                                                ${col.className || ""}
                                            `}
                                        >
                                            {/* Touch target nyaman di mobile */}
                                            <div className="min-h-11 flex items-center">
                                                {col.render
                                                    ? col.render(item[col.key], item)
                                                    : item[col.key]}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-6 py-14 text-center text-slate-400"
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-2xl">📦</span>
                                        <p className="text-sm">{emptyMessage}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Hint scroll khusus mobile */}
            <div className="md:hidden bg-slate-50 px-4 py-2 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold italic">
                    ← Geser untuk melihat detail →
                </p>
            </div>
        </div>
    );
}
