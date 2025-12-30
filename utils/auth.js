"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook untuk cek session & role
 * @param {string[]} allowedRoles - array role yang boleh akses
 */
export function useAuth(allowedRoles = []) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login"); // redirect kalau belum login
        else if (status === "authenticated" && allowedRoles.length && !allowedRoles.includes(session.user.role)) {
            router.push("/dashboard"); // redirect kalau role tidak sesuai
        }
    }, [status, session]);

    return { session, status };
}
