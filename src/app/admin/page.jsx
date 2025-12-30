"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") router.push("/login");
        if (status === "authenticated" && session.user.role !== "ADMIN") router.push("/dashboard");
    }, [status, session]);

    if (status === "loading") return <p>Loading...</p>;

    return (
        <div style={{ margin: "50px" }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome, {session.user.name}</p>
            <Button onClick={() => signOut({ callbackUrl: "/login" })}>Logout</Button>
        </div>
    );
}
