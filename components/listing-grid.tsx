"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, DollarSign, Users, Clock } from "lucide-react"
import type { Listing } from "@/lib/types"
import { formatTimeAgo } from "@/lib/utils"

interface ListingGridProps {
  listings: Listing[]
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">No rooms found. Try adjusting your search.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <Link key={listing.id} href={`/listing/${listing.id}`}>
          <div className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-48 md:h-64 overflow-hidden bg-muted">
              <Image
                src={listing.image || "/placeholder.svg"}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="p-4 md:p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-2 line-clamp-2">{listing.title}</h3>

              <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>{listing.location}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Room Type</span>
                  <span className="font-medium text-card-foreground capitalize">{listing.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Capacity</span>
                  <span className="flex items-center gap-1 font-medium text-card-foreground">
                    <Users className="w-4 h-4" />
                    {listing.capacity}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Availability</span>
                  <span className={`font-medium ${listing.available ? 'text-green-600' : 'text-red-600'}`}>
                    {listing.available ? 'Available' : 'Booked'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-muted-foreground text-sm">Price</span>
                <span className="text-2xl font-bold text-primary">
                  NPR {listing.price}
                </span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2">
                <Clock className="w-3 h-3" />
                <span>Listed {formatTimeAgo(listing.createdAt || new Date())}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
