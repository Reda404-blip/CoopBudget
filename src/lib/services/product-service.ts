import { supabase } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("name")

  if (error) {
    console.error("Error fetching products:", error)
    throw error
  }

  return data || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error(`Error fetching product with id ${id}:`, error)
    throw error
  }

  return data
}

export async function createProduct(product: ProductInsert): Promise<Product> {
  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("Error creating product:", error)
    throw error
  }

  return data
}

export async function updateProduct(id: string, updates: ProductUpdate): Promise<Product> {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error(`Error updating product with id ${id}:`, error)
    throw error
  }

  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting product with id ${id}:`, error)
    throw error
  }
}
