'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface MapMarker {
    id: number
    name: string
    type: 'destination' | 'hotel'
    lat: number
    lng: number
    city?: string
    country?: string
}

interface TourMapProps {
    markers: MapMarker[]
}

export default function TourMap({ markers }: TourMapProps) {
    const mapRef = useRef<L.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!mapContainerRef.current) return

        // Initialize map if it doesn't exist
        if (!mapRef.current) {
            mapRef.current = L.map(mapContainerRef.current, {
                zoomControl: true,
                scrollWheelZoom: true,
            }).setView([30, 10], 2)

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(mapRef.current)
        }

        // Clear existing markers and polylines
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.Polyline) {
                mapRef.current?.removeLayer(layer)
            }
        })

        if (markers.length === 0) return

        // Create custom icons
        const destinationIcon = L.divIcon({
            className: 'custom-marker destination-marker',
            html: `
                <div class="marker-pin destination-pin">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="white"/>
                    </svg>
                </div>
                <div class="marker-pulse"></div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        })

        const hotelIcon = L.divIcon({
            className: 'custom-marker hotel-marker',
            html: `
                <div class="marker-pin hotel-pin">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 13C8.66 13 10 11.66 10 10C10 8.34 8.66 7 7 7C5.34 7 4 8.34 4 10C4 11.66 5.34 13 7 13ZM19 7H11V14H3V5H1V20H3V17H21V20H23V11C23 8.79 21.21 7 19 7Z" fill="white"/>
                    </svg>
                </div>
                <div class="marker-pulse"></div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        })

        // Add markers
        const latLngs: L.LatLng[] = []
        markers.forEach((marker, index) => {
            const icon = marker.type === 'destination' ? destinationIcon : hotelIcon
            const markerInstance = L.marker([marker.lat, marker.lng], { icon })
                .addTo(mapRef.current!)
                .bindPopup(`
                    <div class="custom-popup">
                        <div class="popup-header ${marker.type}">
                            <span class="popup-number">${index + 1}</span>
                            <span class="popup-type">${marker.type === 'destination' ? '📍 Destination' : '🏨 Hotel'}</span>
                        </div>
                        <div class="popup-body">
                            <h6>${marker.name}</h6>
                            <p>${marker.city ? `${marker.city}, ` : ''}${marker.country || ''}</p>
                        </div>
                    </div>
                `)

            latLngs.push(L.latLng(marker.lat, marker.lng))
        })

        // Draw route lines between consecutive destinations
        if (latLngs.length > 1) {
            const destinationPoints = markers
                .filter(m => m.type === 'destination')
                .map(m => L.latLng(m.lat, m.lng))

            if (destinationPoints.length > 1) {
                L.polyline(destinationPoints, {
                    color: '#667eea',
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10',
                    className: 'route-line'
                }).addTo(mapRef.current!)
            }
        }

        // Fit map to show all markers
        if (latLngs.length > 0) {
            const bounds = L.latLngBounds(latLngs)
            mapRef.current.fitBounds(bounds, { padding: [50, 50] })
        }

        // Cleanup
        return () => {
            // Don't destroy the map, just clear layers
        }
    }, [markers])

    return (
        <>
            <div ref={mapContainerRef} style={{ height: '520px', width: '100%' }} />
            <style jsx global>{`
                /* Custom Marker Styles */
                .custom-marker {
                    background: none;
                    border: none;
                }
                .marker-pin {
                    width: 40px;
                    height: 40px;
                    border-radius: 50% 50% 50% 0;
                    position: relative;
                    transform: rotate(-45deg);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: bounce 2s infinite;
                }
                .marker-pin svg {
                    transform: rotate(45deg);
                }
                .destination-pin {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .hotel-pin {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                .marker-pulse {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(102, 126, 234, 0.3);
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: pulse 2s infinite;
                    z-index: -1;
                }

                /* Popup Styles */
                .leaflet-popup-content-wrapper {
                    border-radius: 12px;
                    padding: 0;
                    overflow: hidden;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
                }
                .leaflet-popup-content {
                    margin: 0;
                    min-width: 220px;
                }
                .custom-popup {
                    font-family: inherit;
                }
                .popup-header {
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: white;
                    font-weight: 600;
                }
                .popup-header.destination {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                }
                .popup-header.hotel {
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                }
                .popup-number {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                }
                .popup-type {
                    font-size: 13px;
                }
                .popup-body {
                    padding: 16px;
                }
                .popup-body h6 {
                    margin: 0 0 8px 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: #1a1a1a;
                }
                .popup-body p {
                    margin: 0;
                    font-size: 13px;
                    color: #6c757d;
                }

                /* Route Line Animation */
                .route-line {
                    animation: dash 30s linear infinite;
                }

                /* Animations */
                @keyframes bounce {
                    0%, 100% {
                        transform: rotate(-45deg) translateY(0);
                    }
                    50% {
                        transform: rotate(-45deg) translateY(-10px);
                    }
                }
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }

                /* Leaflet Controls */
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                }
                .leaflet-control-zoom a {
                    border-radius: 8px !important;
                    border: none !important;
                    background: white !important;
                    color: #667eea !important;
                    font-weight: 700 !important;
                }
                .leaflet-control-zoom a:hover {
                    background: #667eea !important;
                    color: white !important;
                }
            `}</style>
        </>
    )
}
