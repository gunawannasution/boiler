"use client";

import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout wrapper untuk semua halaman
 */
export default function Layout({ children }) {
    return (
        <div>
            {/* <Header /> */}
            <main style={{ padding: "20px", minHeight: "80vh" }}>{children}</main>
            <Footer />
        </div>
    );
}
