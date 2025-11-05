import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const history = await db.searchHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error("Error fetching search history:", error)
    return NextResponse.json({ error: "Failed to fetch search history" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, query, filter } = await request.json()

    if (!userId || !query) {
      return NextResponse.json({ error: "User ID and query required" }, { status: 400 })
    }

    const searchEntry = await db.searchHistory.create({
      data: { userId: userId.toString(), query, filter: filter || null },
    })

    return NextResponse.json(searchEntry, { status: 201 })
  } catch (error) {
    console.error("Error creating search history:", error)
    return NextResponse.json({ error: "Failed to create search history" }, { status: 500 })
  }
}
