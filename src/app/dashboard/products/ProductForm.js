"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { saveProduct } from "@/app/actions/productAction";
import { FiPackage, FiImage, FiX, FiPlus } from "react-icons/fi";
import Image from "next/image";

export default function ProductForm({ product, onClose }) {
    const [isPending, startTransition] = useTransition();

    // Inisialisasi state images langsung dari props untuk menghindari setState di useEffect
    const [images, setImages] = useState(() => product?.image || []);

    const { register, handleSubmit, reset } = useForm({
        // Inisialisasi default values langsung di useForm
        defaultValues: product || {
            name: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0
        }
    });

    // useEffect hanya digunakan jika prop 'product' berubah secara eksternal (misal: ganti data saat modal terbuka)
    useEffect(() => {
        if (product) {
            reset(product);
            setImages(product.image || []);
        } else {
            reset({ name: "", slug: "", description: "", price: 0, stock: 0 });
            setImages([]);
        }
    }, [product, reset]);

    const handleUpload = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setImages(prev => [...prev, reader.result]);
            reader.readAsDataURL(file);
        });
    };

    const onSubmit = (data) => {
        startTransition(async () => {
            try {
                await saveProduct({ ...data, image: images }, product?.id);
                onClose();
            } catch (error) {
                alert(error.message);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Nama Produk</label>
                <input {...register("name")} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500 text-slate-900" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Slug</label>
                <input {...register("slug")} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500 text-slate-900" />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400">Deskripsi</label>
                <input {...register("description")} className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 ring-indigo-500 text-slate-900" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Harga</label>
                    <input type="number" {...register("price")} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-900" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Stok</label>
                    <input type="number" {...register("stock")} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-900" />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2"><FiImage /> Galeri</label>
                <div className="grid grid-cols-4 gap-2">
                    {images.map((img, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100">
                            {/* Perbaikan: Menggunakan Next.js Image dengan alt prop */}
                            <Image
                                src={img}
                                alt={`Preview produk ${i + 1}`}
                                fill
                                unoptimized // Karena kita menggunakan Base64/Blob lokal
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 z-10 hover:bg-red-600 transition-colors"
                            >
                                <FiX size={10} />
                            </button>
                        </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                        <FiPlus className="text-slate-400" />
                        <input type="file" multiple hidden onChange={handleUpload} accept="image/*" />
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all disabled:opacity-50"
            >
                {isPending ? "Memproses..." : product ? "Update Produk" : "Tambah Produk"}
            </button>
        </form>
    );
}
