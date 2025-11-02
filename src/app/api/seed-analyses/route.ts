import { seedAnalyses } from "@/lib/seed-analyses"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await seedAnalyses()
    return NextResponse.json({ success: true, message: "Analyses seeded successfully" })
  } catch (error) {
    console.error("Error seeding analyses:", error)
    return NextResponse.json(
      { success: false, message: "Failed to seed analyses", error: String(error) },
      { status: 500 },
    )
  }
}
