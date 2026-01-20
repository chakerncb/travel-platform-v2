'use client'
import { useState, useEffect } from 'react'
import Layout from "@/src/components/layout/Layout"
import Link from "next/link"
import { destinationService } from '@/src/services/destinationService'
import { DestinationDto } from '@/src/types/api'

interface TransformedDestination extends DestinationDto {
	tourCount?: number
}

export default function DestinationGrid() {
	const [destinations, setDestinations] = useState<TransformedDestination[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCountry, setSelectedCountry] = useState<string>('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(12)
	const [sortBy, setSortBy] = useState<'name' | 'tours'>('name')

	useEffect(() => {
		fetchDestinations()
	}, [])

	const fetchDestinations = async () => {
		try {
			setLoading(true)
			const data = await destinationService.getAll()
			// Only show active destinations
			const activeDestinations = data.filter(d => d.is_active)
			setDestinations(activeDestinations)
		} catch (error) {
			console.error('Error fetching destinations:', error)
		} finally {
			setLoading(false)
		}
	}

	// Get unique countries from destinations
	const uniqueCountries = Array.from(
		new Set(destinations.map(d => d.country).filter(Boolean))
	).sort()

	// Filter destinations
	const filteredDestinations = destinations.filter(destination => {
		const matchesSearch = searchQuery === '' || 
			destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			destination.description?.toLowerCase().includes(searchQuery.toLowerCase())
		
		const matchesCountry = selectedCountry === 'all' || destination.country === selectedCountry

		return matchesSearch && matchesCountry
	})

	// Sort destinations
	const sortedDestinations = [...filteredDestinations].sort((a, b) => {
		if (sortBy === 'name') {
			return a.name.localeCompare(b.name)
		}
		// Sort by tour count (if available)
		return (b.tourCount || 0) - (a.tourCount || 0)
	})

	// Pagination
	const totalPages = Math.ceil(sortedDestinations.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedDestinations = sortedDestinations.slice(startIndex, endIndex)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const handlePreviousPage = () => {
		if (currentPage > 1) {
			handlePageChange(currentPage - 1)
		}
	}

	const handleNextPage = () => {
		if (currentPage < totalPages) {
			handlePageChange(currentPage + 1)
		}
	}

	const handleClearFilters = () => {
		setSearchQuery('')
		setSelectedCountry('all')
		setCurrentPage(1)
	}

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				{/* Banner Section */}
				<section className="box-section block-banner-tourlist" style={{ backgroundImage: 'url(/assets/imgs/page/tour/banner5.png)' }}>
					<div className="container">
						<div className="text-center">
							<h3>Explore Amazing Destinations</h3>
							<h6 className="heading-6-medium">Discover the beauty of Algeria's most stunning locations</h6>
						</div>
					</div>
				</section>

				{/* Main Content Section */}
				<section className="box-section block-content-tourlist background-body">
					<div className="container">
						<div className="box-content-main">
							{/* Main Content */}
							<div className="content-right">
								{/* Filters Bar */}
								<div className="box-filters mb-25 pb-5 border-bottom border-1">
									<div className="row align-items-center">
										<div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
											<div className="box-filter-search">
												<input
													type="text"
													className="form-control"
													placeholder="Search destinations..."
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value)
														setCurrentPage(1)
													}}
												/>
											</div>
										</div>
										<div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
											<select
												className="form-select"
												value={sortBy}
												onChange={(e) => setSortBy(e.target.value as 'name' | 'tours')}
											>
												<option value="name">Sort by Name</option>
												<option value="tours">Sort by Popularity</option>
											</select>
										</div>
										<div className="col-lg-3 col-md-6 mb-3 mb-lg-0">
											<select
												className="form-select"
												value={itemsPerPage}
												onChange={(e) => {
													setItemsPerPage(Number(e.target.value))
													setCurrentPage(1)
												}}
											>
												<option value={12}>12 per page</option>
												<option value={24}>24 per page</option>
												<option value={36}>36 per page</option>
											</select>
										</div>
										<div className="col-lg-3 col-md-6">
											<button 
												className="btn btn-secondary w-100"
												onClick={handleClearFilters}
											>
												Clear Filters
											</button>
										</div>
									</div>
									<div className="mt-3">
										<span className="text-sm-medium neutral-500">
											Showing {startIndex + 1}-{Math.min(endIndex, sortedDestinations.length)} of {sortedDestinations.length} destinations
										</span>
									</div>
								</div>

								{/* Destinations Grid */}
								{loading ? (
									<div className="text-center py-5">
										<div className="spinner-border text-primary" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
										<p className="mt-3">Loading destinations...</p>
									</div>
								) : paginatedDestinations.length === 0 ? (
									<div className="text-center py-5">
										<h5 className="neutral-500 mb-3">No destinations found</h5>
										<p className="text-md-medium neutral-500">
											Try adjusting your filters to see more results.
										</p>
									</div>
								) : (
									<>
										<div className="box-grid-tours wow fadeIn">
											<div className="row">
												{paginatedDestinations.map((destination) => (
													<div className="col-xl-4 col-lg-6 col-md-6" key={destination.id}>
														<div className="card-journey-small background-card">
															<div className="card-image">
																<Link 
																	className="label bestsale" 
																	href={`/destination/${destination.id}`}
																>
																	{destination.country || 'Algeria'}
																</Link>
																<Link href={`/destination/${destination.id}`}>
																	<img
																		src={
																			destination.primary_image
																				? destination.primary_image
																				: (destination.images && destination.images.length > 0 && typeof destination.images[0] === 'object' && 'image_path' in destination.images[0])
																					? (destination.images[0] as any).image_path
																					: '/assets/imgs/page/tour/tour-1.png'
																		}
																		alt={
																			destination.images && destination.images.length > 0 && typeof destination.images[0] === 'object' && 'alt_text' in destination.images[0]
																				? (destination.images[0] as any).alt_text || destination.name
																				: destination.name
																		}
																		onError={(e) => {
																			const target = e.target as HTMLImageElement
																			target.src = '/assets/imgs/page/tour/tour-1.png'
																		}}
																	/>
																</Link>
															</div>
															<div className="card-info">
																<div className="card-rating">
																	<div className="card-left">
																		<span className="text-sm-medium neutral-500">
																			{destination.city || destination.country}
																		</span>
																	</div>
																</div>
																<div className="card-title">
																	<Link 
																		className="text-lg-bold neutral-1000" 
																		href={`/destination-details?id=${destination.id}`}
																	>
																		{destination.name}
																	</Link>
																</div>
																<div className="card-program">
																	<div className="card-description">
																		<p className="text-sm-medium neutral-500">
																			{destination.description 
																				? destination.description.slice(0, 100) + (destination.description.length > 100 ? '...' : '')
																				: 'Discover this amazing destination'}
																		</p>
																	</div>
																</div>
																<div className="card-meta">
																	<div className="card-button">
																		<Link 
																			className="btn btn-gray" 
																			href={`/destination-details?id=${destination.id}`}
																		>
																			Explore
																		</Link>
																	</div>
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>

										{/* Pagination */}
										{totalPages > 1 && (
											<nav className="box-pagination">
												<ul className="pagination">
													<li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
														<a 
															className="page-link page-prev" 
															href="#"
															onClick={(e) => {
																e.preventDefault()
																handlePreviousPage()
															}}
														>
															<svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
																<path d="M6.00016 1.33325L1.3335 5.99992M1.3335 5.99992L6.00016 10.6666M1.3335 5.99992H10.6668" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</a>
													</li>
													{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
														<li 
															key={page} 
															className={`page-item ${currentPage === page ? 'active' : ''}`}
														>
															<a 
																className="page-link" 
																href="#"
																onClick={(e) => {
																	e.preventDefault()
																	handlePageChange(page)
																}}
															>
																{page}
															</a>
														</li>
													))}
													<li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
														<a 
															className="page-link page-next" 
															href="#"
															onClick={(e) => {
																e.preventDefault()
																handleNextPage()
															}}
														>
															<svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
																<path d="M6.00016 1.33325L10.6668 5.99992M10.6668 5.99992L6.00016 10.6666M10.6668 5.99992H1.3335" strokeLinecap="round" strokeLinejoin="round" />
															</svg>
														</a>
													</li>
												</ul>
											</nav>
										)}
									</>
								)}
							</div>

							{/* Sidebar */}
							<div className="content-left order-lg-first">
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										{/* Country Filter */}
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">By Country</h6>
											<div className="box-collapse scrollFilter">
												<ul className="list-filter-checkbox">
													<li>
														<label className="cb-container">
															<input 
																type="radio" 
																name="country"
																checked={selectedCountry === 'all'}
																onChange={() => {
																	setSelectedCountry('all')
																	setCurrentPage(1)
																}}
															/>
															<span className="text-sm-medium">All Countries</span>
															<span className="checkmark" />
														</label>
														<span className="number-item">
															{destinations.length}
														</span>
													</li>
													{uniqueCountries.map((country) => (
														<li key={country}>
															<label className="cb-container">
																<input 
																	type="radio" 
																	name="country"
																	checked={selectedCountry === country}
																	onChange={() => {
																		setSelectedCountry(country)
																		setCurrentPage(1)
																	}}
																/>
																<span className="text-sm-medium">{country}</span>
																<span className="checkmark" />
															</label>
															<span className="number-item">
																{destinations.filter(d => d.country === country).length}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>

										{/* Stats */}
										<div className="block-filter border-1">
											<h6 className="text-lg-bold neutral-1000">Statistics</h6>
											<div className="box-collapse">
												<div className="item-collapse">
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Total Destinations</span>
														<span className="text-sm-bold neutral-1000">{destinations.length}</span>
													</div>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Countries</span>
														<span className="text-sm-bold neutral-1000">{uniqueCountries.length}</span>
													</div>
													<div className="d-flex justify-content-between">
														<span className="text-sm-medium neutral-500">Active Destinations</span>
														<span className="text-sm-bold neutral-1000">
															{destinations.filter(d => d.is_active).length}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
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
	)
}