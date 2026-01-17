'use client'
import Layout from "@/src/components/layout/Layout"
import NewsletterSubscribe from '@/src/components/elements/NewsletterSubscribe'
import Link from "next/link"
import { useState, useEffect } from "react"
import { blogService, Blog } from "@/src/services/blogService"
import { imageService } from "@/src/services/imageService"

export default function BlogGrid() {
	const [blogs, setBlogs] = useState<Blog[]>([])
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)

	useEffect(() => {
		loadBlogs()
	}, [currentPage])

	const loadBlogs = async () => {
		try {
			setLoading(true)
			const response = await blogService.getBlogs(currentPage, 8)
			setBlogs(response.blogs.data)
			setTotalPages(response.blogs.last_page)
		} catch (error) {
			console.error('Error loading blogs:', error)
		} finally {
			setLoading(false)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', { 
			day: 'numeric', 
			month: 'short', 
			year: 'numeric' 
		})
	}

	return (
		<>
			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<section className="box-section box-breadcrumb background-body">
						<div className="container">
							<ul className="breadcrumbs">
								<li><Link href="/">Home</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								<li><Link href="/blog-grid">Blog</Link></li>
							</ul>
						</div>
					</section>

					<section className="section-box box-next-trips background-body">
						<div className="container">
							<div className="row">
								<div className="col-lg-6 mb-30">
									<h1 className="text-86-bold neutral-1000">Inspiration </h1>
									<h2 className="text-64-medium neutral-1000">for Your Next Trips</h2>
									<h6 className="neutral-500">Discover the World's Treasures with T7wisa </h6>
								</div>
							</div>
						</div>
					</section>

					<section className="section-box box-recent-posts background-body">
						<div className="container">
							<div className="row">
								<div className="col-lg-12">
									<h2 className="neutral-1000">Recent Posts</h2>
									<p className="text-xl-medium neutral-500">Discover stories and tips from travelers around the world</p>
									
									{loading ? (
										<div className="text-center my-5">
											<div className="spinner-border" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</div>
									) : blogs.length === 0 ? (
										<div className="text-center my-5">
											<p className="text-lg neutral-500">No blog posts available yet.</p>
										</div>
									) : (
										<>
											<div className="box-grid-hotels box-grid-news mt-60 mb-50 wow fadeIn">
												{blogs.map((blog) => (
													<div key={blog.id} className="card-flight card-news background-card">
														<div className="card-image">
															<Link className="wish" href="#">
																<svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
																	<path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
																</svg>
															</Link>
															<Link href={`/blog/${blog.slug}`}>
																<img src={imageService.getImageUrl(blog.featured_image) || "/assets/imgs/page/blog/news.png"} alt={blog.title} />
															</Link>
														</div>
														<div className="card-info">
															<Link className="btn btn-label-tag background-1" href="#">
																{blog.category.name}
															</Link>
															<div className="card-title">
																<Link className="heading-6 neutral-1000" href={`/blog/${blog.slug}`}>
																	{blog.title}
																</Link>
															</div>
															<div className="card-meta">
																<span className="post-date neutral-1000">
																	{formatDate(blog.published_at)}
																</span>
																<span className="post-time neutral-1000">{blog.reading_time} mins</span>
																<span className="post-comment neutral-1000">{blog.views} views</span>
															</div>
															<div className="card-desc">
																<p className="text-md-medium neutral-500">{blog.excerpt}</p>
															</div>
															<div className="card-program">
																<div className="endtime">
																	<div className="card-button">
																		<Link className="btn btn-gray" href={`/blog/${blog.slug}`}>
																			Keep Reading
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>

											{totalPages > 1 && (
												<nav aria-label="Page navigation">
													<ul className="pagination">
														<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
															<button 
																className="page-link" 
																onClick={() => setCurrentPage(currentPage - 1)}
																disabled={currentPage === 1}
																aria-label="Previous"
															>
																<span aria-hidden="true">
																	<svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
																		<path d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668" strokeLinecap="round" strokeLinejoin="round" />
																	</svg>
																</span>
															</button>
														</li>
														{[...Array(totalPages)].map((_, i) => (
															<li key={i + 1} className="page-item">
																<button 
																	className={`page-link ${currentPage === i + 1 ? 'active' : ''}`}
																	onClick={() => setCurrentPage(i + 1)}
																>
																	{i + 1}
																</button>
															</li>
														))}
														<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
															<button 
																className="page-link" 
																onClick={() => setCurrentPage(currentPage + 1)}
																disabled={currentPage === totalPages}
																aria-label="Next"
															>
																<span aria-hidden="true">
																	<svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
																		<path d="M5.99967 10.6666L10.6663 5.99992L5.99968 1.33325M10.6663 5.99992L1.33301 5.99992" strokeLinecap="round" strokeLinejoin="round" />
																	</svg>
																</span>
															</button>
														</li>
													</ul>
												</nav>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</section>

					<section className="section-box box-subscriber background-body">
						<div className="container">
							<div className="block-subscriber">
								<div className="subscriber-left">
									<span className="btn btn-brand-secondary">Join our newsletter</span>
									<h5 className="mt-15 mb-30 neutral-1000">Subscribe to see secret deals prices drop the moment you sign up!</h5>
									<NewsletterSubscribe />
								</div>
								<div className="subscriber-right" />
							</div>
						</div>
					</section>

					<section className="section-box box-media background-body">
						<div className="container-media wow fadeInUp">
							<img src="/assets/imgs/page/homepage5/media.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media2.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media3.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media4.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media5.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media6.png" alt="T7wisa" />
							<img src="/assets/imgs/page/homepage5/media7.png" alt="T7wisa" />
						</div>
					</section>
				</main>
			</Layout>
		</>
	)
}
