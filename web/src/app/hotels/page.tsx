'use client'
import { useState, useEffect } from 'react'
import Layout from "@/src/components/layout/Layout"
import Link from "next/link"
import { hotelService } from '@/src/services/hotelService'
import HotelCard1 from '@/src/components/elements/hotelcard/HotelCard1'
import ByPagination from '@/src/components/Filter/ByPagination'
import SearchFilterBottom from '@/src/components/elements/SearchFilterBottom'
import SwiperGroup8Slider from '@/src/components/slider/SwiperGroup8Slider'

interface HotelSpecifications {
	has_wifi?: boolean
	has_parking?: boolean
	has_pool?: boolean
	has_gym?: boolean
	has_spa?: boolean
	has_restaurant?: boolean
	has_bar?: boolean
	has_room_service?: boolean
	has_airport_shuttle?: boolean
	has_pet_friendly?: boolean
	has_air_conditioning?: boolean
	has_laundry?: boolean
	has_conference_room?: boolean
	check_in_time?: string
	check_out_time?: string
	total_rooms?: number
}

interface HotelImage {
	id: number
	image_path: string
	alt_text: string
	is_primary: boolean
	order: number
}

interface ApiHotelDto {
	id: number
	name: string
	description?: string
	city: string
	country: string
	address: string
	latitude?: string
	longitude?: string
	phone?: string
	email?: string
	website?: string
	star_rating: number
	price_per_night: string | number
	is_active: boolean
	specifications?: HotelSpecifications
	images?: HotelImage[]
	primary_image?: string
	created_at?: string
	updated_at?: string
}

interface HotelSpecifications {
	has_wifi?: boolean
	has_parking?: boolean
	has_pool?: boolean
	has_gym?: boolean
	has_spa?: boolean
	has_restaurant?: boolean
	has_bar?: boolean
	has_room_service?: boolean
	has_airport_shuttle?: boolean
	has_pet_friendly?: boolean
	has_air_conditioning?: boolean
	has_laundry?: boolean
	has_conference_room?: boolean
	check_in_time?: string
	check_out_time?: string
	total_rooms?: number
}

interface HotelImage {
	id: number
	image_path: string
	alt_text: string
	is_primary: boolean
	order: number
}

interface TransformedHotel {
	id: number
	name: string
	location: string
	city: string
	country: string
	address: string
	rating: number
	reviews: number
	price: number
	image: string
	images?: HotelImage[]
	amenities: string[]
	starRating: number
	specifications?: HotelSpecifications
	description?: string
	phone?: string
	email?: string
	website?: string
}

export default function HotelGrid() {
	const [apiHotels, setApiHotels] = useState<ApiHotelDto[]>([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedCity, setSelectedCity] = useState<string>('all')
	const [selectedStarRating, setSelectedStarRating] = useState<number>(0)
	const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
	const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const [itemsPerPage, setItemsPerPage] = useState(12)
	const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high' | 'rating'>('rating')

	useEffect(() => {
		fetchHotels()
	}, [])

	const fetchHotels = async () => {
		try {
			setLoading(true)
			const data = await hotelService.getAll()
			setApiHotels(data)
			
			// Calculate max price for price range filter
			if (data.length > 0) {
				const maxHotelPrice = Math.max(...data.map(h => parseFloat(h.price_per_night as any) || 0))
				setPriceRange(prev => ({ ...prev, max: Math.ceil(maxHotelPrice) }))
			}
		} catch (error) {
			console.error('Error fetching hotels:', error)
		} finally {
			setLoading(false)
		}
	}

	// Transform API data to match the expected format
	const transformedHotels: TransformedHotel[] = apiHotels.map(hotel => {
		// Extract amenities from specifications
		const specs = hotel.specifications || {}
		const amenities: string[] = []
		
		if (specs.has_wifi) amenities.push('WiFi')
		if (specs.has_parking) amenities.push('Parking')
		if (specs.has_pool) amenities.push('Pool')
		if (specs.has_gym) amenities.push('Gym')
		if (specs.has_spa) amenities.push('Spa')
		if (specs.has_restaurant) amenities.push('Restaurant')
		if (specs.has_bar) amenities.push('Bar')
		if (specs.has_room_service) amenities.push('Room Service')
		if (specs.has_airport_shuttle) amenities.push('Airport Shuttle')
		if (specs.has_pet_friendly) amenities.push('Pet Friendly')
		if (specs.has_air_conditioning) amenities.push('Air Conditioning')
		if (specs.has_laundry) amenities.push('Laundry')
		if (specs.has_conference_room) amenities.push('Conference Room')

		return {
			id: hotel.id,
			name: hotel.name,
			location: `${hotel.city}, ${hotel.country}`,
			city: hotel.city,
			country: hotel.country,
			address: hotel.address,
			rating: 0, // Will be calculated from reviews if available
			reviews: 0,
			price: parseFloat(hotel.price_per_night as any) || 0,
			image: hotel.primary_image || hotel.images?.[0]?.image_path || '/assets/imgs/page/hotel/hotel1.png',
			images: hotel.images || [],
			amenities: amenities,
			starRating: hotel.star_rating,
			specifications: hotel.specifications,
			description: hotel.description,
			phone: hotel.phone,
			email: hotel.email,
			website: hotel.website
		}
	})

	// Get unique values for filters
	const uniqueCities = Array.from(new Set(transformedHotels.map(h => h.city))).sort()
	const uniqueAmenities = Array.from(
		new Set(transformedHotels.flatMap(h => h.amenities))
	).sort()
	const starRatings = [5, 4, 3, 2, 1]

	// Filter hotels
	const filteredHotels = transformedHotels.filter(hotel => {
		const matchesSearch = searchQuery === '' || 
			hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
		
		const matchesCity = selectedCity === 'all' || hotel.city === selectedCity
		const matchesStarRating = selectedStarRating === 0 || hotel.starRating >= selectedStarRating
		const matchesPrice = hotel.price >= priceRange.min && hotel.price <= priceRange.max
		const matchesAmenities = selectedAmenities.length === 0 || 
			selectedAmenities.every(amenity => hotel.amenities.includes(amenity))

		return matchesSearch && matchesCity && matchesStarRating && matchesPrice && matchesAmenities
	})

	// Sort hotels
	const sortedHotels = [...filteredHotels].sort((a, b) => {
		switch (sortBy) {
			case 'name':
				return a.name.localeCompare(b.name)
			case 'price-low':
				return a.price - b.price
			case 'price-high':
				return b.price - a.price
			case 'rating':
				return b.rating - a.rating
			default:
				return 0
		}
	})

	// Pagination
	const totalPages = Math.ceil(sortedHotels.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const paginatedHotels = sortedHotels.slice(startIndex, endIndex)

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
		setSelectedCity('all')
		setSelectedStarRating(0)
		setPriceRange({ min: 0, max: priceRange.max })
		setSelectedAmenities([])
		setCurrentPage(1)
	}

	const handleAmenityToggle = (amenity: string) => {
		setSelectedAmenities(prev => 
			prev.includes(amenity)
				? prev.filter(a => a !== amenity)
				: [...prev, amenity]
		)
		setCurrentPage(1)
	}

	return (
		<Layout headerStyle={1} footerStyle={1}>
			<main className="main">
				{/* Banner Section */}
				<section className="box-section block-banner-tourlist">
					<div className="container">
						<div className="text-center">
							<h3>A World Of Luxury Awaits You</h3>
							<h6 className="heading-6-medium">We Provide Our Best Facilities For You</h6>
						</div>
						<div className="box-search-advance box-search-advance-3 background-card wow fadeInUp">
							<SearchFilterBottom />
						</div>
					</div>
				</section>

				{/* Popular Destinations Slider */}
				{/* <section className="section-box box-popular-destinations background-body">
					<div className="container">
						<div className="box-swiper box-swiper-pd mt-0 wow fadeInDown">
							<div className="swiper-container swiper-group-8">
								// {/* <SwiperGroup8Slider /> 
							</div>
							<div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-group-8">
								<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
									<path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
							<div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-group-8">
								<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16">
									<path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</div>
						</div>
					</div>
				</section> */}

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
													placeholder="Search hotels..."
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value)
														setCurrentPage(1)
													}}
												/>
											</div>
										</div>
										<div className="col-lg-2 col-md-6 mb-3 mb-lg-0">
											<select
												className="form-select"
												value={sortBy}
												onChange={(e) => setSortBy(e.target.value as any)}
											>
												<option value="rating">Highest Rated</option>
												<option value="name">Name (A-Z)</option>
												<option value="price-low">Price: Low to High</option>
												<option value="price-high">Price: High to Low</option>
											</select>
										</div>
										<div className="col-lg-2 col-md-6 mb-3 mb-lg-0">
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
										<div className="col-lg-2 col-md-6 mb-3 mb-lg-0">
											<div className="text-center">
												<span className="text-sm-medium neutral-500">
													{startIndex + 1}-{Math.min(endIndex, sortedHotels.length)} of {sortedHotels.length}
												</span>
											</div>
										</div>
										<div className="col-lg-3 col-md-6">
											<button 
												className="btn btn-secondary w-100"
												onClick={handleClearFilters}
											>
												Clear All Filters
											</button>
										</div>
									</div>
								</div>

								{/* Hotels Grid */}
								{loading ? (
									<div className="text-center py-5">
										<div className="spinner-border text-primary" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
										<p className="mt-3">Loading hotels...</p>
									</div>
								) : paginatedHotels.length === 0 ? (
									<div className="text-center py-5">
										<h5 className="neutral-500 mb-3">No hotels found</h5>
										<p className="text-md-medium neutral-500">
											Try adjusting your filters to see more results.
										</p>
									</div>
								) : (
									<>
										<div className="box-grid-tours wow fadeIn">
											<div className="row">
												{paginatedHotels.map((hotel) => (
													<div className="col-xl-4 col-lg-6 col-md-6" key={hotel.id}>
														<HotelCard1 hotel={hotel} />
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

							{/* Sidebar */}
							<div className="content-left order-lg-first">
								{/* Price Filter */}
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">Filter Price</h6>
											<div className="box-collapse">
												<div className="price-range-wrapper">
													<div className="price-inputs mb-3">
														<div className="row">
															<div className="col-6">
																<label className="text-sm-medium neutral-500">Min Price</label>
																<input
																	type="number"
																	className="form-control"
																	value={priceRange.min}
																	onChange={(e) => {
																		setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))
																		setCurrentPage(1)
																	}}
																/>
															</div>
															<div className="col-6">
																<label className="text-sm-medium neutral-500">Max Price</label>
																<input
																	type="number"
																	className="form-control"
																	value={priceRange.max}
																	onChange={(e) => {
																		setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))
																		setCurrentPage(1)
																	}}
																/>
															</div>
														</div>
													</div>
													<div className="text-sm-medium neutral-500">
														DA {priceRange.min} - DA {priceRange.max}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* City Filter */}
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">By City</h6>
											<div className="box-collapse scrollFilter">
												<ul className="list-filter-checkbox">
													<li>
														<label className="cb-container">
															<input 
																type="radio" 
																name="city"
																checked={selectedCity === 'all'}
																onChange={() => {
																	setSelectedCity('all')
																	setCurrentPage(1)
																}}
															/>
															<span className="text-sm-medium">All Cities</span>
															<span className="checkmark" />
														</label>
														<span className="number-item">{transformedHotels.length}</span>
													</li>
													{uniqueCities.map((city) => (
														<li key={city}>
															<label className="cb-container">
																<input 
																	type="radio" 
																	name="city"
																	checked={selectedCity === city}
																	onChange={() => {
																		setSelectedCity(city)
																		setCurrentPage(1)
																	}}
																/>
																<span className="text-sm-medium">{city}</span>
																<span className="checkmark" />
															</label>
															<span className="number-item">
																{transformedHotels.filter(h => h.city === city).length}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Star Rating Filter */}
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">Star Rating</h6>
											<div className="box-collapse">
												<ul className="list-filter-checkbox">
													<li>
														<label className="cb-container">
															<input 
																type="radio" 
																name="starRating"
																checked={selectedStarRating === 0}
																onChange={() => {
																	setSelectedStarRating(0)
																	setCurrentPage(1)
																}}
															/>
															<span className="text-sm-medium">All Ratings</span>
															<span className="checkmark" />
														</label>
													</li>
													{starRatings.map((stars) => (
														<li key={stars}>
															<label className="cb-container">
																<input 
																	type="radio" 
																	name="starRating"
																	checked={selectedStarRating === stars}
																	onChange={() => {
																		setSelectedStarRating(stars)
																		setCurrentPage(1)
																	}}
																/>
																<span className="text-sm-medium">
																	{Array.from({ length: stars }).map((_, i) => (
																		<span key={i}>⭐</span>
																	))}
																	{stars === 5 ? '' : ' & up'}
																</span>
																<span className="checkmark" />
															</label>
															<span className="number-item">
																{transformedHotels.filter(h => h.starRating >= stars).length}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Amenities Filter */}
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold item-collapse neutral-1000">Amenities</h6>
											<div className="box-collapse scrollFilter">
												<ul className="list-filter-checkbox">
													{uniqueAmenities.slice(0, 10).map((amenity) => (
														<li key={amenity}>
															<label className="cb-container">
																<input 
																	type="checkbox"
																	checked={selectedAmenities.includes(amenity)}
																	onChange={() => handleAmenityToggle(amenity)}
																/>
																<span className="text-sm-medium">{amenity}</span>
																<span className="checkmark" />
															</label>
															<span className="number-item">
																{transformedHotels.filter(h => h.amenities.includes(amenity)).length}
															</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Statistics */}
								<div className="sidebar-left border-1 background-body">
									<div className="box-filters-sidebar">
										<div className="block-filter border-1">
											<h6 className="text-lg-bold neutral-1000">Statistics</h6>
											<div className="box-collapse">
												<div className="item-collapse">
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Total Hotels</span>
														<span className="text-sm-bold neutral-1000">{transformedHotels.length}</span>
													</div>
													<div className="d-flex justify-content-between mb-2">
														<span className="text-sm-medium neutral-500">Cities</span>
														<span className="text-sm-bold neutral-1000">{uniqueCities.length}</span>
													</div>
													<div className="d-flex justify-content-between">
														<span className="text-sm-medium neutral-500">Average Rating</span>
														<span className="text-sm-bold neutral-1000">
															{(transformedHotels.reduce((acc, h) => acc + h.rating, 0) / transformedHotels.length).toFixed(1)}
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

				{/* Install App Section */}
				<section className="section-box box-install-app-2 background-body">
					<div className="container">
						<div className="block-install-app background-6">
							<div className="row align-items-center">
								<div className="col-lg-6">
									<div className="box-item-download wow fadeInUp">
										<span className="btn btn-brand-secondary">Install APP   Get  discount code</span>
										<h5 className="mt-15 mb-30">Up to 55% Discount<br className="d-none d-lg-block" />and lots of special gifts</h5>
										<div className="box-button-download">
											<Link href="#"><img src="/assets/imgs/page/homepage6/googleplay.png" alt="TOURZ" /></Link>
											<Link href="#"><img src="/assets/imgs/page/homepage6/appstore.png" alt="TOURZ" /></Link>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<img className="wow fadeInUp" src="/assets/imgs/page/homepage6/img-download-app.png" alt="TOURZ" />
								</div>
							</div>
						</div>
					</div>
				</section>

				<div className="pb-90 background-body" />

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