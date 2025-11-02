import { getProducts, createProduct } from "@/lib/services/product-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newProduct = await createProduct(data)
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
