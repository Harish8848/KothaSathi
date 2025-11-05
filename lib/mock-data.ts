export interface Listing {
  id: number
  title: string
  location: string
  type: "apartment" | "house" | "studio" | "shared"
  price: number
  capacity: number
  image: string
  description: string
  available: boolean
  furnished: boolean
  utilitiesIncluded: boolean
  minLease: number
  amenities: string[]
  ownerName: string
  ownerPhone: string
  ownerEmail: string
}

export const mockListings: Listing[] = [
  {
    id: 1,
    title: "Modern Studio in Downtown",
    location: "Downtown, City Center",
    type: "studio",
    price: 1200,
    capacity: 1,
    image: "/modern-studio-apartment-downtown.jpg",
    description:
      "Beautiful modern studio with floor-to-ceiling windows, open kitchen, and hardwood floors. Perfect for professionals.",
    available: true,
    furnished: true,
    utilitiesIncluded: true,
    minLease: 6,
    amenities: ["WiFi", "Gym", "Parking", "Balcony", "Modern Kitchen"],
    ownerName: "Sarah Johnson",
    ownerPhone: "(555) 123-4567",
    ownerEmail: "sarah@example.com",
  },
  {
    id: 2,
    title: "Spacious 2BR Apartment with Yard",
    location: "Riverside, Suburban Area",
    type: "apartment",
    price: 1800,
    capacity: 2,
    image: "/spacious-2-bedroom-apartment-with-yard.jpg",
    description:
      "Lovely 2-bedroom apartment featuring a private backyard, plenty of storage, and a modern kitchen. Great for families.",
    available: true,
    furnished: false,
    utilitiesIncluded: false,
    minLease: 12,
    amenities: ["Parking", "Backyard", "Laundry", "Storage", "Sunroom"],
    ownerName: "Mike Chen",
    ownerPhone: "(555) 234-5678",
    ownerEmail: "mike@example.com",
  },
  {
    id: 3,
    title: "Cozy Shared House Room",
    location: "College District",
    type: "shared",
    price: 650,
    capacity: 1,
    image: "/cozy-shared-house-room-college-district.jpg",
    description:
      "Single bedroom in a shared house with friendly roommates. Access to common areas, kitchen, and garden.",
    available: true,
    furnished: true,
    utilitiesIncluded: true,
    minLease: 3,
    amenities: ["Furnished", "Shared Kitchen", "Garden", "WiFi", "Community Space"],
    ownerName: "Emma Davis",
    ownerPhone: "(555) 345-6789",
    ownerEmail: "emma@example.com",
  },
  {
    id: 4,
    title: "Historic House with Character",
    location: "Uptown, Heritage District",
    type: "house",
    price: 2200,
    capacity: 3,
    image: "/historic-house-uptown-heritage-district.jpg",
    description:
      "Charming 3-bedroom historic house with original hardwood floors, fireplace, and vintage architecture.",
    available: false,
    furnished: false,
    utilitiesIncluded: false,
    minLease: 12,
    amenities: ["Fireplace", "Hardwood Floors", "Porch", "Basement", "Garage"],
    ownerName: "James Wilson",
    ownerPhone: "(555) 456-7890",
    ownerEmail: "james@example.com",
  },
  {
    id: 5,
    title: "Luxury Corner Apartment",
    location: "Downtown, Financial District",
    type: "apartment",
    price: 2500,
    capacity: 2,
    image: "/luxury-corner-apartment-downtown-financial-distric.jpg",
    description:
      "Premium 2-bedroom apartment with corner unit, floor-to-ceiling windows, and state-of-the-art amenities.",
    available: true,
    furnished: true,
    utilitiesIncluded: true,
    minLease: 12,
    amenities: ["Concierge", "Gym", "Pool", "Rooftop", "Smart Home", "Wine Fridge"],
    ownerName: "Lisa Anderson",
    ownerPhone: "(555) 567-8901",
    ownerEmail: "lisa@example.com",
  },
  {
    id: 6,
    title: "Budget-Friendly Studio",
    location: "Midtown, Mixed Use Area",
    type: "studio",
    price: 900,
    capacity: 1,
    image: "/budget-friendly-studio-midtown.jpg",
    description:
      "Compact but comfortable studio perfect for students and young professionals. Close to transit and shops.",
    available: true,
    furnished: false,
    utilitiesIncluded: false,
    minLease: 3,
    amenities: ["Transit Access", "Near Shops", "Natural Light", "Kitchenette"],
    ownerName: "Robert Taylor",
    ownerPhone: "(555) 678-9012",
    ownerEmail: "robert@example.com",
  },
]
