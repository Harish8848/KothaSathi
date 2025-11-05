"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import ListingGrid from "@/components/listing-grid"
import type { Listing } from "@/lib/types"

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("/api/listings")
        const data = await response.json()
        setListings(data)
        setFilteredListings(data)
      } catch (error) {
        console.error("Error fetching listings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  const handleSearch = (term: string, filter: string) => {
    let results = listings

    if (term) {
      results = results.filter(
        (listing) =>
          listing.title.toLowerCase().includes(term.toLowerCase()) ||
          listing.location.toLowerCase().includes(term.toLowerCase()),
      )
    }

    if (filter !== "all") {
      results = results.filter((listing) => listing.type === filter)
    }

    setFilteredListings(results)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="relative">
        <SearchBar onSearch={handleSearch} />
      </div>
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-2">Available Rooms</h2>
          <p className="text-muted-foreground mb-8">
            {loading
              ? "Loading..."
              : `${filteredListings.length} ${filteredListings.length === 1 ? "room" : "rooms"} found`}
          </p>
          {!loading && <ListingGrid listings={filteredListings} />}
        </div>
      </section>
    </main>
  )
}
