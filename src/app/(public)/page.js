import prisma from "../../../lib/prisma";
import ShopeeHomeClient from "./ShopeeHomeClient";

export const metadata = {
  title: "TokoMurah | Belanja Online",
};

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      image: true,
    },
  });

  return <ShopeeHomeClient products={products} />;
}
