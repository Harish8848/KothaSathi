"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface PhotoGalleryModalProps {
  images: string[]
  title: string
  isOpen: boolean
  onClose: () => void
}

export default function PhotoGalleryModal({ images, title, isOpen, onClose }: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!isOpen) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl w-full">
        {/* Close button */}
        <button onClick={onClose} className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10">
          <X className="w-8 h-8" />
        </button>

        {/* Main image */}
        <div className="relative h-96 md:h-[600px] bg-black rounded-lg overflow-hidden">
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Photo ${currentIndex + 1}`}
            fill
            className="object-contain"
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                  index === currentIndex ? "border-white" : "border-gray-600 opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
