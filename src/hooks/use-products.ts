"use client"

import { useState, useEffect } from "react"
import { type Product, getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/services/product-service"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true)
        const data = await getProducts()
        setProducts(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch products"))
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const addProduct = async (product: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      setLoading(true)
      const newProduct = await createProduct(product)
      setProducts([...products, newProduct])
      return newProduct
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to add product"))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editProduct = async (id: string, updates: Partial<Product>) => {
    try {
      setLoading(true)
      const updatedProduct = await updateProduct(id, updates)
      setProducts(products.map((p) => (p.id === id ? updatedProduct : p)))
      return updatedProduct
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to update product ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (id: string) => {
    try {
      setLoading(true)
      await deleteProduct(id)
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`Failed to delete product ${id}`))
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    removeProduct,
  }
}
