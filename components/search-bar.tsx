"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import type { SearchHistoryEntry } from "@/lib/types"

interface SearchBarProps {
  onSearch: (term: string, filter: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState("all")
  const [searchHistory, setSearchHistory] = useState<SearchHistoryEntry[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  useEffect(() => {
    if (session) {
      fetchSearchHistory()
    }
  }, [session])

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(`/api/search-history?userId=${(session?.user as any)?.id}`)
      const data = await response.json()
      setSearchHistory(data)
    } catch (error) {
      console.error("Error fetching search history:", error)
    }
  }

  const saveToHistory = async (query: string, filterType: string) => {
    if (session && query.trim()) {
      try {
        await fetch("/api/search-history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: (session.user as any).id,
            query,
            filter: filterType !== "all" ? filterType : null,
          }),
        })
        await fetchSearchHistory()
      } catch (error) {
        console.error("Error saving search history:", error)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm, filter)
    saveToHistory(searchTerm, filter)
    setShowSuggestions(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term, filter)
    setShowSuggestions(term.length > 0)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    onSearch(searchTerm, newFilter)
  }

  const handleSuggestionClick = (suggestion: SearchHistoryEntry) => {
    setSearchTerm(suggestion.query)
    if (suggestion.filter) {
      setFilter(suggestion.filter)
      onSearch(suggestion.query, suggestion.filter)
    } else {
      setFilter("all")
      onSearch(suggestion.query, "all")
    }
    setShowSuggestions(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by location or room title..."
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-12 pr-4 py-3 md:py-4 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
          />

          {showSuggestions && searchHistory.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
              <div className="p-2">
                {searchHistory.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSuggestionClick(item)}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-secondary rounded-lg transition text-left"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-card-foreground text-sm">{item.query}</p>
                      {item.filter && <p className="text-xs text-muted-foreground capitalize">{item.filter}</p>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", "apartment", "house", "studio", "shared"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleFilterChange(type)}
              className={`px-4 py-2 rounded-full font-medium transition capitalize ${
                filter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border border-border hover:border-primary"
              }`}
            >
              {type === "all" ? "All Rooms" : type}
            </button>
          ))}
        </div>
      </form>
    </div>
  )
}
