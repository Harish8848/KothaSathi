"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import ListingDetails from "@/components/listing-details"
import { Skeleton } from "@/components/ui/skeleton"
import type { Listing } from "@/lib/types"
import { use } from "react"

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`)
        if (!response.ok) {
          setNotFound(true)
          return
        }
        const data = await response.json()
        setListing(data)
      } catch (error) {
        console.error("Error fetching listing:", error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <section className="px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-7xl mx-auto space-y-4">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </section>
      </main>
    )
  }

  if (notFound || !listing) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Listing not found</h1>
          <p className="text-muted-foreground">The room you are looking for doesn't exist.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          <ListingDetails listing={listing} />
        </div>
      </section>
    </main>
  )
}
