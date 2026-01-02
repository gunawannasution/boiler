import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // PROTEKSI ROLE: Cek jika path dimulai dengan /dashboard/product
    // dan pastikan role-nya adalah ADMIN
    if (path.startsWith("/dashboard/products") && token?.role !== "ADMIN") {
      // Jika bukan admin, redirect ke halaman "Access Denied" atau Dashboard Utama
      return NextResponse.redirect(
        new URL("/dashboard?error=unauthorized", req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Step 1: Pastikan user login (token ada)
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/profile/:path*"],
};
