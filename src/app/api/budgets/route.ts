import { getBudgets, createBudget } from "@/lib/services/budget-service"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const budgets = await getBudgets()
    return NextResponse.json(budgets)
  } catch (error) {
    console.error("Error fetching budgets:", error)
    return NextResponse.json({ error: "Failed to fetch budgets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const newBudget = await createBudget(data)
    return NextResponse.json(newBudget, { status: 201 })
  } catch (error) {
    console.error("Error creating budget:", error)
    return NextResponse.json({ error: "Failed to create budget" }, { status: 500 })
  }
}
