
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import CategoryFilter from '../elements/CategoryFilter'
import { destinationService } from '@/src/services/destinationService'

interface Destination {
    id: number
    name: string
    city: string
    country: string
    primary_image?: string | null
    images?: Array<{
        id: number
        image_path: string
        alt_text?: string
        is_primary: boolean
        order: number
    }>
}

export default function PopularDestinations1() {
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchDestinations() {
            try {
                setLoading(true)
                const data = await destinationService.getAll()
                // Limit to 7 destinations to match the layout, starting from the last
                                const mappedData: Destination[] = data.map(dto => ({
                                    id: dto.id,
                                    name: dto.name,
                                    city: dto.city || '',
                                    country: dto.country || '',
                                    primary_image: dto.primary_image,
                                    images: dto.images
                                }))
                                setDestinations(mappedData.slice(-7).reverse()) } catch (err) {
                console.error('Error fetching destinations:', err)
                setError('Failed to load destinations')
            } finally {
                setLoading(false)
            }
        }

        fetchDestinations()
    }, [])

    const getDestinationImage = (destination: Destination): string => {
        // Use primary_image if available, otherwise use the first image, or fallback
        if (destination.primary_image) {
            return destination.primary_image
        }
        if (destination.images && destination.images.length > 0) {
            return destination.images[0].image_path
        }
        return '/assets/imgs/page/homepage1/popular.png' // Fallback image
    }

    return (
        <>
            <section className="section-box box-popular-destinations background-body mt-0 pt-0">
                <div className="container">
                    <div className="row align-items-end">
                        <div className="col-lg-6 mb-30 text-center text-lg-start">
                            <h2 className="neutral-1000">Popular Destinations</h2>
                            <p className="text-xl-medium neutral-500">Favorite destinations based on customer reviews</p>
                        </div>
                        <div className="col-lg-6 mb-30">
                            <CategoryFilter />
                        </div>
                    </div>
                    <div className="box-list-populars">
                        {loading ? (
                            <div className="row">
                                <div className="col-12 text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="row">
                                {destinations.map((destination) => (
                                    <div key={destination.id} className="col-lg-3 col-sm-6">
                                        <div className="card-popular background-card hover-up">
                                            <div className="card-image">
                                                <Link href={`/destination-details?id=${destination.id}`}>
                                                    <img 
                                                        src={getDestinationImage(destination)} 
                                                        alt={destination.name}
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement
                                                            target.src = '/assets/imgs/page/homepage1/popular.png'
                                                        }}
                                                    />
                                                </Link>
                                            </div>
                                            <div className="card-info">
                                                <Link className="card-title" href={`/destination-details?id=${destination.id}`}>
                                                    {destination.name}
                                                </Link>
                                                <div className="card-meta">
                                                    <div className="meta-links">
                                                        <span>{destination.city}, {destination.country}</span>
                                                    </div>
                                                    <div className="card-button">
                                                        <Link href={`/destination-details?id=${destination.id}`}>
                                                            <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="col-lg-3 col-sm-6">
                                    <div className="card-popular-2">
                                        <div className="card-info">
                                            <h6 className="neutral-500">Crafting Your Perfect Travel Experience</h6>
                                            <div className="card-meta">
                                                <div className="meta-links">Browse <br />All destinations</div>
                                                <div className="card-button hover-up">
                                                    <Link href="/destinations">
                                                        <svg width={10} height={10} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M5.00011 9.08347L9.08347 5.00011L5.00011 0.916748M9.08347 5.00011L0.916748 5.00011" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
