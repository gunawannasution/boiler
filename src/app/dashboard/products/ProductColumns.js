"use client";
import Image from "next/image";
export default function getProductColumn({ onEdit, onDelete }) {
    return [
        {
            header: "Gambar",
            key: "image",
            render: (imageArray) => {
                // Sesuai model: image adalah String[]
                const hasImage = Array.isArray(imageArray) && imageArray.length > 0;
                const firstImage = hasImage ? imageArray[0] : null;

                return (
                    <div className="relative group w-12 h-12">
                        <div className="w-full h-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                            {hasImage ? (
                                <Image src={firstImage} className="w-full h-full object-cover" alt="Product" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">NO IMG</div>
                            )}
                        </div>
                        {/* Indikator jika ada lebih dari 1 gambar */}
                        {imageArray?.length > 1 && (
                            <div className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                {imageArray.length}
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Nama Produk",
            key: "name",
            render: (name, item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700">{name}</span>
                    <span className="text-[10px] text-slate-400 font-black">STOK: {item.stock}</span>
                </div>
            )
        },
        {
            header: "Harga",
            key: "price",
            render: (price) => (
                <span className="font-semibold text-slate-600">
                    Rp {price.toLocaleString("id-ID")}
                </span>
            )
        },
        {
            header: "Aksi",
            key: "id",
            className: "text-right",
            render: (id, item) => (
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={() => onEdit(item)}
                        className="text-indigo-600 font-bold text-xs uppercase hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(id)}
                        className="text-red-500 font-bold text-xs uppercase hover:underline"
                    >
                        Hapus
                    </button>
                </div>
            )
        }
    ];
}
