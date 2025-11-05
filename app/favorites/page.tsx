"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { useSession } from "next-auth/react"
import { Heart, Clock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import type { Favorite } from "@/lib/types"
import { MapPin, Users, DollarSign } from "lucide-react"
import { formatTimeAgo } from "@/lib/utils"

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && (session.user as any)?.id) {
      fetchFavorites()
    } else if (status === "unauthenticated" || (session && !(session.user as any)?.id)) {
      setLoading(false)
    }
  }, [session, status])

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`/api/favorites?userId=${(session?.user as any)?.id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch favorites: ${response.status}`)
      }
      const data = await response.json()
      setFavorites(data)
    } catch (error) {
      console.error("Error fetching favorites:", error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (id: number, listingId: number) => {
    try {
      await fetch(`/api/favorites?userId=${(session?.user as any)?.id}&listingId=${listingId}`, {
        method: "DELETE",
      })
      setFavorites(favorites.filter((fav) => fav.id !== id))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Please log in</h1>
          <p className="text-muted-foreground">Sign in to view your saved listings</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2">Saved Listings</h1>
          <p className="text-muted-foreground mb-8">
            {loading ? "Loading..." : `${favorites.length} ${favorites.length === 1 ? "listing" : "listings"} saved`}
          </p>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-lg" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No saved listings yet</p>
              <Link href="/listings" className="text-primary hover:underline mt-2 inline-block">
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites && favorites.length > 0 && favorites.map(({ id, listing }) => (
                <div
                  key={id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition group"
                >
                  <div className="relative h-48 w-full bg-muted overflow-hidden">
                    <Image
                      src={listing?.image || "/placeholder.svg"}
                      alt={listing?.title || "Listing"}
                      fill
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                    <button
                      onClick={() => handleRemoveFavorite(id, listing?.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition z-10"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <Link href={`/listing/${listing?.id}`} className="block">
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary transition mb-2">
                        {listing?.title || "Untitled Listing"}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      {listing?.location || "Location not available"}
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-sm text-card-foreground">{listing?.capacity || 0} capacity</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-card-foreground">NPR {listing?.price || 0}/mo</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/listing/${listing?.id}`}
                      className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-center hover:opacity-90 transition block"
                    >
                      View Details
                    </Link>
                  </div>

                  <div className="flex items-center gap-1 text-muted-foreground text-xs mt-2 px-4 pb-4">
                    <Clock className="w-3 h-3" />
                    <span>Listed {formatTimeAgo(listing?.createdAt || new Date())}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
