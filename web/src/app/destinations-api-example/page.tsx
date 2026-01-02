'use client'
import { useEffect, useState } from 'react';
import Layout from '@/src/components/layout/Layout';
import Link from 'next/link';
import { useDestinations, useFeaturedTours, useFeaturedHotels } from '@/src/hooks';
import { imageService } from '@/src/services';
import { DestinationDto, TourDto, HotelDto } from '@/src/types/api';

export default function DestinationsListPage() {
  const { data: destinations, loading: loadingDest, error: errorDest } = useDestinations();
  const { data: tours, loading: loadingTours } = useFeaturedTours(10);
  const { data: hotels, loading: loadingHotels } = useFeaturedHotels(10);

  const [selectedDestination, setSelectedDestination] = useState<DestinationDto | null>(null);

  if (loadingDest) {
    return (
      <Layout headerStyle={1} footerStyle={1}>
        <div className="container py-5 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading destinations...</span>
          </div>
          <p className="mt-3">Loading destinations...</p>
        </div>
      </Layout>
    );
  }

  if (errorDest) {
    return (
      <Layout headerStyle={1} footerStyle={1}>
        <div className="container py-5">
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Error Loading Destinations</h4>
            <p>{errorDest.message}</p>
            <button 
              className="btn btn-danger" 
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const featuredDestinations = destinations?.filter(d => d.isFeatured) || [];
  const regularDestinations = destinations?.filter(d => !d.isFeatured) || [];

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
                <span className="text-breadcrumb">Destinations</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Featured Destinations */}
        {featuredDestinations.length > 0 && (
          <section className="box-section box-featured-destinations background-body">
            <div className="container">
              <div className="text-center wow fadeInUp">
                <h2 className="neutral-1000">Featured Destinations</h2>
                <p className="text-xl-medium neutral-500">
                  Discover our most popular travel destinations
                </p>
              </div>
              <div className="row mt-50">
                {featuredDestinations.map((destination) => (
                  <div key={destination.destinationId} className="col-lg-4 col-md-6 mb-30">
                    <div className="card-destination background-card">
                      <div className="card-image">
                        <Link href={`/destination/${destination.slug}`}>
                          <img 
                            src={imageService.getImageUrl(destination.coverImageUrl || destination.thumbnailUrl)} 
                            alt={destination.name}
                            onError={(e) => {
                              e.currentTarget.src = '/assets/imgs/placeholder.jpg';
                            }}
                          />
                        </Link>
                        {destination.isFeatured && (
                          <span className="badge-featured">⭐ Featured</span>
                        )}
                      </div>
                      <div className="card-info">
                        <div className="card-title">
                          <Link href={`/destination/${destination.slug}`}>
                            <h5 className="neutral-1000">{destination.name}</h5>
                          </Link>
                        </div>
                        {destination.shortDescription && (
                          <p className="text-md-medium neutral-500 mb-15">
                            {destination.shortDescription.substring(0, 100)}
                            {destination.shortDescription.length > 100 && '...'}
                          </p>
                        )}
                        <div className="card-meta">
                          <div className="meta-info">
                            <p className="text-sm-medium neutral-500">
                              {destination.country}
                            </p>
                          </div>
                          <div className="card-button">
                            <Link 
                              href={`/destination/${destination.slug}`}
                              className="btn btn-gray"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Destinations */}
        <section className="box-section box-all-destinations background-card">
          <div className="container">
            <div className="text-center wow fadeInUp">
              <h2 className="neutral-1000">All Destinations</h2>
              <p className="text-xl-medium neutral-500">
                Explore all available destinations ({regularDestinations.length})
              </p>
            </div>
            <div className="row mt-50">
              {regularDestinations.map((destination) => (
                <div key={destination.destinationId} className="col-lg-3 col-md-4 col-sm-6 mb-30">
                  <div className="card-destination-simple background-card">
                    <div className="card-image">
                      <Link href={`/destination/${destination.slug}`}>
                        <img 
                          src={imageService.getThumbnailUrl(destination.thumbnailUrl)} 
                          alt={destination.name}
                          onError={(e) => {
                            e.currentTarget.src = '/assets/imgs/placeholder-thumb.jpg';
                          }}
                        />
                      </Link>
                    </div>
                    <div className="card-info">
                      <Link href={`/destination/${destination.slug}`}>
                        <h6 className="neutral-1000">{destination.name}</h6>
                      </Link>
                      <p className="text-sm neutral-500">{destination.country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tours (if available) */}
        {!loadingTours && tours && tours.length > 0 && (
          <section className="box-section box-featured-tours background-body">
            <div className="container">
              <div className="text-center wow fadeInUp">
                <h2 className="neutral-1000">Popular Tours</h2>
                <p className="text-xl-medium neutral-500">
                  Top-rated tours from our travel partners
                </p>
              </div>
              <div className="row mt-50">
                {tours.slice(0, 6).map((tour) => (
                  <div key={tour.tourId} className="col-lg-4 col-md-6 mb-30">
                    <div className="card-tour background-card">
                      <div className="card-image">
                        <Link href={`/tour/${tour.tourId}`}>
                          <img 
                            src={imageService.getImageUrl(tour.coverImageUrl)} 
                            alt={tour.title}
                          />
                        </Link>
                      </div>
                      <div className="card-info">
                        <div className="card-rating">
                          <span className="rating">⭐ {tour.rating.toFixed(1)}</span>
                          <span className="text-sm neutral-500">
                            ({tour.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="card-title">
                          <Link href={`/tour/${tour.tourId}`}>
                            <h5 className="neutral-1000">{tour.title}</h5>
                          </Link>
                        </div>
                        <div className="card-program">
                          <p className="text-md-medium neutral-500">
                            {tour.durationDays} days / {tour.durationNights} nights
                          </p>
                        </div>
                        <div className="card-price">
                          <div className="price">
                            <span className="text-xl-bold neutral-1000">
                              {tour.pricePerPerson?.toLocaleString()} {tour.currency}
                            </span>
                            <span className="text-sm neutral-500"> / person</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Hotels (if available) */}
        {!loadingHotels && hotels && hotels.length > 0 && (
          <section className="box-section box-featured-hotels background-card">
            <div className="container">
              <div className="text-center wow fadeInUp">
                <h2 className="neutral-1000">Popular Hotels</h2>
                <p className="text-xl-medium neutral-500">
                  Recommended accommodations for your stay
                </p>
              </div>
              <div className="row mt-50">
                {hotels.slice(0, 6).map((hotel) => (
                  <div key={hotel.hotelId} className="col-lg-4 col-md-6 mb-30">
                    <div className="card-hotel background-card">
                      <div className="card-image">
                        <Link href={`/hotel/${hotel.hotelId}`}>
                          <img 
                            src={imageService.getImageUrl(hotel.thumbnailUrl)} 
                            alt={hotel.name}
                          />
                        </Link>
                      </div>
                      <div className="card-info">
                        <div className="card-rating">
                          <span className="stars">
                            {'⭐'.repeat(hotel.starRating || 0)}
                          </span>
                          <span className="rating ml-10">
                            {hotel.rating.toFixed(1)}
                          </span>
                          <span className="text-sm neutral-500">
                            ({hotel.totalReviews} reviews)
                          </span>
                        </div>
                        <div className="card-title">
                          <Link href={`/hotel/${hotel.hotelId}`}>
                            <h5 className="neutral-1000">{hotel.name}</h5>
                          </Link>
                        </div>
                        {hotel.city && (
                          <p className="text-sm neutral-500">
                            📍 {hotel.city}
                          </p>
                        )}
                        <div className="card-price">
                          <span className="text-md neutral-500">From </span>
                          <span className="text-xl-bold neutral-1000">
                            {hotel.priceFrom?.toLocaleString()} {hotel.currency}
                          </span>
                          <span className="text-sm neutral-500"> / night</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
