"use client";

import { useState, useMemo } from "react";
import Modal from "@/app/components/ui/Modal";
import ProductForm from "./ProductForm";
import SmartTable from "@/app/components/ui/SmartTable";
import { deleteProduct, toggleProductStatus } from "@/app/actions/productAction";
import Image from "next/image"; // Impor komponen Image

export default function ProductTable({ products }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleEdit = (item) => {
        setSelected(item);
        setIsOpen(true);
    };

    const handleAdd = () => {
        setSelected(null);
        setIsOpen(true);
    };

    // Konfigurasi Kolom
    const columns = useMemo(() => [
        {
            header: "Gambar",
            key: "image",
            render: (imageValue) => {
                const imgs = Array.isArray(imageValue) ? imageValue : [];
                return (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                        {imgs.length > 0 ? (
                            <Image
                                src={imgs[0]}
                                alt="product"
                                fill
                                unoptimized // Tambahkan ini jika menggunakan Base64
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400 font-bold">NULL</div>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Info Produk",
            key: "name",
            render: (name, item) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 leading-tight">{name}</span>
                    <span className="text-[10px] text-slate-400 font-black uppercase">Stok: {item.stock}</span>
                </div>
            )
        },
        {
            header: "Harga",
            key: "price",
            render: (v) => <span className="font-semibold text-slate-600">Rp {v.toLocaleString("id-ID")}</span>
        },
        {
            header: "Status",
            key: "isActive",
            className: "text-center",
            render: (isActive, item) => (
                <div className="flex justify-center items-center w-full">
                    <button
                        onClick={async () => {
                            try {
                                await toggleProductStatus(item.id, isActive);
                            } catch (err) {
                                alert("Gagal memperbarui status");
                            }
                        }}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isActive
                            ? "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500"
                            }`}
                    >
                        {isActive ? "● Aktif" : "○ Nonaktif"}
                    </button>
                </div>
            )
        },
        {
            header: "Aksi",
            className: "text-right",
            render: (_, item) => (
                <div className="flex gap-4 justify-end items-center w-full">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-indigo-600 font-black text-[11px] uppercase tracking-widest hover:text-indigo-800"
                    >
                        Edit
                    </button>
                    <button
                        onClick={async () => {
                            if (confirm(`Hapus produk ${item.name}?`)) await deleteProduct(item.id);
                        }}
                        className="text-red-500 font-black text-[11px] uppercase tracking-widest hover:text-red-700"
                    >
                        Hapus
                    </button>
                </div>
            )
        }
    ], []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Produk</h1>
                <button
                    onClick={handleAdd}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                >
                    + Tambah Produk
                </button>
            </div>

            <SmartTable data={products} columns={columns} />

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title={selected ? "Edit Detail Produk" : "Tambah Produk Baru"}
            >
                <ProductForm
                    product={selected}
                    onClose={() => setIsOpen(false)}
                />
            </Modal>
        </div>
    );
}
