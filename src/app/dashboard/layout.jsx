import SessionWrapper from "../SessionWrapper";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout({ children }) {
    return (
        <div>
            <SessionWrapper><div style={{ display: "flex", minHeight: "100vh" }}>
                {/* Sidebar kiri */}
                <Sidebar />

                {/* Konten utama */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Header />
                    <main style={{ flex: 1, padding: "20px" }}>{children}</main>
                    <Footer />
                </div>
            </div></SessionWrapper>
        </div>
    );
}
