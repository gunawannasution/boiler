"use server";

import prisma from "../../../lib/prisma";
import { revalidatePath } from "next/cache";

// Helper untuk membuat slug
const slugify = (text) =>
    text.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

/* SAVE: Create & Update */
export async function saveProduct(data, id = null) {
    const { name, price, stock, image, description, isActive } = data;

    if (!name) throw new Error("Nama wajib diisi");

    const payload = {
        name,
        slug: slugify(name),
        description: description || "",
        price: Number(price || 0),
        stock: Number(stock || 0),
        image: Array.isArray(image) ? image : (image ? [image] : []),
        isActive: Boolean(isActive),
    };

    if (id) {
        await prisma.product.update({
            where: { id: Number(id) },
            data: payload
        });
    } else {
        await prisma.product.create({
            data: payload
        });
    }

    revalidatePath("/dashboard/products");
}

/* TOGGLE STATUS: Aktif/Nonaktif cepat */
export async function toggleProductStatus(id, currentStatus) {
    await prisma.product.update({
        where: { id: Number(id) },
        data: { isActive: !currentStatus }
    });
    revalidatePath("/dashboard/products");
}

/* DELETE */
export async function deleteProduct(id) {
    if (!id) return;
    await prisma.product.delete({
        where: { id: Number(id) }
    });
    revalidatePath("/dashboard/products");
}
