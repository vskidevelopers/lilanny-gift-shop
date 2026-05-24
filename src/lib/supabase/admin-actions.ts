/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { adminDb } from "@/lib/supabase/admin-client";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { supabase } from "./client";

// --- CATEGORIES ---
export async function getCategories() {
  const { data, error } = await adminDb
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertCategory(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name?.trim()) return { error: "Name is required" };

  const slug = slugify(name, { lower: true, strict: true });
  const { error } = await adminDb.from("categories").upsert(
    {
      name,
      slug,
      description: (formData.get("description") as string) || null,
      image_url: (formData.get("image_url") as string) || null,
    },
    { onConflict: "slug" },
  );

  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { error } = await adminDb.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/categories");
  return { success: true };
}

// --- PRODUCTS ---
export async function getProducts() {
  const { data, error } = await adminDb
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function upsertProduct(formData: FormData) {
  const id = formData.get("id") as string | null;
  const existingSlug = formData.get("slug") as string | null;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));

  if (!name || isNaN(price)) return { error: "Name & valid price required" };

  // ✅ Preserve slug on edit, generate on create
  const slug =
    existingSlug ||
    `${slugify(name, { lower: true, strict: true })}-${Date.now().toString(36)}`;

  const rawCategoryId = formData.get("category_id") as string;
  const categoryId =
    rawCategoryId === "none" || !rawCategoryId ? null : rawCategoryId;
  const tags = ((formData.get("tags") as string) || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const images = ((formData.get("images") as string) || "")
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  const productData: any = {
    id: id || undefined, // Only include id on edit
    name,
    slug, // ✅ Always present now
    description: formData.get("description") as string,
    price,
    sale_price: Number(formData.get("sale_price")) || null,
    category_id: categoryId,
    tags,
    images,
    is_active: formData.get("is_active") === "true",
  };

  const { error } = await adminDb.from("products").upsert(productData, {
    onConflict: "id",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/admin/products/edit/[id]", "page");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { error } = await adminDb.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  return { success: true };
}
