"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Star, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Review } from "@/lib/types"

interface ReviewsSectionProps {
  listingId: number
  currentUserId: number | null
}

interface ReviewWithUser extends Review {
  user: { name: string }
}

export default function ReviewsSection({ listingId, currentUserId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<ReviewWithUser[]>([])
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchReviews()
  }, [listingId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?listingId=${listingId}`)
      const data = await response.json()
      setReviews(data.reviews)
      setAverageRating(data.averageRating)
      setTotalReviews(data.totalReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUserId) return

    setSubmitting(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          listingId,
          rating,
          comment,
        }),
      })

      if (response.ok) {
        setComment("")
        setRating(5)
        setShowForm(false)
        await fetchReviews()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div>Loading reviews...</div>

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Reviews & Ratings</h3>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-foreground">{averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">/5</span>
          </div>

          {/* Star display */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <span className="text-muted-foreground ml-auto">{totalReviews} reviews</span>
        </div>

        {currentUserId && !showForm && (
          <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
            <MessageSquare className="w-4 h-4 mr-2" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Form */}
      {showForm && currentUserId && (
        <form onSubmit={handleSubmitReview} className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="comment" className="text-sm font-medium text-foreground mb-2 block">
              Comment (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share your experience with this listing..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-24"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{review.user.name}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
              </div>
              {review.comment && <p className="text-card-foreground text-sm">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
