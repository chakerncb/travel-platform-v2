'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Review {
  id: number
  rating: number
  comment: string
  created_at: string
  user: {
    id: number
    name: string
    email: string
  }
}

interface TourReviewsProps {
  tourId: string
}

export default function TourReviews({ tourId }: TourReviewsProps) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [showForm, setShowForm] = useState(false)
  
  // Form state
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReviews()
    if (session?.accessToken) {
      checkUserReview()
    }
  }, [tourId, session])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/tours/${tourId}/reviews`)
      const data = await response.json()
      if (data.status) {
        setReviews(data.reviews)
      }
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkUserReview = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/tours/${tourId}/reviews/check`,
        {
          headers: {
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        }
      )
      const data = await response.json()
      if (data.status && data.has_reviewed) {
        setHasReviewed(true)
        setUserReview(data.review)
        setRating(data.review.rating)
        setComment(data.review.comment)
      }
    } catch (err) {
      console.error('Error checking user review:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.accessToken) {
      setError('You must be logged in to submit a review')
      return
    }

    if (comment.length < 10) {
      setError('Comment must be at least 10 characters long')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const url = hasReviewed && userReview
        ? `${process.env.NEXT_PUBLIC_API_URL}/v1/tours/${tourId}/reviews/${userReview.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/v1/tours/${tourId}/reviews`

      const response = await fetch(url, {
        method: hasReviewed ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ rating, comment }),
      })

      const data = await response.json()
      
      if (data.status) {
        setShowForm(false)
        await fetchReviews()
        await checkUserReview()
        setComment('')
        setRating(5)
      } else {
        setError(data.message || 'Failed to submit review')
      }
    } catch (err) {
      setError('An error occurred while submitting your review')
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!session?.accessToken || !userReview) return

    if (!confirm('Are you sure you want to delete your review?')) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/tours/${tourId}/reviews/${userReview.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session.accessToken}`,
          },
        }
      )

      const data = await response.json()
      if (data.status) {
        setHasReviewed(false)
        setUserReview(null)
        setComment('')
        setRating(5)
        await fetchReviews()
      }
    } catch (err) {
      console.error('Error deleting review:', err)
    }
  }

  const renderStars = (rating: number, interactive: boolean = false) => {
    return (
      <div className="rate-review">
        {[1, 2, 3, 4, 5].map((star) => (
          <img
            key={star}
            src="/assets/imgs/page/tour-detail/star-big.svg"
            alt="star"
            style={{
              opacity: star <= rating ? 1 : 0.3,
              cursor: interactive ? 'pointer' : 'default',
            }}
            onClick={() => interactive && setRating(star)}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return <div className="text-center p-5">Loading reviews...</div>
  }

  return (
    <section className="box-section box-content-tour-detail background-body">
      <div className="container">
        <div className="tour-header mb-30">
          <h4 className="neutral-1000">Customer Reviews ({reviews.length})</h4>
        </div>

        {/* Add Review Button */}
        {session && !showForm && (
          <div className="mb-30">
            <button
              className="btn btn-brand-secondary"
              onClick={() => setShowForm(true)}
            >
              {hasReviewed ? 'Edit Your Review' : 'Write a Review'}
            </button>
            {hasReviewed && (
              <button
                className="btn btn-outline-danger ms-2"
                onClick={handleDelete}
              >
                Delete Review
              </button>
            )}
          </div>
        )}

        {!session && (
          <div className="alert alert-info mb-30">
            <Link href="/login" className="text-decoration-underline">
              Please log in
            </Link>{' '}
            to write a review.
          </div>
        )}

        {/* Review Form */}
        {showForm && session && (
          <div className="box-form-reviews mb-40">
            <h6 className="text-md-bold neutral-1000 mb-15">
              {hasReviewed ? 'Edit Your Review' : 'Leave Your Review'}
            </h6>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Rating *</label>
                  {renderStars(rating, true)}
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label className="form-label">Your Review *</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      placeholder="Share your experience with this tour..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                      minLength={10}
                      maxLength={1000}
                    />
                    <small className="text-muted">
                      {comment.length}/1000 characters (minimum 10)
                    </small>
                  </div>
                </div>
                {error && (
                  <div className="col-12">
                    <div className="alert alert-danger">{error}</div>
                  </div>
                )}
                <div className="col-12">
                  <button
                    className="btn btn-black-lg-square me-2"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : hasReviewed ? 'Update Review' : 'Submit Review'}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setError(null)
                      if (hasReviewed && userReview) {
                        setRating(userReview.rating)
                        setComment(userReview.comment)
                      }
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Reviews List */}
        <div className="box-reviews">
          {reviews.length === 0 ? (
            <div className="text-center p-5">
              <p className="text-muted">No reviews yet. Be the first to review this tour!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="item-review">
                <div className="head-review">
                  <div className="author-review">
                    <div className="author-info">
                      <p className="text-lg-bold">{review.user.name}</p>
                      <p className="text-sm-medium neutral-500">
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <div className="content-review">
                  <p className="text-sm-medium neutral-800">{review.comment}</p>
                </div>
                {session?.user?.email === review.user.email && hasReviewed && (
                  <div className="review-actions mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => {
                        setShowForm(true)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
