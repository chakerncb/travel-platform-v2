'use client'
import { useState, useEffect } from 'react'
import ByAttraction from '@/src/components/Filter/ByAttraction'
import ByDuration from '@/src/components/Filter/ByDuration'
import ByLanguage from '@/src/components/Filter/ByLanguage'
import ByPagination from '@/src/components/Filter/ByPagination'
import ByPrice from '@/src/components/Filter/ByPrice'
import ByRating from '@/src/components/Filter/ByRating'
import SortToursFilter from '@/src/components/elements/SortToursFilter'
import TourCard2 from '@/src/components/elements/tourcard/TourCard2'
import Layout from "@/src/components/layout/Layout"
import useTourFilter from '@/src/util/useTourFilter'
import Link from "next/link"

interface Tour {
	id: number
	type: string
	title: string
	description: string
	short_description?: string
	price: number
	duration_days: number
	max_group_size?: number
	difficulty_level: string
	start_date?: string
	end_date?: string
	is_active: boolean
	is_eco_friendly: boolean
	included_services?: string[]
	excluded_services?: string[]
	destinations?: any[]
	hotels?: any[]
	reviews_count?: number
	average_rating?: number
	remaining_places?: number
	created_at: string
	updated_at: string
}

export default function TourGrid3() {
	const [apiTours, setApiTours] = useState<Tour[]>([])
	const [loading, setLoading] = useState(true)
	const [popularTours, setPopularTours] = useState<Tour[]>([])

	useEffect(() => {
		fetchTours()
		fetchPopularTours()
	}, [])

	useEffect(() => {
		console.log('API Tours updated:', apiTours.length)
		console.log('Transformed tours:', toursData.length)
	}, [apiTours])

	const fetchTours = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/tours?active=1&per_page=100`)
			if (response.ok) {
				const result = await response.json()
				const tours = result.data || []
				setApiTours(tours)
			}
		} catch (error) {
			console.error('Error fetching tours:', error)
		} finally {
			setLoading(false)
		}
	}

	const fetchPopularTours = async () => {
		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/tours?active=1&per_page=5`)
			if (response.ok) {
				const result = await response.json()
				const tours = result.data || []
				setPopularTours(tours.slice(0, 5))
			}
		} catch (error) {
			console.error('Error fetching popular tours:', error)
		}
	}

	// Transform API data to match the expected format for the filter hook
	const toursData = apiTours.map(tour => ({
		id: tour.id,
		name: tour.title, // Hook expects 'name'
		title: tour.title,
		description: tour.description,
		shortDescription: tour.short_description || '',
		price: parseFloat(tour.price as any) || 0,
		duration: tour.duration_days,
		groupSize: tour.max_group_size || 10,
		rating: parseFloat(tour.average_rating as any) || 0,
		reviews: tour.reviews_count || 0,
		location: tour.destinations?.[0]?.name || 'Algeria',
		image: tour.destinations?.[0]?.image_url,
		tourType: tour.type || 'pre_prepared', // Hook expects 'tourType'
		activities: tour.type || 'pre_prepared', // Hook expects string, not array
		activity: tour.type || 'pre_prepared',
		language: 'English', // Hook expects single string
		attraction: tour.destinations?.[0]?.name || 'Algeria', // Hook expects single string
		attractions: tour.destinations?.map(d => d.name).filter(Boolean) || [],
		languages: ['English', 'French', 'Arabic'],
		difficulty: tour.difficulty_level,
		isEcoFriendly: tour.is_eco_friendly,
		destinations: tour.destinations,
		hotels: tour.hotels,
		includedServices: tour.included_services || [],
		excludedServices: tour.excluded_services || []
	}))
	const {
		filter,
		sortCriteria,
		itemsPerPage,
		currentPage,
		uniqueActivities,
		uniqueLanguages,
		uniqueAttractions,
		uniqueRatings,
		sortedTours,
		totalPages,
		paginatedTours,
		maxPrice,
		handleCheckboxChange,
		handleSortChange,
		handlePriceRangeChange,
		handleDurationRangeChange,
		handleItemsPerPageChange,
		handlePageChange,
		handlePreviousPage,
		handleNextPage,
		handleClearFilters,
		startItemIndex,
		endItemIndex,
	} = useTourFilter(toursData)

	useEffect(() => {
		console.log('Paginated tours:', paginatedTours.length)
		console.log('Total pages:', totalPages)
	}, [paginatedTours, totalPages])

	return (
		<>

			<Layout headerStyle={1} footerStyle={1}>
				<main className="main">
					<section className="box-section block-banner-tourlist" style={{ backgroundImage: 'url(assets/imgs/page/tour/banner5.png)' }}>
						<div className="container">
							<div className="text-center">
								<h3>Journey with Travila - Begin Your Story!</h3>
								<h6 className="heading-6-medium">Easily search for top tours offered by our professional network</h6>
							</div>
						</div>
					</section>
					<section className="box-section block-content-tourlist background-body">
						<div className="container">
							<div className="box-content-main">
								<div className="content-right">
									<div className="box-filters mb-25 pb-5 border-bottom border-1">
										<SortToursFilter
											sortCriteria={sortCriteria}
											handleSortChange={handleSortChange}
											itemsPerPage={itemsPerPage}
											handleItemsPerPageChange={handleItemsPerPageChange}
											handleClearFilters={handleClearFilters}
											startItemIndex={startItemIndex}
											endItemIndex={endItemIndex}
											sortedTours={sortedTours}
										/>
									</div>
									{loading ? (
										<div className="text-center py-5">
											<div className="spinner-border text-primary" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
											<p className="mt-3">Loading tours...</p>
										</div>
									) : paginatedTours.length === 0 ? (
										<div className="text-center py-5">
											<h5 className="neutral-500 mb-3">No tours found</h5>
											<p className="text-md-medium neutral-500">
												Try adjusting your filters to see more results.
											</p>
										</div>
									) : (
										<>
											<div className="box-grid-tours wow fadeIn">
												<div className="row">
													{paginatedTours.map((tour) => (
														<div className="col-xl-6 col-lg-12 col-md-6" key={tour.id}>
															<TourCard2 tour={tour} />
														</div>
													))}
												</div>
											</div>
											
											<ByPagination
												handlePreviousPage={handlePreviousPage}
												totalPages={totalPages}
												currentPage={currentPage}
												handleNextPage={handleNextPage}
												handlePageChange={handlePageChange}
											/>
										</>
									)}
								</div>
								<div className="content-left order-lg-first">
									<div className="sidebar-left border-1 background-body">
										<div className="box-filters-sidebar">
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">Filter Price </h6>
												<ByPrice
													filter={filter}
													handlePriceRangeChange={handlePriceRangeChange}
													maxPrice={maxPrice}
												/>
											</div>
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">By Attractions</h6>
												<ByAttraction
													uniqueAttractions={uniqueAttractions}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">By Durations</h6>
												<ByDuration
													filter={filter}
													handleDurationRangeChange={handleDurationRangeChange}
												/>
											</div>
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">Review Score </h6>
												<ByRating
													uniqueRatings={uniqueRatings}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
											<div className="block-filter border-1">
												<h6 className="text-lg-bold item-collapse neutral-1000">By Language </h6>
												<ByLanguage
													uniqueLanguages={uniqueLanguages}
													filter={filter}
													handleCheckboxChange={handleCheckboxChange}
												/>
											</div>
										</div>
									</div>
									<div className="sidebar-left border-1 background-body">
										<h6 className="text-lg-bold neutral-1000">Popular Tours</h6>
										<div className="box-popular-posts">
											<ul>
												{popularTours.map((tour) => (
													<li key={tour.id}>
														<div className="card-post">
															<div className="card-image">
																<Link href={`/tour-detail/${tour.id}`}>
																	<img 
																		src={tour.destinations?.[0]?.image_url} 
																		alt={tour.title} 
																	/>
																</Link>
															</div>
															<div className="card-info">
																<Link className="text-xs-bold" href={`/tour-detail/${tour.id}`}>
																	{tour.title}
																</Link>
																<span className="price text-sm-bold neutral-1000">
																	DA {parseFloat(tour.price as any).toFixed(2)}
																</span>
															</div>
														</div>
													</li>
												))}
											</ul>
										</div>
										{popularTours.length > 0 && (
											<div className="box-see-more mt-20 mb-25">
												<Link className="link-see-more" href="/tours">
													See more
													<svg width={8} height={6} viewBox="0 0 8 6" xmlns="http://www.w3.org/2000/svg">
														<path d="M7.89553 1.02367C7.75114 0.870518 7.50961 0.864815 7.35723 1.00881L3.9998 4.18946L0.642774 1.00883C0.490387 0.86444 0.249236 0.870534 0.104474 1.02369C-0.0402885 1.17645 -0.0338199 1.4176 0.118958 1.56236L3.73809 4.99102C3.81123 5.06036 3.90571 5.0954 3.9998 5.0954C4.0939 5.0954 4.18875 5.06036 4.26191 4.99102L7.88104 1.56236C8.03382 1.41758 8.04029 1.17645 7.89553 1.02367Z" />
													</svg>
												</Link>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</section>
					<section className="section-box box-media background-body">
						<div className="container-media wow fadeInUp"> <img src="/assets/imgs/page/homepage5/media.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media2.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media3.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media4.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media5.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media6.png" alt="Travila" /><img src="/assets/imgs/page/homepage5/media7.png" alt="Travila" /></div>
					</section>
				</main>

			</Layout>
		</>
	)
}