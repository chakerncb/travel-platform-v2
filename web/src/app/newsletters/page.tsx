'use client'
import { useState, useEffect } from 'react'
import Layout from "@/src/components/layout/Layout"
import NewsletterSubscribe from '@/src/components/elements/NewsletterSubscribe'
import Link from "next/link"

interface Newsletter {
  id: number
  subject: string
  content: string
  sent_at: string
  recipients_count: number
}

export default function NewslettersPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchNewsletters()
  }, [currentPage])

  const fetchNewsletters = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/newsletters?page=${currentPage}&per_page=10`
      )
      const data = await response.json()
      
      if (data.status && data.newsletters) {
        setNewsletters(data.newsletters.data || [])
        setTotalPages(data.newsletters.last_page || 1)
      }
    } catch (err) {
      console.error('Error fetching newsletters:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Layout headerStyle={1} footerStyle={1}>
        <main className="main">
          {/* Breadcrumb */}
          <section className="box-section box-breadcrumb background-body">
            <div className="container">
              <ul className="breadcrumbs">
                <li>
                  <Link href="/">Home</Link>
                  <span className="arrow-right">
                    <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                </li>
                <li><span className="text-breadcrumb">Newsletters</span></li>
              </ul>
            </div>
          </section>

          {/* Header */}
          <section className="section-box box-next-trips background-body">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-6 mb-30">
                  <h1 className="text-86-bold neutral-1000">Our </h1>
                  <h2 className="text-64-medium neutral-1000">Newsletters</h2>
                  <h6 className="neutral-500">Stay updated with the latest travel tips, destinations, and exclusive deals</h6>
                </div>
                <div className="col-lg-6 mb-30">
                  <div className="box-subscriber-blog-3">
                    <p className="text-md-bold neutral-1000">Subscribe to our newsletter</p>
                    <NewsletterSubscribe inline />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletters List */}
          <section className="section-box box-newsletters background-body">
            <div className="container">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : newsletters.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">No newsletters available yet. Subscribe to be notified when we publish our first newsletter!</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {newsletters.map((newsletter) => (
                      <div key={newsletter.id} className="col-lg-12 mb-30">
                        <div className="card-blog-grid card-blog-grid-2 background-card wow fadeInUp">
                          <div className="card-info">
                            <div className="card-meta">
                              <div className="meta-links">
                                <span className="text-sm-medium neutral-500">
                                  {formatDate(newsletter.sent_at)}
                                </span>
                                {newsletter.recipients_count > 0 && (
                                  <span className="text-sm-medium neutral-500 ms-3">
                                    Sent to {newsletter.recipients_count} subscribers
                                  </span>
                                )}
                              </div>
                            </div>
                            <Link className="card-title text-xl-bold neutral-1000" href="#">
                              {newsletter.subject}
                            </Link>
                            <div className="card-program">
                              <div className="card-description">
                                <p className="text-md-medium neutral-500">
                                  {newsletter.content.length > 250
                                    ? newsletter.content.substring(0, 250) + '...'
                                    : newsletter.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <nav aria-label="Page navigation">
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            <svg
                              width={12}
                              height={12}
                              viewBox="0 0 12 12"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </li>
                        {[...Array(totalPages)].map((_, index) => (
                          <li
                            key={index + 1}
                            className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            <svg
                              width={12}
                              height={12}
                              viewBox="0 0 12 12"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M5.99967 10.6666L10.6663 5.99992M10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Newsletter Subscribe Section */}
          <section className="section-box box-subscriber background-body">
            <div className="container">
              <div className="block-subscriber">
                <div className="subscriber-left">
                  <span className="btn btn-brand-secondary">Join our newsletter</span>
                  <h5 className="mt-15 mb-30 neutral-1000">
                    Subscribe to see secret deals prices drop the moment you sign up!
                  </h5>
                  <NewsletterSubscribe />
                </div>
                <div className="subscriber-right" />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="section-box box-media background-body">
            <div className="container-media wow fadeInUp">
              <img src="/assets/imgs/page/homepage5/media.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media2.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media3.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media4.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media5.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media6.png" alt="TOURZ" />
              <img src="/assets/imgs/page/homepage5/media7.png" alt="TOURZ" />
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}
