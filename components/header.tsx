"use client"

import Link from "next/link"
import { MapPin, Menu, X, Heart, User } from "lucide-react"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  return (
    <header className="bg-linear-to-r from-primary to-primary/90 text-primary-foreground py-6 md:py-8 shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <MapPin className="w-6 h-6 md:w-8 md:h-8" />
          <span className="text-xl md:text-2xl font-bold">RoomSathi</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/listings" className="hover:opacity-80 transition">
            Browse
          </Link>
          {session && (
            <Link href="/favorites" className="hover:opacity-80 transition flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Saved
            </Link>
          )}
          {session && (
            <Link href="/list-room" className="hover:opacity-80 transition">
              List a Room
            </Link>
          )}
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="bg-primary-foreground text-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="p-2 rounded-lg bg-primary-foreground/20 hover:bg-primary-foreground/30 transition"
                aria-label="Profile"
              >
                <User className="w-5 h-5" />
              </Link>
            </>
          ) : (
            <Link
              href="/auth"
              className="bg-primary-foreground text-primary px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
            >
              Sign In
            </Link>
          )}

        </nav>

        <button
          className="md:hidden flex items-center gap-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden mt-4 px-4 pb-4 space-y-2">
          <Link href="/listings" className="block py-2 hover:opacity-80">
            Browse
          </Link>
          {session && (
            <Link href="/favorites" className="block py-2 hover:opacity-80">
              Saved Listings
            </Link>
          )}
          {session && (
            <Link href="/list-room" className="block py-2 hover:opacity-80">
              List a Room
            </Link>
          )}
          {session ? (
            <>
              <Link href="/dashboard" className="block py-2 hover:opacity-80">
                Dashboard
              </Link>
              <Link href="/profile" className="block py-2 hover:opacity-80">
                Profile
              </Link>
            </>
          ) : (
            <Link href="/auth" className="block py-2 hover:opacity-80">
              Sign In
            </Link>
          )}

        </nav>
      )}
    </header>
  )
}
