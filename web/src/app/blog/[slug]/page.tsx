'use client'
import Layout from "@/src/components/layout/Layout"
import NewsletterSubscribe from '@/src/components/elements/NewsletterSubscribe'
import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from 'next/navigation'
import { blogService, Blog, BlogComment } from "@/src/services/blogService"
import { imageService } from "@/src/services/imageService"

export default function BlogDetail() {
	const params = useParams()
	const slug = params.slug as string
	
	const [blog, setBlog] = useState<Blog | null>(null)
	const [comments, setComments] = useState<BlogComment[]>([])
	const [loading, setLoading] = useState(true)
	const [commentForm, setCommentForm] = useState({
		name: '',
		email: '',
		comment: '',
		parent_id: null as number | null
	})
	const [replyTo, setReplyTo] = useState<{ id: number, name: string } | null>(null)
	const [submitting, setSubmitting] = useState(false)

	useEffect(() => {
		loadBlog()
	}, [slug])

	const loadBlog = async () => {
		try {
			setLoading(true)
			const response = await blogService.getBlogBySlug(slug)
			setBlog(response.blog)
			setComments(response.blog.comments || [])
		} catch (error) {
			console.error('Error loading blog:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSubmitComment = async (e: React.FormEvent) => {
		e.preventDefault()
		
		if (!commentForm.name || !commentForm.email || !commentForm.comment) {
			alert('Please fill in all fields')
			return
		}

		try {
			setSubmitting(true)
			await blogService.addComment(slug, {
				...commentForm,
				parent_id: replyTo?.id || null
			})
			
			alert('Comment submitted successfully! It will appear after approval.')
			setCommentForm({ name: '', email: '', comment: '', parent_id: null })
			setReplyTo(null)
		} catch (error) {
			console.error('Error submitting comment:', error)
			alert('Failed to submit comment. Please try again.')
		} finally {
			setSubmitting(false)
		}
	}

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	if (loading) {
		return (
			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<div className="text-center my-5 py-5">
						<div className="spinner-border" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
					</div>
				</main>
			</Layout>
		)
	}

	if (!blog) {
		return (
			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<div className="text-center my-5 py-5">
						<h2>Blog not found</h2>
						<Link href="/blog-grid" className="btn btn-primary mt-3">Back to Blog</Link>
					</div>
				</main>
			</Layout>
		)
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
								<li><Link href="/blog-grid">Blog</Link><span className="arrow-right">
									<svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
										<path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
									</svg></span></li>
								<li><span className="text-breadcrumb">{blog.title}</span></li>
							</ul>
						</div>
					</section>

					<section className="section-box box-content-detail background-body">
						<div className="container">
							<div className="row">
								<div className="col-lg-10 mx-auto">
									<div className="box-detail-content">
										<div className="head-detail mb-4">
											<Link className="btn btn-label-tag background-1" href="#">
												{blog.category.name}
											</Link>
											<h1 className="neutral-1000 mt-3">{blog.title}</h1>
											<div className="meta-info mt-3">
												<div className="author-info d-flex flex-wrap align-items-center gap-2">
													{/* <span className="text-md-bold neutral-1000">By {blog.author.name}</span> */}
													<span className="neutral-500">•</span>
													<span className="text-sm neutral-500">{formatDate(blog.published_at)}</span>
													<span className="neutral-500">•</span>
													<span className="text-sm neutral-500">{blog.reading_time} min read</span>
													<span className="neutral-500">•</span>
													<span className="text-sm neutral-500">{blog.views} views</span>
												</div>
											</div>
										</div>

										<div className="featured-image mb-4">
											<img 
												src={imageService.getImageUrl(blog.featured_image || "") || "/assets/imgs/page/blog/news.png"} 
												alt={blog.title} 
												className="w-100"
												style={{ borderRadius: '8px', maxHeight: '500px', objectFit: 'cover' }}
											/>
										</div>

										<div 
											className="content-detail mb-5"
											dangerouslySetInnerHTML={{ __html: blog.content }}
											style={{ lineHeight: '1.8' }}
										/>

										{/* Comments Section */}
										<div className="box-comments mt-5 pt-5" style={{ borderTop: '1px solid #e5e5e5' }}>
											<h3 className="neutral-1000 mb-4">Comments ({comments.length})</h3>

											{/* Comment Form */}
											<div className="box-comment-form mb-5 p-4" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
												<h4 className="neutral-1000 mb-3">
													{replyTo ? `Replying to ${replyTo.name}` : 'Leave a Comment'}
												</h4>
												{replyTo && (
													<button
														type="button"
														className="btn btn-sm btn-secondary mb-3"
														onClick={() => setReplyTo(null)}
													>
														Cancel Reply
													</button>
												)}
												<form onSubmit={handleSubmitComment}>
													<div className="row">
														<div className="col-md-6 mb-3">
															<input
																type="text"
																className="form-control"
																placeholder="Your Name *"
																value={commentForm.name}
																onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
																required
															/>
														</div>
														<div className="col-md-6 mb-3">
															<input
																type="email"
																className="form-control"
																placeholder="Your Email *"
																value={commentForm.email}
																onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
																required
															/>
														</div>
														<div className="col-12 mb-3">
															<textarea
																className="form-control"
																rows={5}
																placeholder="Your Comment *"
																value={commentForm.comment}
																onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
																required
															/>
														</div>
														<div className="col-12">
															<button
																type="submit"
																className="btn btn-primary"
																disabled={submitting}
															>
																{submitting ? 'Submitting...' : 'Submit Comment'}
															</button>
														</div>
													</div>
												</form>
											</div>

											{/* Comments List */}
											<div className="list-comments">
												{comments.length === 0 ? (
													<p className="text-center neutral-500">No comments yet. Be the first to comment!</p>
												) : (
													comments.map((comment) => (
														<div key={comment.id} className="item-comment mb-4">
															<div className="comment-content p-4" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
																<div className="comment-header d-flex justify-content-between align-items-start mb-2">
																	<div>
																		<h5 className="neutral-1000 mb-1">{comment.name}</h5>
																		<p className="text-sm neutral-500 mb-0">{formatDate(comment.created_at)}</p>
																	</div>
																	<button
																		className="btn btn-sm btn-link"
																		onClick={() => setReplyTo({ id: comment.id, name: comment.name })}
																	>
																		Reply
																	</button>
																</div>
																<p className="neutral-700 mb-0">{comment.comment}</p>

																{/* Replies */}
																{comment.replies && comment.replies.length > 0 && (
																	<div className="comment-replies mt-3 ms-4">
																		{comment.replies.map((reply) => (
																			<div key={reply.id} className="item-reply mb-3 p-3" style={{ background: '#fff', borderRadius: '8px', borderLeft: '3px solid #3b71fe' }}>
																				<div className="reply-header mb-2">
																					<h6 className="neutral-1000 mb-1">{reply.name}</h6>
																					<p className="text-sm neutral-500 mb-0">{formatDate(reply.created_at)}</p>
																				</div>
																				<p className="neutral-700 mb-0">{reply.comment}</p>
																			</div>
																		))}
																	</div>
																)}
															</div>
														</div>
													))
												)}
											</div>
										</div>
									</div>
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
				</main>
			</Layout>
		</>
	)
}
