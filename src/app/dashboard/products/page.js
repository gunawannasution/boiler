import prisma from "../../../../lib/prisma";
import ProductTable from "./ProductTable";

export default async function Page() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: "desc" }
    });

    // Gunakan JSON.parse/stringify untuk menetralkan objek Date Prisma agar aman dikirim ke Client
    const safeProducts = JSON.parse(JSON.stringify(products));

    return (
        <div className="mx-auto p-6 md:p-8">
            <ProductTable products={safeProducts} />
        </div>
    );
}
