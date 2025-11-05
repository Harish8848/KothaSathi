import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const {
      title,
      description,
      location,
      type,
      price,
      capacity,
      image,
      furnished,
      utilitiesIncluded,
      minLease,
      amenities,
      ownerId,
    } = await request.json()

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        location,
        type,
        price,
        capacity,
        image,
        furnished,
        utilitiesIncluded,
        minLease,
        amenities,
        ownerId,
      },
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

    return NextResponse.json(listing)
  } catch (error) {
    console.error("Error creating listing:", error)
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 })
  }
}
