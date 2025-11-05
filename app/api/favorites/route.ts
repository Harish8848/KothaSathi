import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId || userId === "undefined") {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const favorites = await db.favorite.findMany({
      where: { userId },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error("Error fetching favorites:", error)
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, listingId } = await request.json()

    if (!userId || !listingId) {
      return NextResponse.json({ error: "User ID and Listing ID required" }, { status: 400 })
    }

    const favorite = await db.favorite.create({
      data: { userId, listingId },
      include: { listing: true },
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Already favorited" }, { status: 409 })
    }
    console.error("Error creating favorite:", error)
    return NextResponse.json({ error: "Failed to create favorite" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const listingId = searchParams.get("listingId")

    if (!userId || !listingId) {
      return NextResponse.json({ error: "User ID and Listing ID required" }, { status: 400 })
    }

    await db.favorite.delete({
      where: {
        userId_listingId: {
          userId: userId,
          listingId: Number.parseInt(listingId),
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Favorite not found" }, { status: 404 })
    }
    console.error("Error deleting favorite:", error)
    return NextResponse.json({ error: "Failed to delete favorite" }, { status: 500 })
  }
}
