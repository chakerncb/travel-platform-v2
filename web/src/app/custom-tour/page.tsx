'use client'
import { useState, useEffect, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from "@/src/components/layout/Layout"
import Link from "next/link"
import TourMap from '@/src/components/elements/TourMap'
import FlightCard from '@/src/components/elements/FlightCard'
import SortToursFilter from '@/src/components/elements/SortToursFilter'
import { destinationService } from '@/src/services/destinationService'
import { hotelService } from '@/src/services/hotelService'
import { flightService } from '@/src/services/flightService'
import { DestinationDto, HotelDto, TourDestinationDto } from '@/src/types/api'
import { FlightSegmentInfo, FlightOffer } from '@/src/types/flight'
import './custom-tour.css'
import TicketCard1 from '@/src/components/elements/ticketcard/TicketCard1'
import TicketCard2 from '@/src/components/elements/ticketcard/TicketCard2'

interface SelectedDestination extends DestinationDto {
    order: number
}

interface SelectedHotel extends HotelDto {
    order: number
    price_per_night?: number
}

export default function CustomTour() {
    const { data: session } = useSession()
    const router = useRouter()
    
    const [destinations, setDestinations] = useState<DestinationDto[]>([])
    const [destinationsCitys, setDestinationsCitys] = useState<string[]>([])
    const [hotels, setHotels] = useState<HotelDto[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [selectedDestinations, setSelectedDestinations] = useState<SelectedDestination[]>([])
    const [selectedHotels, setSelectedHotels] = useState<SelectedHotel[]>([])
    const [showDestinationPicker, setShowDestinationPicker] = useState(false)
    const [showHotelPicker, setShowHotelPicker] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [isAccordion, setIsAccordion] = useState<number | null>(null)
    
    // Booking details
    const [numberOfPersons, setNumberOfPersons] = useState<number>(1)
    const [proposedPrice, setProposedPrice] = useState<string>('')
    const [notes, setNotes] = useState<string>('')
    const [showBookingForm, setShowBookingForm] = useState(false)
    
    // Flight related state
    const [flightSegments, setFlightSegments] = useState<FlightSegmentInfo[]>([])
    const [loadingFlights, setLoadingFlights] = useState(false)
    const [selectedFlights, setSelectedFlights] = useState<Map<number, FlightOffer>>(new Map())
    const [startDate, setStartDate] = useState<string>(
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
    )
    const [endDate, setEndDate] = useState<string>('')

    const handleAccordion = (key: number) => {
        setIsAccordion(prevState => prevState === key ? null : key)
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = e.target.value
        setStartDate(newStartDate)
        // If end date is before new start date, reset it
        if (endDate && new Date(endDate) < new Date(newStartDate)) {
            setEndDate('')
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(e.target.value)
    }

    const tourDurationDays = useMemo(() => {
        if (!startDate || !endDate) return selectedDestinations.length
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return Math.max(diffDays, 1)
    }, [startDate, endDate, selectedDestinations])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedDestinations, fetchedHotels] = await Promise.all([
                    destinationService.getAll(),
                    hotelService.getAll()
                ])
                setDestinations(fetchedDestinations)
                setDestinationsCitys([...new Set(fetchedDestinations.map(d => d.city).filter(Boolean) as string[])])
                setHotels(fetchedHotels)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchData()
    }, [])

    // Fetch flights when destinations change and there are multiple countries
    useEffect(() => {
        const fetchFlights = async () => {
            if (selectedDestinations.length < 2) {
                setFlightSegments([])
                return
            }

            const countries = [...new Set(selectedDestinations.map(d => d.country))]
            
            // Only fetch flights if destinations span multiple countries
            if (countries.length < 2) {
                setFlightSegments([])
                return
            }

            setLoadingFlights(true)
            try {
                const destinationsData = selectedDestinations.map(d => ({
                    city: d.city || d.name,
                    country: d.country || '',
                    latitude: d.latitude ? parseFloat(String(d.latitude)) : undefined,
                    longitude: d.longitude ? parseFloat(String(d.longitude)) : undefined
                }))

                const result = await flightService.getCustomTourFlights(
                    destinationsData,
                    startDate,
                    numberOfPersons
                )

                console.log('Flight segments received:', result.flights)
                setFlightSegments(result.flights || [])
            } catch (error) {
                console.error('Error fetching flights:', error)
                setFlightSegments([])
            } finally {
                setLoadingFlights(false)
            }
        }

        fetchFlights()
    }, [selectedDestinations, startDate, numberOfPersons])

    const addDestination = (destination: DestinationDto) => {
        if (!selectedDestinations.find(d => d.id === destination.id)) {
            setSelectedDestinations(prev => [...prev, { ...destination, order: prev.length + 1 }])
            setShowDestinationPicker(false)
            setSearchQuery('')
        }
    }

    const removeDestination = (id: number) => {
        setSelectedDestinations(prev => 
            prev.filter(d => d.id !== id).map((d, index) => ({ ...d, order: index + 1 }))
        )
    }

    const addHotel = (hotel: HotelDto) => {
        if (!selectedHotels.find(h => h.id === hotel.id)) {
            setSelectedHotels(prev => [...prev, { ...hotel, order: prev.length + 1 }])
            setShowHotelPicker(false)
            setSearchQuery('')
        }
    }

    const removeHotel = (id: number) => {
        setSelectedHotels(prev => 
            prev.filter(h => h.id !== id).map((h, index) => ({ ...h, order: index + 1 }))
        )
    }

    const handleFlightSelection = (segmentIndex: number, flight: FlightOffer) => {
        setSelectedFlights(prev => {
            const newMap = new Map(prev)
            newMap.set(segmentIndex, flight)
            return newMap
        })
    }

    const tourDestinations: TourDestinationDto[] = useMemo(() => {
        return selectedDestinations.map(dest => ({
            id: dest.id,
            name: dest.name,
            city: dest.city || '',
            country: dest.country || '',
            latitude: dest.latitude || undefined,
            longitude: dest.longitude || undefined,
            description: dest.description || dest.short_description || '',
            short_description: dest.short_description || '',
            days_at_destination: 1,
            order: dest.order,
            image_url: dest.primary_image || dest.images?.[0]?.image_path || '',
            image_alt: dest.name
        }))
    }, [selectedDestinations])

    const estimatedHotelCost = useMemo(() => {
        return selectedHotels.reduce((total, hotel) => {
            const pricePerNight = hotel.price_per_night || 100
            return total + (pricePerNight * selectedDestinations.length) // Assuming 1 night per destination
        }, 0)
    }, [selectedHotels, selectedDestinations])

    const totalFlightCost = useMemo(() => {
        let total = 0
        selectedFlights.forEach((flight) => {
            total += parseFloat(flight.price.total)
        })
        return total
    }, [selectedFlights])

    const minimumPrice = useMemo(() => {
        const destinationCost = selectedDestinations.length * 50 // Base cost per destination
        return (destinationCost + estimatedHotelCost + totalFlightCost) * numberOfPersons
    }, [selectedDestinations, selectedHotels, estimatedHotelCost, totalFlightCost, numberOfPersons])

    const totalEstimatedPrice = useMemo(() => {
        return proposedPrice ? parseFloat(proposedPrice) : minimumPrice
    }, [proposedPrice, minimumPrice])

    const handleOpenBookingForm = () => {
        if (!session) {
            alert('Please sign in to request a custom tour')
            router.push('/login')
            return
        }
        if (selectedDestinations.length === 0) {
            alert('Please add at least one destination to your tour')
            return
        }
        setShowBookingForm(true)
    }

    const handleSubmitRequest = async () => {
        if (!session?.user?.email) {
            alert('Please sign in to continue')
            return
        }

        const priceValue = parseFloat(proposedPrice)
        if (isNaN(priceValue) || priceValue < minimumPrice) {
            alert(`Your proposed price must be at least DA${minimumPrice.toFixed(2)} (minimum cost for selected services)`)
            return
        }

        if (numberOfPersons < 1) {
            alert('Please specify at least 1 person')
            return
        }

        setSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/custom-tour-bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_email: session.user.email,
                    user_name: session.user.name || 'Guest',
                    start_date: startDate,
                    end_date: endDate || startDate,
                    destinations: selectedDestinations.map(d => ({
                        id: d.id,
                        name: d.name,
                        order: d.order
                    })),
                    hotels: selectedHotels.map(h => ({
                        id: h.id,
                        name: h.name
                    })),
                    flights: Array.from(selectedFlights.entries())
                        .filter(([segmentIndex, flight]) => flight && flight.itineraries && flight.itineraries.length > 0)
                        .map(([segmentIndex, flight]) => {
                            const itinerary = flight.itineraries[0]
                            const firstSegment = itinerary.segments[0]
                            const lastSegment = itinerary.segments[itinerary.segments.length - 1]
                            
                            return {
                                segment_index: segmentIndex,
                                flight_offer_id: flight.id,
                                origin_airport_code: firstSegment.departure.iataCode,
                                origin_airport_name: firstSegment.departure.iataCode,
                                origin_city: firstSegment.departure.iataCode,
                                origin_country: null,
                                origin_latitude: null,
                                origin_longitude: null,
                                destination_airport_code: lastSegment.arrival.iataCode,
                                destination_airport_name: lastSegment.arrival.iataCode,
                                destination_city: lastSegment.arrival.iataCode,
                                destination_country: null,
                                destination_latitude: null,
                                destination_longitude: null,
                                departure_datetime: firstSegment.departure.at,
                                arrival_datetime: lastSegment.arrival.at,
                                duration: itinerary.duration,
                                number_of_stops: itinerary.segments.length - 1,
                                airline_code: firstSegment.carrierCode,
                                flight_number: firstSegment.number,
                                price_amount: parseFloat(flight.price.total),
                                price_currency: flight.price.currency,
                                itineraries: flight.itineraries,
                                traveler_pricings: flight.travelerPricings,
                                fare_details: flight.price
                            }
                        }),
                    number_of_persons: numberOfPersons,
                    proposed_price: priceValue,
                    minimum_price: minimumPrice,
                    estimated_hotel_cost: estimatedHotelCost,
                    total_flight_cost: totalFlightCost,
                    notes: notes
                })
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.error || 'Failed to submit custom tour request')
            }

            const data = await response.json()

            alert('✅ Custom tour request submitted successfully! Our team will review your request and contact you within 24-48 hours with a personalized proposal.')
            
            // Clear form
            setSelectedDestinations([])
            setSelectedHotels([])
            setSelectedFlights(new Map())
            setProposedPrice('')
            setNumberOfPersons(1)
            setNotes('')
            setShowBookingForm(false)
            
            // Redirect to home or dashboard
            router.push('/')

        } catch (error) {
            console.error('Error submitting custom tour request:', error)
            alert(`Failed to submit request: ${error instanceof Error ? error.message : 'Please try again.'}`)
        } finally {
            setSubmitting(false)
        }
    }

    // Filter destinations based on search query
    const filteredDestinations = useMemo(() => {
        return destinations.filter(destination =>
            destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            destination.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            destination.country?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [destinations, searchQuery])

    // Filter hotels based on search query and selected destination cities
    const filteredHotels = useMemo(() => {
        // Get unique cities from selected destinations
        const selectedCities = [...new Set(selectedDestinations.map(d => d.city).filter(Boolean))]
        
        // If no destinations selected, return empty array
        if (selectedCities.length === 0) {
            return []
        }
        
        return hotels.filter(hotel => {
            // Check if hotel is in one of the selected destination cities
            const isInSelectedCity = selectedCities.some(city => 
                hotel.city?.toLowerCase() === city?.toLowerCase()
            )
            
            if (!isInSelectedCity) return false
            
            // Apply search filter
            return hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.city?.toLowerCase().includes(searchQuery.toLowerCase())
        })
    }, [hotels, searchQuery, selectedDestinations])

    if (loading) {
        return (
            <Layout headerStyle={1} footerStyle={1}>
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading destinations and hotels...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout headerStyle={1} footerStyle={1}>
            <main className="main">
                <section className="box-section box-breadcrumb background-body">
                    <div className="container">
                        <ul className="breadcrumbs">
                            <li><Link href="/">Home</Link><span className="arrow-right">
                                <svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg></span>
                            </li>
                            <li><span className="text-breadcrumb">Custom Tour Builder</span></li>
                        </ul>
                    </div>
                </section>

                <section className="box-section box-banner-tour-detail background-body" style={{ position: 'relative', padding: '20px', overflow: 'hidden' }}>
                    <div style={{ 
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: 'var(--shadow-lg, 0 10px 40px rgba(0, 0, 0, 0.15))',
                        maxWidth: '1200px',
                        margin: '0 auto',
                        border: '1px solid var(--border-color, rgba(0, 0, 0, 0.1))'
                    }}>
                        {tourDestinations.length > 0 ? (
                            <TourMap 
                                destinations={tourDestinations}
                                airports={flightSegments.flatMap(segment => [
                                    {
                                        airport: segment.origin_airport,
                                        type: 'origin' as const,
                                        segmentIndex: segment.segment_index
                                    },
                                    {
                                        airport: segment.destination_airport,
                                        type: 'destination' as const,
                                        segmentIndex: segment.segment_index
                                    }
                                ])}
                                showFlightRoutes={flightSegments.length > 0}
                            />
                        ) : (
                            <div style={{ 
                                height: '400px', 
                                background: '#f3f4f6', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexDirection: 'column',
                                gap: '16px'
                            }}>
                                <svg width={60} height={60} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="#9ca3af">
                                    <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                </svg>
                                <p className="text-lg-medium neutral-500">Add destinations to see them on the map</p>
                            </div>
                        )}
                    </div>
                </section>

                <section className="box-section box-content-tour-detail background-body">
                    <div className="container">
                        <div className="tour-header">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="tour-title-main">
                                        <h4 className="neutral-1000">Build Your Custom Tour</h4>
                                        <p className="text-xl-medium neutral-500 mt-3">
                                            Select destinations and hotels to create your personalized travel experience
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <SortToursFilter
                                    sortCriteria="name"
                                    handleSortChange={() => {}}
                                    itemsPerPage={selectedDestinations.length}
                                    handleItemsPerPageChange={() => {}}
                                    handleClearFilters={() => {
                                        setSelectedDestinations([])
                                        setSelectedHotels([])
                                        setSelectedFlights(new Map())
                                        setStartDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                                        setEndDate('')
                                    }}
                                    startItemIndex={1}
                                    endItemIndex={selectedDestinations.length}
                                    sortedTours={selectedDestinations}
                                    startDate={startDate}
                                    handleStartDateChange={handleStartDateChange}
                                    endDate={endDate}
                                    handleEndDateChange={handleEndDateChange}
                                    disableFilters={true}
                                />
                            </div>
                        </div>
                        <div className="row mt-30">
                            <div className="col-lg-8">
                                <div className="box-info-tour">
                                    <div className="tour-info-group">
                                        <div className="icon-item">
                                            <svg width={18} height={19} viewBox="0 0 18 19" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.5312 1.8828H13.8595V1.20312C13.8595 0.814789 13.5448 0.5 13.1564 0.5C12.7681 0.5 12.4533 0.814789 12.4533 1.20312V1.8828H5.55469V1.20312C5.55469 0.814789 5.2399 0.5 4.85156 0.5C4.46323 0.5 4.14844 0.814789 4.14844 1.20312V1.8828H3.47678C1.55967 1.8828 0 3.44247 0 5.35954V15.0232C0 16.9403 1.55967 18.5 3.47678 18.5H14.5313C16.4483 18.5 18.008 16.9403 18.008 15.0232V5.35954C18.008 3.44247 16.4483 1.8828 14.5312 1.8828ZM3.47678 3.28905H4.14844V4.66014C4.14844 5.04848 4.46323 5.36327 4.85156 5.36327C5.2399 5.36327 5.55469 5.04848 5.55469 4.66014V3.28905H12.4533V4.66014C12.4533 5.04848 12.7681 5.36327 13.1565 5.36327C13.5448 5.36327 13.8596 5.04848 13.8596 4.66014V3.28905H14.5313C15.6729 3.28905 16.6018 4.21788 16.6018 5.35954V6.03124H1.40625V5.35954C1.40625 4.21788 2.33508 3.28905 3.47678 3.28905ZM14.5312 17.0938H3.47678C2.33508 17.0938 1.40625 16.1649 1.40625 15.0232V7.43749H16.6018V15.0232C16.6018 16.1649 15.6729 17.0938 14.5312 17.0938Z" />
                                            </svg>
                                        </div>
                                        <div className="info-item">
                                            <p className="text-sm-medium neutral-600">Duration</p>
                                            <p className="text-lg-bold neutral-1000">
                                                {selectedDestinations.length > 0 ? `~${selectedDestinations.length} days` : 'Flexible'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="tour-info-group">
                                        <div className="icon-item background-1">
                                            <svg width={12} height={16} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                            </svg>
                                        </div>
                                        <div className="info-item">
                                            <p className="text-sm-medium neutral-600">Destinations</p>
                                            <p className="text-lg-bold neutral-1000">{selectedDestinations.length} selected</p>
                                        </div>
                                    </div>
                                    <div className="tour-info-group">
                                        <div className="icon-item background-7">
                                            <svg width={24} height={25} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M21.183 11.3508H18.5179V9.21402C18.5179 8.82514 18.2025 8.50986 17.8135 8.50986H14.0067C13.6537 7.43248 12.637 6.65961 11.4551 6.65961H10.2332V1.20416C10.2332 0.815281 9.91791 0.5 9.52894 0.5H4.61077C4.2218 0.5 3.90642 0.815281 3.90642 1.20416V6.65966H2.68458C1.20431 6.65966 0 7.86359 0 9.34348V21.8161C0 23.296 1.20431 24.5 2.68458 24.5H21.183C22.7363 24.5 24 23.2366 24 21.6838V14.167C24 12.6141 22.7363 11.3508 21.183 11.3508Z" />
                                            </svg>
                                        </div>
                                        <div className="info-item">
                                            <p className="text-sm-medium neutral-600">Hotels</p>
                                            <p className="text-lg-bold neutral-1000">{selectedHotels.length} selected</p>
                                        </div>
                                    </div>
                                    <div className="tour-info-group">
                                        <div className="icon-item background-3">
                                            <svg width={24} height={24} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                                            </svg>
                                        </div>
                                        <div className="info-item">
                                            <p className="text-sm-medium neutral-600">Min. Price</p>
                                            <p className="text-lg-bold neutral-1000">DA{minimumPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="box-collapse-expand">
                                    {/* Destinations Section */}
                                    <div className="group-collapse-expand">
                                        <button 
                                            className={isAccordion == 2 ? "btn btn-collapse collapsed" : "btn btn-collapse"} 
                                            type="button" 
                                            onClick={() => handleAccordion(2)}
                                        >
                                            <h6>Destinations ({selectedDestinations.length})</h6>
                                            <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            </svg>
                                        </button>
                                        <div className={isAccordion == 2 ? "collapse" : "collapse show"}>
                                            <div className="card card-body">
                                                {selectedDestinations.length > 0 ? (
                                                    <div className="destination-cards-list">
                                                        {selectedDestinations.map((dest) => {
                                                            const primaryImage = dest.primary_image || dest.images?.[0]?.image_path
                                                            
                                                            return (
                                                                <div key={dest.id} className="destination-card">
                                                                    <div className="destination-card-image">
                                                                        {primaryImage ? (
                                                                            <img 
                                                                                src={primaryImage} 
                                                                                alt={dest.name}
                                                                                onError={(e) => {
                                                                                    e.currentTarget.src = '/assets/imgs/page/destination/destination.png'
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="destination-placeholder">
                                                                                <svg width={40} height={40} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                                    <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="destination-card-content">
                                                                        <div className="destination-order-badge">
                                                                            <span className="badge bg-primary">{dest.order}</span>
                                                                        </div>
                                                                        <Link href={`/destination-details?id=${dest.id}`}>
                                                                            <h5 className="destination-name">{dest.name}</h5>
                                                                        </Link>
                                                                        <p className="destination-location">
                                                                            <svg width={14} height={18} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                                <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                                                            </svg>
                                                                            {dest.city}, {dest.country}
                                                                        </p>
                                                                        {dest.description && (
                                                                            <p className="destination-description">
                                                                                {dest.description.length > 100 
                                                                                    ? `${dest.description.substring(0, 100)}...` 
                                                                                    : dest.description
                                                                                }
                                                                            </p>
                                                                        )}
                                                                        <button 
                                                                            className="btn btn-remove-item"
                                                                            onClick={() => removeDestination(dest.id)}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="empty-state">
                                                        <svg width={50} height={50} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="#9ca3af">
                                                            <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                                        </svg>
                                                        <p className="text-md-medium neutral-500">No destinations added yet</p>
                                                    </div>
                                                )}
                                                <button 
                                                    className="btn btn-brand-2 w-100 mt-3"
                                                    onClick={() => setShowDestinationPicker(true)}
                                                >
                                                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="me-2">
                                                        <path d="M8 0C7.44772 0 7 0.447715 7 1V7H1C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9H7V15C7 15.5523 7.44772 16 8 16C8.55228 16 9 15.5523 9 15V9H15C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7H9V1C9 0.447715 8.55228 0 8 0Z" />
                                                    </svg>
                                                    Add Destination
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hotels Section */}
                                    <div className="group-collapse-expand">
                                        <button 
                                            className={isAccordion == 3 ? "btn btn-collapse collapsed" : "btn btn-collapse"} 
                                            type="button" 
                                            onClick={() => handleAccordion(3)}
                                        >
                                            <h6>Hotels & Accommodations ({selectedHotels.length})</h6>
                                            <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            </svg>
                                        </button>
                                        <div className={isAccordion == 3 ? "collapse" : "collapse show"}>
                                            <div className="card card-body">
                                                {selectedHotels.length > 0 ? (
                                                    <div className="hotel-cards-list">
                                                        {selectedHotels.map((hotel) => {
                                                            const primaryImage = hotel.primary_image || hotel.images?.[0]?.image_path
                                                            
                                                            return (
                                                                <div key={hotel.id} className="hotel-card">
                                                                    <div className="hotel-card-image">
                                                                        {primaryImage ? (
                                                                            <img 
                                                                                src={primaryImage} 
                                                                                alt={hotel.name}
                                                                                onError={(e) => {
                                                                                    e.currentTarget.src = '/assets/imgs/page/hotel/hotel.png'
                                                                                }}
                                                                            />
                                                                        ) : (
                                                                            <div className="hotel-placeholder">
                                                                                <svg width={40} height={40} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                                    <path d="M21.183 11.3508H18.5179V9.21402C18.5179 8.82514 18.2025 8.50986 17.8135 8.50986H14.0067C13.6537 7.43248 12.637 6.65961 11.4551 6.65961H10.2332V1.20416C10.2332 0.815281 9.91791 0.5 9.52894 0.5H4.61077C4.2218 0.5 3.90642 0.815281 3.90642 1.20416V6.65966H2.68458C1.20431 6.65966 0 7.86359 0 9.34348V21.8161C0 23.296 1.20431 24.5 2.68458 24.5H21.183C22.7363 24.5 24 23.2366 24 21.6838V14.167C24 12.6141 22.7363 11.3508 21.183 11.3508Z" />
                                                                                </svg>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="hotel-card-content">
                                                                        <div className="hotel-header">
                                                                            <h5 className="hotel-name">{hotel.name}</h5>
                                                                            {hotel.star_rating && (
                                                                                <div className="hotel-stars">
                                                                                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                                                                                        <svg key={i} width={16} height={16} viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                                                                                        </svg>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <p className="hotel-location">
                                                                            <svg width={14} height={18} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                                                                <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                                                            </svg>
                                                                            {hotel.city}, {hotel.country}
                                                                        </p>
                                                                        {hotel.address && (
                                                                            <p className="hotel-address">{hotel.address}</p>
                                                                        )}
                                                                        <button 
                                                                            className="btn btn-remove-item"
                                                                            onClick={() => removeHotel(hotel.id)}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="empty-state">
                                                        <svg width={50} height={50} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" fill="#9ca3af">
                                                            <path d="M21.183 11.3508H18.5179V9.21402C18.5179 8.82514 18.2025 8.50986 17.8135 8.50986H14.0067C13.6537 7.43248 12.637 6.65961 11.4551 6.65961H10.2332V1.20416C10.2332 0.815281 9.91791 0.5 9.52894 0.5H4.61077C4.2218 0.5 3.90642 0.815281 3.90642 1.20416V6.65966H2.68458C1.20431 6.65966 0 7.86359 0 9.34348V21.8161C0 23.296 1.20431 24.5 2.68458 24.5H21.183C22.7363 24.5 24 23.2366 24 21.6838V14.167C24 12.6141 22.7363 11.3508 21.183 11.3508Z" />
                                                        </svg>
                                                        <p className="text-md-medium neutral-500">No hotels added yet</p>
                                                    </div>
                                                )}
                                                <button 
                                                    className="btn btn-brand-2 w-100 mt-3"
                                                    onClick={() => setShowHotelPicker(true)}
                                                >
                                                    <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="me-2">
                                                        <path d="M8 0C7.44772 0 7 0.447715 7 1V7H1C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9H7V15C7 15.5523 7.44772 16 8 16C8.55228 16 9 15.5523 9 15V9H15C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7H9V1C9 0.447715 8.55228 0 8 0Z" />
                                                    </svg>
                                                    Add Hotel
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Flights Section */}
                                    {flightSegments.length > 0 && (

                                    <div className="group-collapse-expand">
                                        <button 
                                            className={isAccordion == 4 ? "btn btn-collapse collapsed" : "btn btn-collapse"} 
                                            type="button" 
                                            onClick={() => handleAccordion(4)}
                                        >
                                            <h6>
                                                <svg width={20} height={20} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="me-2" style={{display: 'inline'}}>
                                                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                                </svg>
                                                Flights {flightSegments.length > 0 && `(${flightSegments.length} segment${flightSegments.length > 1 ? 's' : ''})`}
                                            </h6>
                                            <svg width={12} height={7} viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L6 6L11 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                            </svg>
                                        </button>
                                        <div className={isAccordion == 4 ? "collapse" : "collapse show"}>
                                            <div className="card card-body">
                                                {loadingFlights ? (
                                                    <div className="text-center py-4">
                                                        <div className="spinner-border text-primary" role="status">
                                                            <span className="visually-hidden">Loading flights...</span>
                                                        </div>
                                                        <p className="mt-2 text-sm-medium neutral-500">Searching for flights...</p>
                                                    </div>
                                                ) : flightSegments.length === 0 ? (
                                                    <div className="alert alert-info">
                                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" className="me-2">
                                                            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7V7h2v6zm0-8H7V3h2v2z"/>
                                                        </svg>
                                                        Flights are automatically added when you select destinations from multiple countries
                                                    </div>
                                                ) : (
                                                    <div className="flights-container">
                                                        <div className="alert alert-info mb-3">
                                                            <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" className="me-2">
                                                                <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H7V7h2v6zm0-8H7V3h2v2z"/>
                                                            </svg>
                                                            Select one flight option per segment for your booking
                                                        </div>
                                                        
                                                        {flightSegments.map((segment) => (
                                                            <div key={segment.segment_index} className="flight-segment mb-4">
                                                                <div className="flight-segment-header mb-3 p-3 bg-light rounded">
                                                                    <h6 className="text-md-bold neutral-1000 mb-1">
                                                                        <span className="badge bg-primary me-2">Segment {segment.segment_index + 1}</span>
                                                                        {segment.origin_airport.address.cityName} → {segment.destination_airport.address.cityName}
                                                                    </h6>
                                                                    <p className="text-sm-medium neutral-500 mb-0">
                                                                        {segment.origin_airport.iataCode} ({segment.origin_airport.name}) to{' '}
                                                                        {segment.destination_airport.iataCode} ({segment.destination_airport.name})
                                                                    </p>
                                                                </div>
                                                                
                                                                {segment.flight_offers.length > 0 ? (
                                                                    <div className="flight-offers">
                                                                        {segment.flight_offers.slice(0, 3).map((offer) => (
                                                                            <div key={offer.id} className="mb-3">
                                                                                <FlightCard
                                                                                    flightOffer={offer}
                                                                                    dictionaries={undefined}
                                                                                    onSelect={(flight) => handleFlightSelection(segment.segment_index, flight)}
                                                                                    showBookButton={true}
                                                                                />
                                                                                {selectedFlights.get(segment.segment_index)?.id === offer.id && (
                                                                                    <div className="alert alert-success mt-2 mb-0">
                                                                                        <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" className="me-2">
                                                                                            <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm3.36 6.53L7.5 10.39l-2.86-2.86 1.06-1.06 1.8 1.8 3.02-3.02 1.06 1.06z"/>
                                                                                        </svg>
                                                                                        <strong>Selected for booking</strong>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="alert alert-warning">
                                                                        No flights available for this route
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="col-lg-4">
                                <div className="booking-form">
                                    <div className="head-booking-form">
                                        <p className="text-xl-bold neutral-1000">Tour Summary</p>
                                    </div>
                                    <div className="booking-form-content">
                                        <div className="summary-item">
                                            <span className="text-md-medium neutral-600">Start Date:</span>
                                            <span className="text-md-bold neutral-1000">{startDate ? new Date(startDate).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="text-md-medium neutral-600">End Date:</span>
                                            <span className="text-md-bold neutral-1000">{endDate ? new Date(endDate).toLocaleDateString() : 'Not set'}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="text-md-medium neutral-600">Duration:</span>
                                            <span className="text-md-bold neutral-1000">{tourDurationDays} days</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="text-md-medium neutral-600">Destinations:</span>
                                            <span className="text-md-bold neutral-1000">{selectedDestinations.length}</span>
                                        </div>
                                        <div className="summary-item">
                                            <span className="text-md-medium neutral-600">Hotels:</span>
                                            <span className="text-md-bold neutral-1000">{selectedHotels.length}</span>
                                        </div>
                                        {flightSegments.length > 0 && (
                                            <div className="summary-item">
                                                <span className="text-md-medium neutral-600">Flights:</span>
                                                <span className="text-md-bold neutral-1000">{flightSegments.length} segment{flightSegments.length !== 1 ? 's' : ''}</span>
                                            </div>
                                        )} */
                                        
                                        {selectedDestinations.length > 0 && (
                                            <>
                                                <div className="summary-item mt-3">
                                                    <span className="text-md-medium neutral-600">Hotel Costs:</span>
                                                    <span className="text-md-bold neutral-1000">DA{estimatedHotelCost.toFixed(2)}</span>
                                                </div>

                                                {totalFlightCost > 0 && (
                                                    <div className="summary-item">
                                                        <span className="text-md-medium neutral-600">Selected Flights:</span>
                                                        <span className="text-md-bold neutral-1000">DA{totalFlightCost.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="form-group mt-3">
                                                    <label className="text-sm-bold neutral-1000 mb-2">Number of Persons *</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        min="1"
                                                        value={numberOfPersons}
                                                        onChange={(e) => setNumberOfPersons(parseInt(e.target.value) || 1)}
                                                        placeholder="Number of persons"
                                                    />
                                                </div>

                                                <div className="form-group mt-3">
                                                    <label className="text-sm-bold neutral-1000 mb-2">
                                                        Your Proposed Price (DA) *
                                                        <span className="text-xs neutral-500 d-block">
                                                            Minimum: DA{minimumPrice.toFixed(2)}
                                                        </span>
                                                    </label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        min={minimumPrice}
                                                        step="0.01"
                                                        value={proposedPrice}
                                                        onChange={(e) => setProposedPrice(e.target.value)}
                                                        placeholder={`Min: ${minimumPrice.toFixed(2)}`}
                                                    />
                                                    {proposedPrice && parseFloat(proposedPrice) < minimumPrice && (
                                                        <small className="text-danger">
                                                            Price must be at least DA{minimumPrice.toFixed(2)}
                                                        </small>
                                                    )}
                                                </div>

                                                <div className="form-group mt-3">
                                                    <label className="text-sm-bold neutral-1000 mb-2">Additional Notes</label>
                                                    <textarea 
                                                        className="form-control" 
                                                        rows={3}
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        placeholder="Any special requests or preferences..."
                                                    />
                                                </div>
                                            </>
                                        )}
                                        
                                        <div className="summary-item border-top pt-3 mt-3">
                                            <span className="text-lg-medium neutral-600">Total Estimate:</span>
                                            <span className="text-xl-bold text-primary">DA{totalEstimatedPrice.toFixed(2)}</span>
                                        </div>
                                        
                                        <button 
                                            className="btn btn-brand-2 w-100 mt-4 text-primary"
                                            onClick={handleSubmitRequest}
                                            disabled={selectedDestinations.length === 0 || !proposedPrice || parseFloat(proposedPrice) < minimumPrice || submitting}
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Tour Request'}
                                        </button>
                                        
                                        <p className="text-sm neutral-500 text-center mt-3">
                                            Admin will review and may suggest modifications
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Destination Picker Modal */}
                {showDestinationPicker && (
                    <div className="modal-overlay" onClick={() => setShowDestinationPicker(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Select a Destination</h3>
                                <button className="modal-close" onClick={() => setShowDestinationPicker(false)}>×</button>
                            </div>
                            <div className="modal-search">
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Search destinations..." 
                                    value={searchQuery} 
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    {filteredDestinations.map((destination) => (
                                        <div key={destination.id} className="col-md-6 mb-3">
                                            <div 
                                                className="picker-card"
                                                onClick={() => addDestination(destination)}
                                            >
                                                <div className="picker-card-image">
                                                    <img 
                                                        src={destination.primary_image || destination.images?.[0]?.image_path || '/assets/imgs/page/destination/destination.png'} 
                                                        alt={destination.name} 
                                                        onError={(e) => { 
                                                            e.currentTarget.src = '/assets/imgs/page/destination/destination.png' 
                                                        }} 
                                                    />
                                                </div>
                                                <div className="picker-card-info">
                                                    <h6 className="picker-card-title">{destination.name}</h6>
                                                    <p className="picker-card-subtitle">{destination.city}, {destination.country}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hotel Picker Modal */}
                {showHotelPicker && (
                    <div className="modal-overlay" onClick={() => setShowHotelPicker(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Select a Hotel</h3>
                                <button className="modal-close" onClick={() => setShowHotelPicker(false)}>×</button>
                            </div>
                            {selectedDestinations.length === 0 ? (
                                <div className="modal-body">
                                    <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
                                        <svg width={60} height={60} viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg" fill="#9ca3af">
                                            <path d="M5.99967 0C2.80452 0 0.205078 2.59944 0.205078 5.79456C0.205078 9.75981 5.39067 15.581 5.61145 15.8269C5.81883 16.0579 6.18089 16.0575 6.38789 15.8269C6.60867 15.581 11.7943 9.75981 11.7943 5.79456C11.7942 2.59944 9.1948 0 5.99967 0ZM5.99967 8.70997C4.39211 8.70997 3.0843 7.40212 3.0843 5.79456C3.0843 4.187 4.39214 2.87919 5.99967 2.87919C7.6072 2.87919 8.91502 4.18703 8.91502 5.79459C8.91502 7.40216 7.6072 8.70997 5.99967 8.70997Z" />
                                        </svg>
                                        <p className="text-lg-medium neutral-600 mt-3">Please select a destination first</p>
                                        <p className="text-sm neutral-500 mt-2">Hotels are only shown for cities in your selected destinations</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="modal-search">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Search hotels..." 
                                            value={searchQuery} 
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="modal-body">
                                        {filteredHotels.length > 0 ? (
                                            <div className="row">
                                                {filteredHotels.map((hotel) => (
                                                    <div key={hotel.id} className="col-md-6 mb-3">
                                                        <div 
                                                            className="picker-card"
                                                            onClick={() => addHotel(hotel)}
                                                        >
                                                            <div className="picker-card-image">
                                                                <img 
                                                                    src={hotel.primary_image || hotel.images?.[0]?.image_path || '/assets/imgs/page/hotel/hotel.png'} 
                                                                    alt={hotel.name} 
                                                                    onError={(e) => { 
                                                                        e.currentTarget.src = '/assets/imgs/page/hotel/hotel.png' 
                                                                    }} 
                                                                />
                                                            </div>
                                                            <div className="picker-card-info">
                                                                <h6 className="picker-card-title">{hotel.name}</h6>
                                                                <p className="picker-card-subtitle">
                                                                    {hotel.city}, {hotel.country}
                                                                    {hotel.star_rating && ` • ${hotel.star_rating}★`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
                                                <svg width={60} height={60} viewBox="0 0 24 25" xmlns="http://www.w3.org/2000/svg" fill="#9ca3af">
                                                    <path d="M21.183 11.3508H18.5179V9.21402C18.5179 8.82514 18.2025 8.50986 17.8135 8.50986H14.0067C13.6537 7.43248 12.637 6.65961 11.4551 6.65961H10.2332V1.20416C10.2332 0.815281 9.91791 0.5 9.52894 0.5H4.61077C4.2218 0.5 3.90642 0.815281 3.90642 1.20416V6.65966H2.68458C1.20431 6.65966 0 7.86359 0 9.34348V21.8161C0 23.296 1.20431 24.5 2.68458 24.5H21.183C22.7363 24.5 24 23.2366 24 21.6838V14.167C24 12.6141 22.7363 11.3508 21.183 11.3508Z" />
                                                </svg>
                                                <p className="text-lg-medium neutral-600 mt-3">No hotels found</p>
                                                <p className="text-sm neutral-500 mt-2">
                                                    No hotels available in {selectedDestinations.map(d => d.city).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </Layout>
    )
}
