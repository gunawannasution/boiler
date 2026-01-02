"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Search } from "lucide-react";

export default function ShopeeHomeClient({ products }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-orange-500 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white font-bold text-lg">
            TokoMurah
          </Link>

          <div className="flex-1 relative">
            <input
              placeholder="Cari produk..."
              className="w-full h-10 rounded-sm pl-10 pr-3 text-sm outline-none"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <ShoppingCart className="text-white" />
        </div>
      </header>

      {/* BANNER */}
      <div className="px-4 py-4">
        <div className="h-36 bg-orange-200 rounded-md flex items-center justify-center font-bold">
          PROMO HARI INI 🔥
        </div>
      </div>

      {/* PRODUCT GRID */}
      <section className="px-2 pb-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-sm overflow-hidden shadow-sm">
      <div className="relative aspect-square">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-2">
        <p className="text-sm line-clamp-2 leading-snug mb-1">{product.name}</p>

        <p className="text-orange-500 font-bold text-sm">
          Rp {product.price.toLocaleString("id-ID")}
        </p>

        <p className="text-xs text-gray-400 mb-2">Stok {product.stock}</p>

        <button className="w-full text-xs bg-orange-500 text-white py-2 rounded-sm hover:bg-orange-600">
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}
