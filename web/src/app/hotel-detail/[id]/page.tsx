'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Layout from "@/src/components/layout/Layout"
import Link from "next/link"
import { Swiper, SwiperSlide } from "swiper/react"
import { swiperGroup1 } from "@/src/util/swiperOption"
import { hotelService } from "@/src/services/hotelService"
import { HotelDto } from "@/src/types/api"

export default function HotelDetailPage() {
    const params = useParams()
    const hotelId = params?.id as string
    const [hotel, setHotel] = useState<HotelDto | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchHotelDetails = async () => {
            if (!hotelId) return
            
            try {
                setLoading(true)
                const data = await hotelService.getById(hotelId)
                setHotel(data)
            } catch (err) {
                console.error('Error fetching hotel details:', err)
                setError('Failed to load hotel details')
            } finally {
                setLoading(false)
            }
        }

        fetchHotelDetails()
    }, [hotelId])

    if (loading) {
        return (
            <Layout headerStyle={1} footerStyle={1}>
                <main className="main">
                    <section className="section-box box-breadcrumb background-body">
                        <div className="container">
                            <div className="text-center py-5">
                                <p className="text-lg">Loading hotel details...</p>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        )
    }

    if (error || !hotel) {
        return (
            <Layout headerStyle={1} footerStyle={1}>
                <main className="main">
                    <section className="section-box box-breadcrumb background-body">
                        <div className="container">
                            <div className="text-center py-5">
                                <p className="text-lg text-danger">{error || 'Hotel not found'}</p>
                                <Link href="/" className="btn btn-black-lg mt-3">Return Home</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </Layout>
        )
    }

    const images = hotel.images || []
    const primaryImage = hotel.primary_image || images[0]?.image_path || '/assets/imgs/page/hotel/banner-hotel.png'
    const specifications = hotel.specifications || {}

    return (
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
                            <li>
                                <Link href="/">Hotels</Link>
                                <span className="arrow-right">
                                    <svg width={7} height={12} viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                    </svg>
                                </span>
                            </li>
                            <li><span className="text-breadcrumb">{hotel.name}</span></li>
                        </ul>
                    </div>
                </section>

                {/* Banner Section */}
                <section className="section-box box-banner-home3 box-banner-hotel-detail background-body">
                    <div className="container">
                        <div className="box-swiper mt-0">
                            <div className="swiper-container swiper-group-1">
                                <Swiper {...swiperGroup1}>
                                    {images.length > 0 ? (
                                        images.map((image: any, index: number) => (
                                            <SwiperSlide key={index}>
                                                <div 
                                                    className="item-banner-box" 
                                                    style={{ 
                                                        backgroundImage: `url(${image.image_path || primaryImage})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        minHeight: '500px'
                                                    }}
                                                >
                                                    <div className="item-banner-box-inner">
                                                        <span className="btn btn-white-sm">
                                                            {Array.from({ length: hotel.star_rating || 5 }).map((_, idx) => (
                                                                <img key={idx} src="/assets/imgs/page/tour-detail/star-big.svg" alt="Star" />
                                                            ))}
                                                        </span>
                                                        <h1 className="mt-20 mb-20 color-white">
                                                            Welcome to<br className="d-none d-lg-block" />
                                                            {hotel.name}
                                                        </h1>
                                                        <div className="d-flex gap-3 mb-2">
                                                            <span className="btn btn-white-sm">
                                                                <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                </svg>
                                                                {hotel.city}, {hotel.country}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        ))
                                    ) : (
                                        <SwiperSlide>
                                            <div 
                                                className="item-banner-box" 
                                                style={{ 
                                                    backgroundImage: `url(${primaryImage})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    minHeight: '500px'
                                                }}
                                            >
                                                <div className="item-banner-box-inner">
                                                    <span className="btn btn-white-sm">
                                                        {Array.from({ length: hotel.star_rating || 5 }).map((_, idx) => (
                                                            <img key={idx} src="/assets/imgs/page/tour-detail/star-big.svg" alt="Star" />
                                                        ))}
                                                    </span>
                                                    <h1 className="mt-20 mb-20 color-white">
                                                        Welcome to<br className="d-none d-lg-block" />
                                                        {hotel.name}
                                                    </h1>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    )}
                                </Swiper>
                                <div className="swiper-pagination swiper-pagination-group-1 swiper-pagination-style-1" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hotel Facilities */}
                {specifications && (
                    <section className="section-box box-partners box-hotel-facilities-list background-body">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-12 mb-20 wow fadeInUp">
                                    <div className="box-numbers-home7">
                                        <div className="list-numbers wow fadeInUp">
                                            {specifications.has_wifi && (
                                                <div className="item-number">
                                                    <div className="image-top">
                                                        <img src="/assets/imgs/page/hotel/wifi.svg" alt="WiFi" />
                                                    </div>
                                                    <p className="text-15-medium neutral-1000">Free WiFi<br />Internet</p>
                                                </div>
                                            )}
                                            {specifications.has_parking && (
                                                <div className="item-number">
                                                    <div className="image-top">
                                                        <img src="/assets/imgs/page/hotel/airport.svg" alt="Parking" />
                                                    </div>
                                                    <p className="text-15-medium neutral-1000">Free<br />Parking</p>
                                                </div>
                                            )}
                                            {specifications.has_pool && (
                                                <div className="item-number">
                                                    <div className="image-top">
                                                        <img src="/assets/imgs/page/hotel/spa.svg" alt="Pool" />
                                                    </div>
                                                    <p className="text-15-medium neutral-1000">Swimming<br />Pool</p>
                                                </div>
                                            )}
                                            {specifications.has_restaurant && (
                                                <div className="item-number">
                                                    <div className="image-top">
                                                        <img src="/assets/imgs/page/hotel/living.svg" alt="Restaurant" />
                                                    </div>
                                                    <p className="text-15-medium neutral-1000">Restaurant<br />& Bar</p>
                                                </div>
                                            )}
                                            {specifications.has_gym && (
                                                <div className="item-number">
                                                    <div className="image-top">
                                                        <img src="/assets/imgs/page/hotel/front.svg" alt="Gym" />
                                                    </div>
                                                    <p className="text-15-medium neutral-1000">Fitness<br />Center</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Hotel Description */}
                <section className="section-box box-payments box-vision background-body">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 mb-30">
                                <div className="box-right-payment">
                                    <span className="btn btn-brand-secondary">Welcome to {hotel.name}</span>
                                    <h2 className="title-why mb-25 mt-10 neutral-1000">{hotel.name}</h2>
                                    <p className="text-lg-medium neutral-500 mb-35">
                                        {hotel.description || 'Experience luxury and comfort at our hotel.'}
                                    </p>
                                    
                                    <div className="mb-30">
                                        <div className="d-flex align-items-center gap-3 mb-3">
                                            <svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 2L12.5 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7L10 2Z" fill="#FFD700"/>
                                            </svg>
                                            <span className="text-lg-bold neutral-1000">
                                                {hotel.star_rating}-Star Hotel
                                            </span>
                                        </div>
                                        <div className="d-flex align-items-center gap-3">
                                            <svg width={20} height={20} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 2C6.13 2 3 5.13 3 9c0 5.25 7 11 7 11s7-5.75 7-11c0-3.87-3.13-7-7-7z" fill="#007bff"/>
                                                <circle cx="10" cy="9" r="2.5" fill="white"/>
                                            </svg>
                                            <span className="text-md-medium neutral-500">
                                                {hotel.address || `${hotel.city}, ${hotel.country}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="box-telephone-booking">
                                        <div className="box-tel-left">
                                            <div className="box-need-help">
                                                <p className="need-help neutral-1000 text-lg-bold mb-5">Need help? Contact us</p>
                                                <br />
                                                {hotel.phone && (
                                                    <Link className="heading-6 phone-support" href={`tel:${hotel.phone}`}>
                                                        {hotel.phone}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        <div className="box-tel-right">
                                            <div className="card-price">
                                                <h4 className="heading-4 neutral-1000">
                                                    ${hotel.price_per_night || hotel.priceFrom || '0.00'}
                                                </h4>
                                                <p className="text-md-medium neutral-500">/ night</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mb-30 text-center text-lg-end">
                                <div className="box-image-vision">
                                    <img 
                                        className="w-100" 
                                        src={primaryImage} 
                                        alt={hotel.name}
                                        style={{ maxHeight: '500px', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Hotel Information Cards */}
                <section className="section-box box-payments background-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-30">
                                <div className="card-why card-why-2 background-card wow fadeInUp">
                                    <div className="card-image">
                                        <div className="image-top">
                                            <svg width={48} height={48} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M24 4L6 14v10c0 11 7.5 21 18 24 10.5-3 18-13 18-24V14L24 4z" fill="#007bff" fillOpacity="0.1" stroke="#007bff" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="card-info">
                                        <h6 className="text-xl-bold neutral-1000">Location</h6>
                                        <p className="text-sm-medium neutral-500">{hotel.city}, {hotel.country}</p>
                                        {hotel.address && (
                                            <p className="text-sm neutral-500 mt-2">{hotel.address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {specifications.check_in_time && (
                                <div className="col-lg-4 col-md-6 mb-30">
                                    <div className="card-why card-why-2 background-card wow fadeInUp">
                                        <div className="card-image">
                                            <div className="image-top">
                                                <svg width={48} height={48} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="24" cy="24" r="18" fill="#28a745" fillOpacity="0.1" stroke="#28a745" strokeWidth="2"/>
                                                    <path d="M24 12v12l8 4" stroke="#28a745" strokeWidth="2" strokeLinecap="round"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="card-info">
                                            <h6 className="text-xl-bold neutral-1000">Check-in / Check-out</h6>
                                            <p className="text-sm-medium neutral-500">
                                                Check-in: {specifications.check_in_time}
                                            </p>
                                            {specifications.check_out_time && (
                                                <p className="text-sm-medium neutral-500">
                                                    Check-out: {specifications.check_out_time}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {specifications.total_rooms && (
                                <div className="col-lg-4 col-md-6 mb-30">
                                    <div className="card-why card-why-2 background-card wow fadeInUp">
                                        <div className="card-image">
                                            <div className="image-top">
                                                <svg width={48} height={48} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="8" y="16" width="32" height="20" rx="2" fill="#ffc107" fillOpacity="0.1" stroke="#ffc107" strokeWidth="2"/>
                                                    <path d="M12 24h24M20 24v8M28 24v8" stroke="#ffc107" strokeWidth="2"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="card-info">
                                            <h6 className="text-xl-bold neutral-1000">Total Rooms</h6>
                                            <p className="text-sm-medium neutral-500">
                                                {specifications.total_rooms} rooms available
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                {(hotel.phone || hotel.email || hotel.website) && (
                    <section className="section-box background-body">
                        <div className="container">
                            <div className="card background-card p-4">
                                <h4 className="mb-3">Contact Information</h4>
                                <div className="row">
                                    {hotel.phone && (
                                        <div className="col-md-4 mb-3">
                                            <p className="text-sm-bold neutral-500 mb-2">Phone</p>
                                            <Link href={`tel:${hotel.phone}`} className="text-md-medium neutral-1000">
                                                {hotel.phone}
                                            </Link>
                                        </div>
                                    )}
                                    {hotel.email && (
                                        <div className="col-md-4 mb-3">
                                            <p className="text-sm-bold neutral-500 mb-2">Email</p>
                                            <Link href={`mailto:${hotel.email}`} className="text-md-medium neutral-1000">
                                                {hotel.email}
                                            </Link>
                                        </div>
                                    )}
                                    {hotel.website && (
                                        <div className="col-md-4 mb-3">
                                            <p className="text-sm-bold neutral-500 mb-2">Website</p>
                                            <Link 
                                                href={hotel.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-md-medium neutral-1000"
                                            >
                                                Visit Website
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* CTA Section */}
                <section className="section-box box-subscribe background-body">
                    <div className="container">
                        <div className="block-subscribe">
                            <div className="subscribe-left">
                                <h4 className="neutral-1000">Ready to Book?</h4>
                                <p className="text-xl-medium neutral-500">
                                    Contact us now to reserve your room at {hotel.name}
                                </p>
                            </div>
                            <div className="subscribe-right">
                                {hotel.phone && (
                                    <Link href={`tel:${hotel.phone}`} className="btn btn-black-lg">
                                        Call Now
                                        <svg width={16} height={16} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 15L15 8L8 1M15 8L1 8" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    )
}
