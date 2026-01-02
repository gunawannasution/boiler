"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { saveProduct } from "@/app/actions/productAction";
import {
  FiPackage,
  FiImage,
  FiX,
  FiPlus,
  FiLoader,
  FiTag,
  FiInfo,
  FiDollarSign,
  FiLayers,
} from "react-icons/fi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductForm({ product, onClose }) {
  const [isPending, startTransition] = useTransition();
  const [images, setImages] = useState(() => product?.image || []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: product || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset(product);
      setImages(product.image || []);
    }
  }, [product, reset]);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = (data) => {
    startTransition(async () => {
      try {
        await saveProduct({ ...data, image: images }, product?.id);
        onClose();
      } catch (error) {
        console.error(error);
      }
    });
  };

  const inputClass = `
        w-full p-3.5 bg-white border border-slate-200 rounded-xl 
        outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 
        transition-all duration-200 text-slate-700 placeholder:text-slate-400 text-sm
    `;

  const labelClass =
    "text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-2";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col h-full overflow-hidden bg-white"
    >
      {/* Header - Sticky on Mobile */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FiPackage size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            {product ? "Edit Product" : "New Product"}
          </h2>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Product Name */}
        <div className="group">
          <label className={labelClass}>
            <FiTag size={14} /> Product Name
          </label>
          <input
            {...register("name", { required: true })}
            placeholder="e.g. Premium Leather Bag"
            className={inputClass}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>
            <FiInfo size={14} /> Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Write something compelling..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Price & Stock - Side by side on Desktop, Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <label className={labelClass}>
              <FiDollarSign size={14} /> Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                IDR
              </span>
              <input
                type="number"
                {...register("price")}
                className={`${inputClass} pl-12`}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>
              <FiLayers size={14} /> Stock
            </label>
            <input
              type="number"
              {...register("stock")}
              className={inputClass}
            />
          </div>
        </div>

        {/* Image Gallery */}
        <div className="space-y-3">
          <label className={labelClass}>
            <FiImage size={14} /> Product Gallery
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            <AnimatePresence>
              {images.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-50 group shadow-sm"
                >
                  <Image
                    src={img}
                    alt="preview"
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                    className="absolute top-1.5 right-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <FiX size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <label className="aspect-square border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group">
              <div className="p-2 rounded-full bg-slate-50 group-hover:bg-indigo-100 transition-colors">
                <FiPlus className="text-slate-400 group-hover:text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-2 group-hover:text-indigo-600 uppercase">
                Add Image
              </span>
              <input
                type="file"
                multiple
                hidden
                onChange={handleUpload}
                accept="image/*"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Footer Actions - Sticky Bottom */}
      <div className="p-6 border-t border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 px-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex-[2] py-3.5 px-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <FiLoader className="animate-spin" />
                Processing...
              </>
            ) : product ? (
              "Update Changes"
            ) : (
              "Create Product"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
