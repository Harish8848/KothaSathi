import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")

    if (!ownerId) {
      return NextResponse.json({ error: "Owner ID required" }, { status: 400 })
    }

    const listings = await prisma.listing.findMany({
      where: {
        ownerId: ownerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Error fetching owner listings:", error)
    return NextResponse.json({ error: "Failed to fetch listings" }, { status: 500 })
  }
}
