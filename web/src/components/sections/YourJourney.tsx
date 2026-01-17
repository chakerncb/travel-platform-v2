'use client'
import { Swiper, SwiperSlide } from "swiper/react"
import { swiperGroupAnimate } from "@/src/util/swiperOption"
import Link from "next/link"
import Countdown from '../elements/Countdown'
import { useEffect, useState } from 'react'
import { tourService } from '@/src/services/tourService'
import { TourApiResponse } from '@/src/types/api'

export default function YourJourney() {
	const currentTime = new Date()
    const [tours, setTours] = useState<TourApiResponse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTours = async () => {
            try {
                // Fetch featured tours, limit to 8
                const featuredTours = await tourService.getFeatured(8)
                setTours(featuredTours)
            } catch (error) {
                console.error('Error fetching tours:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchTours()
    }, [])

    if (loading) {
        return (
            <section className="section-box box-your-journey background-body">
                <div className="container">
                    <div className="text-center py-5">
                        <p>Loading tours...</p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>

            <section className="section-box box-your-journey background-body">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-md-9 mb-30">
                            <h1 className="neutral-1000 mb-15">Your Journey, Your Way</h1>
                            <h6 className="heading-6-medium neutral-400">Discover the World's Treasures with T7wisa </h6>
                        </div>
                        <div className="col-md-3 position-relative mb-30">
                            <div className="box-button-slider box-button-slider-team justify-content-end">
                                <div className="swiper-button-prev swiper-button-prev-style-1 swiper-button-prev-animate">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" >
                                        <path d="M7.99992 3.33325L3.33325 7.99992M3.33325 7.99992L7.99992 12.6666M3.33325 7.99992H12.6666" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="swiper-button-next swiper-button-next-style-1 swiper-button-next-animate">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 16 16" >
                                        <path d="M7.99992 12.6666L12.6666 7.99992L7.99992 3.33325M12.6666 7.99992L3.33325 7.99992" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-slider">
                    <div className="box-swiper mt-30">
                        <div className="swiper-container swiper-group-animate swiper-group-journey">
                            <Swiper {...swiperGroupAnimate}>
                                {tours.length === 0 ? (
                                    <SwiperSlide>
                                        <div className="text-center py-5">
                                            <p>No tours available at the moment.</p>
                                        </div>
                                    </SwiperSlide>
                                ) : (
                                    tours.map((tour, index) => {
                                        // Get the first destination's image from the tour, fallback to cover image or default
                                        const allDestinationImages = tour.destinations?.map(dest => dest.image_url).filter(Boolean) || [];
                                        const imageUrl = allDestinationImages[0] || "/assets/imgs/page/homepage1/journey1.png";
                                        const imageAlt = tour.title;
                                        const tourRating = Number(tour.average_rating) || 0;
                                        const reviewsCount = tour.reviews_count || 0;
                                        
                                        return (
                                        <SwiperSlide key={tour.id}>
                                            <div className={"card-journey-small background-card"}>
                                                <div className="card-image">
                                                    <Link className="wish" href={`/tour-detail/${tour.id}`}>
                                                        <svg width={20} height={18} viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M17.071 10.1422L11.4141 15.7991C10.6331 16.5801 9.36672 16.5801 8.58568 15.7991L2.92882 10.1422C0.9762 8.1896 0.9762 5.02378 2.92882 3.07116C4.88144 1.11853 8.04727 1.11853 9.99989 3.07116C11.9525 1.11853 15.1183 1.11853 17.071 3.07116C19.0236 5.02378 19.0236 8.1896 17.071 10.1422Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                        </svg>
                                                    </Link>
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={imageAlt} 
                                                    />
                                                </div>
                                                <div className="card-info background-card">
                                                    <div className="card-rating">
                                                        <div className="card-left">
                                                            {tourRating >= 4.8 && <span className="lightning">Exceptional</span>}
                                                        </div>
                                                        <div className="card-right">
                                                            <span className="rating">
                                                                {tourRating > 0 ? tourRating.toFixed(2) : 'No rating'}
                                                                {reviewsCount > 0 && (
                                                                    <span className="text-sm-medium neutral-500"> ({reviewsCount} reviews)</span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="card-title">
                                                        <Link 
                                                            className={"heading-6 neutral-1000"} 
                                                            href={`/tour-detail/${tour.id}`}
                                                        >
                                                            {tour.title}
                                                        </Link>
                                                    </div>
                                                    <div className="card-program">
                                                        <div className="duration">
                                                            <p className="text-md-medium neutral-500 mb-25">
                                                                {tour.duration_days 
                                                                    ? `${tour.duration_days} days`
                                                                    : 'Duration varies'
                                                                }
                                                                {tour.difficulty_level && ` - ${tour.difficulty_level}`}
                                                            </p>
                                                            <div className="card-price">
                                                                <h6 className="heading-6 neutral-1000">
                                                                    ${tour.price}
                                                                </h6>
                                                                <p className="text-md-medium neutral-500">/ person</p>
                                                            </div>
                                                        </div>
                                                        {/* {index === 0 && tour.end_date && (
                                                            <div className="endtime">
                                                                <p className="text-sm-bold neutral-600">Promotion will end in</p>
                                                                <div className="box-count box-count-square mb-0 mt-5 wow fadeInUp">
                                                                    <Countdown endDateTime={new Date(tour.end_date).getTime()} />
                                                                </div>
                                                            </div>
                                                        )} */}
                                                            <div className="endtime">
                                                                <div className="card-button">
                                                                    <Link className="btn btn-gray" href={`/tour-detail/${tour.id}`}>
                                                                        Book Now
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        );
                                    })
                                )}
                            </Swiper>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
