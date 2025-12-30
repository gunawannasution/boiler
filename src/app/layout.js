import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionWrapper from "./SessionWrapper";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "My App",
  description: "Professional Next.js App with Sidebar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased text-slate-900">
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
