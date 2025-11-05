"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X } from "lucide-react"

export default function ListRoomPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth")
    }
  }, [session, status, router])

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "apartment",
    price: "",
    capacity: "",
    description: "",
    furnished: false,
    utilitiesIncluded: false,
    minLease: "",
    amenities: "",
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleCheckboxChange = (field: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [field]: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const userId = (session?.user as any)?.id
      if (!userId) {
        alert("Please log in to create a listing")
        setIsSubmitting(false)
        return
      }

      const amenitiesArray = formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item.length > 0)

      let imageUrl = "/placeholder.svg" // Default image

      // If an image is selected, upload it first
      if (selectedImage) {
        const imageFormData = new FormData()
        imageFormData.append("file", selectedImage)

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: imageFormData,
        })

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json()
          imageUrl = uploadData.url
        } else {
          console.warn("Image upload failed, using default image")
        }
      }

      const response = await fetch("/api/listings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          type: formData.type,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity),
          image: imageUrl,
          furnished: formData.furnished,
          utilitiesIncluded: formData.utilitiesIncluded,
          minLease: parseInt(formData.minLease),
          amenities: amenitiesArray,
          ownerId: userId,
        }),
      })

      if (response.ok) {
        router.push("/dashboard")
      } else {
        const error = await response.json()
        alert(`Failed to create listing: ${error.error || "Unknown error"}`)
      }
    } catch (error) {
      console.error("Error creating listing:", error)
      alert("Failed to create listing. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold text-foreground mb-2">List Your Room</h1>
          <p className="text-muted-foreground mb-8">Fill out the form below to create a new room listing.</p>

          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Room Photo</h3>

                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Room preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Upload a photo of your room</p>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" asChild>
                            <span>Choose File</span>
                          </Button>
                        </label>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Basic Information</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">Room Title</label>
                    <Input
                      name="title"
                      placeholder="Modern 2BR Apartment"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <Input
                      name="location"
                      placeholder="Downtown, City Center"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <Select value={formData.type} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="shared">Shared</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Capacity (guests)</label>
                      <Input
                        name="capacity"
                        type="number"
                        placeholder="2"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Pricing & Terms</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Price (NPR)</label>
                      <Input
                        name="price"
                        type="number"
                        placeholder="1500"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Min. Lease (months)</label>
                      <Input
                        name="minLease"
                        type="number"
                        placeholder="6"
                        value={formData.minLease}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Features</h3>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="furnished"
                        checked={formData.furnished}
                        onCheckedChange={(checked) => handleCheckboxChange("furnished", checked as boolean)}
                      />
                      <label htmlFor="furnished" className="text-sm font-medium cursor-pointer">
                        Furnished
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="utilities"
                        checked={formData.utilitiesIncluded}
                        onCheckedChange={(checked) => handleCheckboxChange("utilitiesIncluded", checked as boolean)}
                      />
                      <label htmlFor="utilities" className="text-sm font-medium cursor-pointer">
                        Utilities Included
                      </label>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Description</h3>

                  <div>
                    <label className="block text-sm font-medium mb-1">Room Description</label>
                    <Textarea
                      name="description"
                      placeholder="Describe your room, amenities, and what makes it special..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Amenities (comma-separated)</label>
                    <Input
                      name="amenities"
                      placeholder="WiFi, Gym, Parking, Balcony, Kitchen"
                      value={formData.amenities}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Publishing..." : "Publish Listing"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
