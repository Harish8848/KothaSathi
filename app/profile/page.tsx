"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, MapPin, LogOut } from "lucide-react"

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [status, router])

  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/profile")
          if (response.ok) {
            const data = await response.json()
            setProfileData(data)
            setFormData({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
            })
          }
        } catch (error) {
          console.error("Error fetching profile:", error)
        }
      }
    }

    fetchProfile()
  }, [session])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Update user profile via API
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setProfileData(updatedData)
        // Update session
        await update({
          ...session,
          user: {
            ...session?.user,
            ...formData,
          },
        })
        setIsEditing(false)
      } else {
        console.error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (profileData) {
      setFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        address: profileData.address || "",
      })
    }
    setIsEditing(false)
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="px-4 md:px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-foreground">Profile</h1>
            <Button variant="outline" onClick={() => signOut()} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profileData?.googleImage || session.user?.image || ""} alt={profileData?.name || session.user?.name || ""} />
                  <AvatarFallback>
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{profileData?.name || session.user?.name}</h2>
                  <p className="text-muted-foreground">{profileData?.email || session.user?.email}</p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                  <p className="text-foreground p-2 bg-muted rounded">{profileData?.name || "Not provided"}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="text-foreground p-2 bg-muted rounded">{profileData?.email}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-foreground p-2 bg-muted rounded">
                      {profileData?.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Enter your address"
                      className="min-h-20"
                    />
                  ) : (
                    <p className="text-foreground p-2 bg-muted rounded min-h-20">
                      {profileData?.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                {isEditing ? (
                  <>
                    <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="w-full">
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
