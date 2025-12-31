import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path ini
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    // Proteksi level server: 0ms Flicker
    if (!session) {
        redirect("/login");
    }

    return <DashboardClient session={session} />;
}
