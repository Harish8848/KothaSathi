"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MapPin, Users, DollarSign, Phone, Mail, Home, Heart, Clock } from "lucide-react"
import type { Listing } from "@/lib/types"
import { useSession } from "next-auth/react"
import PhotoGalleryModal from "@/components/photo-gallery-modal"
import ReviewsSection from "@/components/reviews-section"
import SimilarListings from "@/components/similar-listings"
import { formatTimeAgo } from "@/lib/utils"

interface ListingDetailsProps {
  listing: Listing
}

export default function ListingDetails({ listing }: ListingDetailsProps) {
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isFavLoading, setIsFavLoading] = useState(false)

  useEffect(() => {
    if (session && (session.user as any)?.id) {
      checkIfFavorited()
    }
  }, [session, listing.id])

  const checkIfFavorited = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${(session?.user as any)?.id}`)
      if (response.ok) {
        const favorites = await response.json()
        const isFav = favorites.some((fav: any) => fav.listingId === listing.id)
        setIsFavorited(isFav)
      }
    } catch (error) {
      console.error("Error checking favorite status:", error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!session || !(session.user as any)?.id) {
      alert("Please login to save listings")
      return
    }

    setIsFavLoading(true)
    try {
      const method = isFavorited ? "DELETE" : "POST"
      const url = isFavorited ? `/api/favorites?userId=${(session.user as any).id}&listingId=${listing.id}` : "/api/favorites"

      const response = await fetch(url, {
        method,
        headers: isFavorited ? {} : { "Content-Type": "application/json" },
        body: isFavorited ? undefined : JSON.stringify({ userId: (session.user as any).id, listingId: listing.id }),
      })

      if (response.ok) {
        setIsFavorited(!isFavorited)
      } else {
        console.error("Failed to update favorite:", response.status)
      }
    } catch (error) {
      console.error("Error updating favorite:", error)
    } finally {
      setIsFavLoading(false)
    }
  }

  return (
    <>
      <PhotoGalleryModal
        images={[listing.image]}
        title={listing.title}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Gallery */}
          <div className="rounded-lg overflow-hidden">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="relative h-96 md:h-[500px] w-full bg-muted hover:opacity-90 transition cursor-pointer"
            >
              <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/10 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                <span className="bg-white text-black px-4 py-2 rounded-lg font-medium">View Gallery</span>
              </div>
            </button>
          </div>

          {/* Title & Location */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{listing.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-lg mb-4">
              <MapPin className="w-5 h-5" />
              {listing.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
              <Clock className="w-4 h-4" />
              <span>Listed {formatTimeAgo(listing.createdAt || new Date())}</span>
            </div>
            <p className="text-muted-foreground text-lg">{listing.description}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Room Type</div>
              <div className="text-lg font-semibold text-card-foreground capitalize">{listing.type}</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Capacity</div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-lg font-semibold text-card-foreground">{listing.capacity}</span>
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Availability</div>
              <div className="text-lg font-semibold text-card-foreground">
                {listing.available ? "Available" : "Booked"}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Furnished</div>
              <div className="text-lg font-semibold text-card-foreground">{listing.furnished ? "Yes" : "No"}</div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Utilities Included</div>
              <div className="text-lg font-semibold text-card-foreground">
                {listing.utilitiesIncluded ? "Yes" : "No"}
              </div>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <div className="text-sm text-muted-foreground mb-1">Minimum Lease</div>
              <div className="text-lg font-semibold text-card-foreground">{listing.minLease} months</div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {listing.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2 text-card-foreground">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          <ReviewsSection listingId={listing.id} currentUserId={(session?.user as any)?.id || null} />

          <SimilarListings listingId={listing.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Card */}
          <div className="bg-primary text-primary-foreground p-6 rounded-lg sticky top-4">
            <div className="text-sm opacity-90 mb-1">Monthly Price</div>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">NPR {listing.price}</span>
            </div>
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => {
                  window.location.href = `tel:${listing.owner.phone}`
                }}
                className="flex-1 bg-primary-foreground text-primary py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>
              <button
                onClick={() => {
                  const subject = encodeURIComponent(`Inquiry about ${listing.title}`)
                  const body = encodeURIComponent(`Hi ${listing.owner.name},\n\nI'm interested in your listing "${listing.title}" located in ${listing.location}.\n\nPlease provide more details.\n\nBest regards,`)
                  window.location.href = `mailto:${listing.owner.email}?subject=${subject}&body=${body}`
                }}
                className="flex-1 bg-primary-foreground text-primary py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={isFavLoading}
              className={`w-full border border-primary-foreground text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary-foreground hover:text-primary transition flex items-center justify-center gap-2 ${
                isFavorited ? "bg-primary-foreground text-primary" : ""
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
              {isFavorited ? "Saved" : "Save Listing"}
            </button>
          </div>

          {/* Owner Info */}
          <div className="bg-card border border-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Owner Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-primary" />
                <span className="text-card-foreground font-medium">{listing.owner.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-card-foreground">{listing.owner.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className="text-card-foreground">{listing.owner.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
