import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get("listingId")

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID required" }, { status: 400 })
    }

    const listing = await db.listing.findUnique({
      where: { id: Number.parseInt(listingId) },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    const similarListings = await db.listing.findMany({
      where: {
        AND: [
          { id: { not: Number.parseInt(listingId) } },
          {
            OR: [
              { type: listing.type },
              { location: listing.location },
              {
                price: {
                  gte: listing.price - 100,
                  lte: listing.price + 100,
                },
              },
            ],
          },
        ],
      },
      take: 3,
    })

    return NextResponse.json(similarListings)
  } catch (error) {
    console.error("Error fetching similar listings:", error)
    return NextResponse.json({ error: "Failed to fetch similar listings" }, { status: 500 })
  }
}
