import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    const reviews = await db.review.findMany({
      where: { listingId: Number.parseInt(listingId) },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    })

    const avgRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

    return NextResponse.json({ reviews, averageRating: avgRating, totalReviews: reviews.length })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, listingId, rating, comment } = await request.json()

    if (!userId || !listingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid input. Rating must be 1-5" }, { status: 400 })
    }

    const review = await db.review.create({
      data: { userId, listingId, rating, comment: comment || "" },
      include: { user: { select: { name: true } } },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "You already reviewed this listing" }, { status: 409 })
    }
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
