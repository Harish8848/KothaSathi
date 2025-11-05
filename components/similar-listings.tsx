"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Users, DollarSign } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Listing } from "@/lib/types"

interface SimilarListingsProps {
  listingId: number
}

export default function SimilarListings({ listingId }: SimilarListingsProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSimilarListings = async () => {
      try {
        const response = await fetch(`/api/listings/similar?listingId=${listingId}`)
        const data = await response.json()
        setListings(data)
      } catch (error) {
        console.error("Error fetching similar listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSimilarListings()
  }, [listingId])

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Similar Listings</h3>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  if (listings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Similar Listings</h3>
      <div className="grid gap-4">
        {listings.map((listing) => (
          <Link
            key={listing.id}
            href={`/listing/${listing.id}`}
            className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition flex"
          >
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden">
              <Image
                src={listing.image || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-110 transition duration-300"
              />
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-semibold text-foreground group-hover:text-primary transition">{listing.title}</h4>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="w-4 h-4" />
                  {listing.location}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-card-foreground">{listing.capacity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-card-foreground font-semibold">NPR {listing.price}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
