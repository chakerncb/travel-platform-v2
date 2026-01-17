'use client'
import { useState } from 'react'

interface NewsletterSubscribeProps {
  inline?: boolean
  className?: string
}

export default function NewsletterSubscribe({ inline = false, className = '' }: NewsletterSubscribeProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name: name || undefined }),
      })

      const data = await response.json()

      if (data.status) {
        setMessage({ type: 'success', text: data.message })
        setEmail('')
        setName('')
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to subscribe' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  if (inline) {
    return (
      <div className={`newsletter-inline ${className}`}>
        <form className="form-newsletter" onSubmit={handleSubmit}>
          <input
            className="form-control"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            className="btn btn-brand-secondary"
            type="submit"
            value={loading ? 'Subscribing...' : 'Subscribe'}
            disabled={loading}
          />
        </form>
        {message && (
          <p className={`mt-2 text-sm ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
            {message.text}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className={`newsletter-form-block ${className}`}>
      <form className="form-subscriber" onSubmit={handleSubmit}>
        {/* <input
          className="form-control mb-3"
          type="text"
          placeholder="Your Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        /> */}
        <input
          className="form-control"
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <input
          className="btn btn-submit"
          type="submit"
          value={loading ? 'Subscribing...' : 'Subscribe'}
          disabled={loading}
        />
      </form>
      {message && (
        <p className={`mt-3 text-sm-medium ${message.type === 'success' ? 'text-success' : 'text-danger'}`}>
          {message.text}
        </p>
      )}
      <p className="text-sm-medium neutral-500 mt-15">No ads. No trails. No commitments</p>
    </div>
  )
}
