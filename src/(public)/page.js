import prisma from "@/lib/prisma";
import Link from "next/link";
import { FiShoppingBag, FiArrowRight, FiCheck } from "react-icons/fi";

export const metadata = {
    title: "Modern Store 2026 | Beranda",
    description: "Belanja produk berkualitas dengan desain masa kini.",
};

export default async function HomePage() {
    // Ambil produk aktif dari database
    const products = await prisma.product.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
        take: 8, // Ambil 8 produk terbaru untuk beranda
    });

    return (
        <div className="bg-white min-h-screen font-sans text-slate-900">
            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-600">
                        MDRN<span className="text-slate-900">.SHOP</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition">
                            Dashboard
                        </Link>
                        <button className="relative p-2 bg-slate-100 rounded-2xl hover:bg-indigo-600 hover:text-white transition group">
                            <FiShoppingBag size={20} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white group-hover:bg-slate-900">
                                0
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 overflow-hidden relative">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-4 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6">
                            Koleksi Januari 2026
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8 tracking-tight">
                            Gaya Hidup <br /> <span className="text-indigo-400">Minimalis.</span>
                        </h1>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Dapatkan kurasi produk pilihan terbaik untuk menunjang produktivitas dan estetika harian Anda.
                        </p>
                        <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-400 hover:text-white transition-all shadow-xl shadow-indigo-500/10">
                            Belanja Sekarang <FiArrowRight />
                        </button>
                    </div>
                    {/* Dekorasi Background */}
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/20 to-transparent hidden md:block" />
                </div>
            </section>

            {/* --- PRODUCT GRID --- */}
            <section className="py-10 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-2">Produk Unggulan</h2>
                            <p className="text-slate-400 font-medium">Kualitas terbaik yang kami tawarkan minggu ini.</p>
                        </div>
                        <Link href="/products" className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-600 border-b-2 border-indigo-100 pb-1 hover:border-indigo-600 transition-all">
                            Lihat Semua <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-50 mt-20 py-20 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-black mb-4 tracking-tight">MDRN.SHOP</h2>
                    <p className="text-slate-400 text-sm mb-8">© 2026 Toko Online Masa Kini. All rights reserved.</p>
                    <div className="flex justify-center gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
                        <a href="#" className="hover:text-indigo-600">Instagram</a>
                        <a href="#" className="hover:text-indigo-600">Twitter</a>
                        <a href="#" className="hover:text-indigo-600">Bantuan</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- SUB-COMPONENT: PRODUCT CARD ---
function ProductCard({ product }) {
    const images = Array.isArray(product.image) ? product.image : [];
    const firstImage = images.length > 0 ? images[0] : null;

    return (
        <div className="group relative">
            <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2">
                {/* Image */}
                {firstImage ? (
                    <img
                        src={firstImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                )}

                {/* Floating Order Button (Hover Only) */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6">
                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                        Tambah ke Keranjang
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 px-2">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {product.name}
                    </h3>
                    <span className="font-black text-slate-900">
                        Rp{product.price.toLocaleString("id-ID")}
                    </span>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1">
                    <FiCheck className="text-emerald-500" /> Tersedia • {product.stock} Stok
                </p>
            </div>
        </div>
    );
}
