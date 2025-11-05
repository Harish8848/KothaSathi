import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const listing = await prisma.listing.findUnique({
      where: { id: Number.parseInt(id) },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 })
    }

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Error fetching listing:", error)
    return NextResponse.json({ error: "Failed to fetch listing" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      title,
      description,
      location,
      type,
      price,
      capacity,
      image,
      available,
      furnished,
      utilitiesIncluded,
      minLease,
      amenities,
    } = body

    const updatedListing = await prisma.listing.update({
      where: { id: Number.parseInt(id) },
      data: {
        title,
        description,
        location,
        type,
        price,
        capacity,
        image,
        available,
        furnished,
        utilitiesIncluded,
        minLease,
        amenities,
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Error updating listing:", error)
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 })
  }
}
