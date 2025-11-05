"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Listing } from "@/lib/types"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchListings()
    }
  }, [session])

  const fetchListings = async () => {
    try {
      const userId = (session?.user as any)?.id
      if (!userId) {
        setListings([])
        setLoading(false)
        return
      }
      const response = await fetch(`/api/dashboard/listings?ownerId=${userId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch listings: ${response.status}`)
      }
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error("Error fetching listings:", error)
      setListings([])
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="px-4 md:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div>Loading...</div>
          </div>
        </div>
      </main>
    )
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {session.user?.name || "Guest"}</p>
            </div>
            <Button variant="outline" onClick={() => signOut()} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
          </div>

          {/* All Listings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">My Listings</h2>
              <Link href="/list-room">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add New Room
                </Button>
              </Link>
            </div>

            {listings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing: Listing) => (
                  <Card key={listing.id} className="overflow-hidden">
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="font-bold text-foreground mb-1">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{listing.location}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-primary">NPR {listing.price}/mo</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${listing.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {listing.available ? "Available" : "Rented"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/listing/${listing.id}`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            View
                          </Button>
                        </Link>
                        <Link href={`/edit-listing/${listing.id}`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No listings available yet.</p>
                  <Link href="/list-room">
                    <Button>List Your First Room</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
