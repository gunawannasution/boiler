"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Guard halaman berdasarkan session & role
 * @param {Object|null} session
 * @param {string[]} allowedRoles
 */
export default function useAuthGuard(session, allowedRoles = []) {
    const router = useRouter();

    useEffect(() => {
        if (!session) {
            router.replace("/login");
            return;
        }

        if (
            allowedRoles.length > 0 &&
            !allowedRoles.includes(session.user.role)
        ) {
            router.replace("/unauthorized");
        }
    }, [session, allowedRoles, router]); // ✅ lengkap
}
