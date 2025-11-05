export interface Listing {
  id: number
  title: string
  description: string
  location: string
  type: "apartment" | "house" | "studio" | "shared"
  price: number
  capacity: number
  image: string
  available: boolean
  furnished: boolean
  utilitiesIncluded: boolean
  minLease: number
  amenities: string[]
  createdAt?: string
  updatedAt?: string
  owner: {
    id: number
    name: string
    email: string
    phone: string
  }
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
  isOwner: boolean
}

export interface Review {
  id: number
  rating: number
  comment: string
  userId: number
  listingId: number
  createdAt: string
  updatedAt: string
  user: {
    name: string
  }
}

export interface Favorite {
  id: number
  userId: number
  listingId: number
  listing: Listing
  createdAt: string
}

export interface SearchHistoryEntry {
  id: number
  userId: number
  query: string
  filter: string | null
  createdAt: string
}
