import { seedDatabase } from "@/lib/seed-database"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json({ message: "Database seeded successfully" }, { status: 200 })
    } else {
      return NextResponse.json({ message: "Failed to seed database", error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in seed API route:", error)
    return NextResponse.json({ message: "Internal server error", error }, { status: 500 })
  }
}
