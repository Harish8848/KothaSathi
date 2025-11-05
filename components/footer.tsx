import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">RoomSathi</h3>
            <p className="text-sm text-muted-foreground">
              Find your perfect room or apartment in your city. Connecting people for better living experiences.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/listings" className="block text-sm text-muted-foreground hover:text-primary transition">
                Browse Rooms
              </Link>
              <Link href="/list-room" className="block text-sm text-muted-foreground hover:text-primary transition">
                List Your Room
              </Link>
              <Link href="/favorites" className="block text-sm text-muted-foreground hover:text-primary transition">
                Saved Listings
              </Link>
              <Link href="/dashboard" className="block text-sm text-muted-foreground hover:text-primary transition">
                Dashboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Support</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                Help Center
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                Safety Tips
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                Terms of Service
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Sifal, Kathmandu, Nepal </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0" />
                <span>+(977) 9868795658 </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0" />
                <span>support@roomsathi.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RoomSathi. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
