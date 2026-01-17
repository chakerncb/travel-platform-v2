'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TourDestinationDto } from '@/src/types/api'
import { Airport } from '@/src/types/flight'

interface TourMapProps {
	destinations: TourDestinationDto[]
	airports?: Array<{
		airport: Airport
		type: 'origin' | 'destination'
		segmentIndex: number
	}>
	showFlightRoutes?: boolean
}

export default function TourMap({ destinations, airports = [], showFlightRoutes = false }: TourMapProps) {
	const mapRef = useRef<L.Map | null>(null)
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const markersLayerRef = useRef<L.LayerGroup | null>(null)
	const airportMarkersRef = useRef<L.LayerGroup | null>(null)
	const flightRoutesRef = useRef<L.LayerGroup | null>(null)

	useEffect(() => {
		if (!mapContainerRef.current || !destinations || destinations.length === 0) return

		if (!mapRef.current) {
			mapRef.current = L.map(mapContainerRef.current, {
				zoomControl: true,
				scrollWheelZoom: true,				
			})

			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19,
			}).addTo(mapRef.current)
		}

		const map = mapRef.current

		// Clear existing markers layer
		if (markersLayerRef.current) {
			map.removeLayer(markersLayerRef.current)
		}
		markersLayerRef.current = L.layerGroup().addTo(map)

		// Clear existing route lines
		map.eachLayer((layer) => {
			if (layer instanceof L.Polyline) {
				map.removeLayer(layer)
			}
		})

		// Get coordinates from destinations
		const coordinates: [number, number][] = destinations
			.filter(dest => dest.latitude && dest.longitude)
			.map(dest => [parseFloat(dest.latitude as any), parseFloat(dest.longitude as any)])

		if (coordinates.length === 0) {
			// Default to Algeria if no coordinates
			map.setView([28.0339, 1.6596], 6)
			return
		}

		// Function to calculate pixel distance between two coordinates at current zoom level
		const getPixelDistance = (coord1: [number, number], coord2: [number, number], zoom: number): number => {
			const point1 = map.project(coord1, zoom)
			const point2 = map.project(coord2, zoom)
			return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
		}

		// Function to cluster destinations based on current zoom level
		const clusterDestinations = (zoom: number) => {
			const destinationsWithCoords = destinations.filter(d => d.latitude && d.longitude).map((dest, index) => ({
				dest,
				originalIndex: index,
				coord: [parseFloat(dest.latitude as any), parseFloat(dest.longitude as any)] as [number, number]
			}))

			// Clustering threshold in pixels - destinations within this distance will be grouped
			const clusterPixelThreshold = 40

			interface Cluster {
				coord: [number, number]
				destinations: { dest: TourDestinationDto; originalIndex: number; coord: [number, number] }[]
			}

			const clusters: Cluster[] = []
			const clustered = new Set<number>()

			destinationsWithCoords.forEach((item, index) => {
				if (clustered.has(index)) return

				const cluster: Cluster = {
					coord: item.coord,
					destinations: [item]
				}

				// Find all destinations close to this one
				destinationsWithCoords.forEach((otherItem, otherIndex) => {
					if (otherIndex <= index || clustered.has(otherIndex)) return

					const pixelDist = getPixelDistance(item.coord, otherItem.coord, zoom)
					if (pixelDist < clusterPixelThreshold) {
						cluster.destinations.push(otherItem)
						clustered.add(otherIndex)
					}
				})

				// Calculate cluster center (average position)
				const avgLat = cluster.destinations.reduce((sum, d) => sum + d.coord[0], 0) / cluster.destinations.length
				const avgLng = cluster.destinations.reduce((sum, d) => sum + d.coord[1], 0) / cluster.destinations.length
				cluster.coord = [avgLat, avgLng]

				clusters.push(cluster)
				clustered.add(index)
			})

			return clusters
		}

		// Function to create markers based on clustering
		const createMarkers = () => {
			const currentZoom = map.getZoom()
			const clusters = clusterDestinations(currentZoom)

			// Clear existing markers
			if (markersLayerRef.current) {
				markersLayerRef.current.clearLayers()
			}

			clusters.forEach((cluster) => {
				const { coord, destinations: groupDests } = cluster
				const count = groupDests.length
				const firstDestIndex = groupDests[0].originalIndex
				const firstDest = groupDests[0].dest
				
				// Determine border color and label based on original position
				let borderColor = '#2563eb'
				let size = 30
				let label = `Stop ${firstDestIndex + 1}`

				const destinationsWithCoords = destinations.filter(d => d.latitude && d.longitude)
				if (firstDestIndex === 0) {
					borderColor = '#16a34a' // Green for start
					label = 'Start'
				} else if (firstDestIndex === destinationsWithCoords.length - 1) {
					borderColor = '#dc2626' // Red for end
					label = 'End'
				}

				// Create icon with count badge
				const createIconWithCount = (imageUrl: string | null, borderColor: string, size: number, count: number) => {
					const fallbackColor = borderColor === '#16a34a' ? '#16a34a' : borderColor === '#dc2626' ? '#dc2626' : '#2563eb'
					const pinHeight = size * 1.4
					
					const countBadge = count > 1 ? `
						<div style="
							position: absolute;
							top: -5px;
							right: -5px;
							background-color: #ef4444;
							color: white;
							border: 2px solid white;
							border-radius: 50%;
							width: 22px;
							height: 22px;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 11px;
							font-weight: bold;
							box-shadow: 0 2px 4px rgba(0,0,0,0.3);
							z-index: 10;
						">${count}</div>
					` : ''
					
					if (imageUrl) {
						return L.divIcon({
							html: `
								<div style="
									position: relative;
									width: ${size}px; 
									height: ${pinHeight}px;
								">
									<div style="
										width: ${size}px; 
										height: ${size}px; 
										border-radius: 50% 50% 50% 0;
										transform: rotate(-45deg);
										border: 3px solid ${borderColor}; 
										box-shadow: 0 3px 10px rgba(0,0,0,0.4); 
										overflow: hidden;
										background-color: white;
										position: absolute;
										top: 0;
										left: 0;
									">
										<img src="${imageUrl}" 
											style="
												width: 140%; 
												height: 140%; 
												object-fit: cover;
												transform: rotate(45deg) translate(-15%, -15%);
											" 
											onerror="this.style.display='none'; this.parentElement.style.backgroundColor='${fallbackColor}'"
										/>
									</div>
									<div style="
										position: absolute;
										bottom: 0;
										left: 50%;
										transform: translateX(-50%);
										width: 6px;
										height: 6px;
										background-color: ${borderColor};
										border-radius: 50%;
										box-shadow: 0 2px 4px rgba(0,0,0,0.3);
									"></div>
									${countBadge}
								</div>
							`,
							iconSize: [size, pinHeight],
							iconAnchor: [size / 2, pinHeight],
							popupAnchor: [0, -pinHeight + 5],
							className: 'custom-pin-icon'
						})
					} else {
						return L.divIcon({
							html: `
								<div style="
									position: relative;
									width: ${size}px; 
									height: ${pinHeight}px;
								">
									<div style="
										background-color: ${fallbackColor}; 
										width: ${size}px; 
										height: ${size}px; 
										border-radius: 50% 50% 50% 0;
										transform: rotate(-45deg);
										border: 3px solid white; 
										box-shadow: 0 3px 10px rgba(0,0,0,0.4);
										position: absolute;
										top: 0;
										left: 0;
									"></div>
									<div style="
										position: absolute;
										bottom: 0;
										left: 50%;
										transform: translateX(-50%);
										width: 6px;
										height: 6px;
										background-color: ${fallbackColor};
										border-radius: 50%;
										box-shadow: 0 2px 4px rgba(0,0,0,0.3);
									"></div>
									${countBadge}
								</div>
							`,
							iconSize: [size, pinHeight],
							iconAnchor: [size / 2, pinHeight],
							popupAnchor: [0, -pinHeight + 5],
							className: 'custom-pin-icon'
						})
					}
				}

				const icon = createIconWithCount(firstDest.image_url ?? null, borderColor, size, count)
				const marker = L.marker(coord, { icon })
				
				// Create popup content
				const popupContent = count > 1 
					? `
						<div style="min-width: 200px; max-height: 400px; overflow-y: auto;">
							<strong style="font-size: 14px; color: #ef4444; margin-bottom: 10px; display: block;">
								${count} destinations at this location
							</strong>
							${groupDests.map((item, idx) => `
								<div style="padding: 8px 0; ${idx < groupDests.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
									${item.dest.image_url ? `<img src="${item.dest.image_url}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 6px;" />` : ''}
									<strong style="font-size: 13px; color: #0D0D0D;">Stop ${item.originalIndex + 1}: ${item.dest.name}</strong>
									<p style="margin: 4px 0 0 0; font-size: 11px; color: #666;">${item.dest.city}, ${item.dest.country}</p>
								</div>
							`).join('')}
						</div>
					`
					: `
						<div style="min-width: 150px;">
							${firstDest.image_url ? `<img src="${firstDest.image_url}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />` : ''}
							<strong style="font-size: 14px; color: #0D0D0D;">${label}: ${firstDest.name}</strong>
							<p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">${firstDest.city}, ${firstDest.country}</p>
						</div>
					`
				
				marker.bindPopup(popupContent)
				
				if (markersLayerRef.current) {
					marker.addTo(markersLayerRef.current)
				}
			})
		}

		// Initial marker creation
		createMarkers()

		// Update markers on zoom change
		map.on('zoomend', createMarkers)

		// Create plane icon for flight segments
		const createPlaneIcon = () => {
			return L.divIcon({
				html: `
					<div style="
						font-size: 20px;
						transform: rotate(45deg);
						text-shadow: 0 2px 4px rgba(0,0,0,0.3);
					">✈️</div>
				`,
				iconSize: [30, 20],
				iconAnchor: [10, 10],
				className: 'plane-icon'
			})
		}

		// Fetch routes with flight detection
		const fetchRoute = async () => {
			if (!mapRef.current || coordinates.length < 2) return
			
			const destinationsWithCoords = destinations.filter(d => d.latitude && d.longitude)
			
			// Process each segment between consecutive destinations
			for (let i = 0; i < destinationsWithCoords.length - 1; i++) {
				const currentDest = destinationsWithCoords[i]
				const nextDest = destinationsWithCoords[i + 1]
				const currentCoord = coordinates[i]
				const nextCoord = coordinates[i + 1]
				
				const isDifferentCountry = currentDest.country !== nextDest.country
				
				if (isDifferentCountry) {
					if (airports.length === 0 || !showFlightRoutes) {
					// Draw flight path (dashed line with plane icon)
					if (mapRef.current) {
						// Draw dashed line for flight
						L.polyline([currentCoord, nextCoord], {
							color: '#f59e0b',
							weight: 3,
							opacity: 0.7,
							dashArray: '10, 15',
							lineJoin: 'round'
						}).addTo(mapRef.current)
						
						// Add plane icon at midpoint
						const midLat = (currentCoord[0] + nextCoord[0]) / 2
						const midLng = (currentCoord[1] + nextCoord[1]) / 2
						const planeMarker = L.marker([midLat, midLng], { icon: createPlaneIcon() })
						planeMarker.addTo(mapRef.current)
					}
				}
				} else {
					// Same country - fetch road route
					try {
						const coordsString = `${currentCoord[1]},${currentCoord[0]};${nextCoord[1]},${nextCoord[0]}`
						const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`
						
						const response = await fetch(url)
						const data = await response.json()
						
						if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
							const route = data.routes[0]
							const routeCoordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]] as [number, number])
							
							// Draw the real route only if map is still mounted
							if (mapRef.current) {
								L.polyline(routeCoordinates, {
									color: '#2563eb',
									weight: 4,
									opacity: 0.8,
									lineJoin: 'round'
								}).addTo(mapRef.current)
							}
						} else {
							// Fallback to straight line if routing fails
							if (mapRef.current) {
								L.polyline([currentCoord, nextCoord], {
									color: '#2563eb',
									weight: 4,
									opacity: 0.7,
									dashArray: '10, 10',
									lineJoin: 'round'
								}).addTo(mapRef.current)
							}
						}
					} catch (error) {
						console.error('Error fetching route:', error)
						// Fallback to straight line
						if (mapRef.current) {
							L.polyline([currentCoord, nextCoord], {
								color: '#2563eb',
								weight: 4,
								opacity: 0.7,
								dashArray: '10, 10',
								lineJoin: 'round'
							}).addTo(mapRef.current)
						}
					}
				}
			}
		}

		if (coordinates.length > 1) {
			fetchRoute()
		}

		// Add airport markers if provided
		if (airports && airports.length > 0 && showFlightRoutes) {
			// Clear existing airport markers and flight routes
			if (airportMarkersRef.current) {
				map.removeLayer(airportMarkersRef.current)
			}
			if (flightRoutesRef.current) {
				map.removeLayer(flightRoutesRef.current)
			}

			airportMarkersRef.current = L.layerGroup().addTo(map)
			flightRoutesRef.current = L.layerGroup().addTo(map)

			// Create airport markers
			airports.forEach((airportInfo) => {
				const { airport, type, segmentIndex } = airportInfo
				const airportCoord: [number, number] = [
					airport.geoCode.latitude,
					airport.geoCode.longitude
				]

				// Create airport icon
				const airportIcon = L.divIcon({
					html: `
						<div style="
							position: relative;
							width: 30px;
							height: 30px;
						">
							<div style="
								background-color: ${type === 'origin' ? '#3b82f6' : '#8b5cf6'};
								width: 30px;
								height: 30px;
								border-radius: 50%;
								border: 3px solid white;
								box-shadow: 0 2px 8px rgba(0,0,0,0.3);
								display: flex;
								align-items: center;
								justify-content: center;
							">
								<svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
									<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
								</svg>
							</div>
						</div>
					`,
					iconSize: [30, 30],
					iconAnchor: [15, 15],
					popupAnchor: [0, -15],
					className: 'airport-marker-icon'
				})

				const airportMarker = L.marker(airportCoord, { icon: airportIcon })
				
				const popupContent = `
					<div style="min-width: 180px;">
						<strong style="font-size: 13px; color: #0D0D0D; display: block; margin-bottom: 5px;">
							✈️ ${airport.name}
						</strong>
						<p style="margin: 3px 0; font-size: 11px; color: #666;">
							<strong>Code:</strong> ${airport.iataCode}
						</p>
						<p style="margin: 3px 0; font-size: 11px; color: #666;">
							<strong>City:</strong> ${airport.address.cityName}
						</p>
						<p style="margin: 3px 0; font-size: 11px; color: #666;">
							<strong>Country:</strong> ${airport.address.countryName}
						</p>
						<p style="margin: 5px 0 0 0; font-size: 10px; color: ${type === 'origin' ? '#3b82f6' : '#8b5cf6'}; font-weight: bold;">
							${type === 'origin' ? '🛫 Departure' : '🛬 Arrival'} - Segment ${segmentIndex + 1}
						</p>
					</div>
				`
				
				airportMarker.bindPopup(popupContent)
				
				if (airportMarkersRef.current) {
					airportMarker.addTo(airportMarkersRef.current)
				}
			})

			// Draw flight routes between airports
			const airportPairs = new Map<number, { origin?: Airport; destination?: Airport }>()
			
			airports.forEach((airportInfo) => {
				if (!airportPairs.has(airportInfo.segmentIndex)) {
					airportPairs.set(airportInfo.segmentIndex, {})
				}
				const pair = airportPairs.get(airportInfo.segmentIndex)!
				if (airportInfo.type === 'origin') {
					pair.origin = airportInfo.airport
				} else {
					pair.destination = airportInfo.airport
				}
			})

			airportPairs.forEach((pair, segmentIndex) => {
				if (pair.origin && pair.destination) {
					const originCoord: [number, number] = [
						pair.origin.geoCode.latitude,
						pair.origin.geoCode.longitude
					]
					const destCoord: [number, number] = [
						pair.destination.geoCode.latitude,
						pair.destination.geoCode.longitude
					]

					// Draw curved flight path
					const flightPath = L.polyline([originCoord, destCoord], {
						color: '#ef4444',
						weight: 3,
						opacity: 0.8,
						dashArray: '5, 10',
						lineJoin: 'round'
					})

					if (flightRoutesRef.current) {
						flightPath.addTo(flightRoutesRef.current)
					}

					// Add flight icon in the middle
					const midLat = (originCoord[0] + destCoord[0]) / 2
					const midLng = (originCoord[1] + destCoord[1]) / 2
					
					const flightLabelIcon = L.divIcon({
						html: `
							<div style="
								background: #ef4444;
								color: white;
								padding: 4px 8px;
								border-radius: 12px;
								font-size: 10px;
								font-weight: bold;
								white-space: nowrap;
								box-shadow: 0 2px 4px rgba(0,0,0,0.2);
							">
								✈️ Flight ${segmentIndex + 1}
							</div>
						`,
						iconSize: [80, 24],
						iconAnchor: [40, 12],
						className: 'flight-label-icon'
					})

					const flightLabel = L.marker([midLat, midLng], { icon: flightLabelIcon })
					if (flightRoutesRef.current) {
						flightLabel.addTo(flightRoutesRef.current)
					}

					// Find nearest destinations to airports and draw connecting roads
					const findNearestDestination = (airportCoord: [number, number]): [number, number] | null => {
						let minDist = Infinity
						let nearestCoord: [number, number] | null = null
						
						coordinates.forEach((coord) => {
							const dist = Math.sqrt(
								Math.pow(coord[0] - airportCoord[0], 2) +
								Math.pow(coord[1] - airportCoord[1], 2)
							)
							if (dist < minDist) {
								minDist = dist
								nearestCoord = coord
							}
						})
						
						return nearestCoord
					}

					// Draw road from origin destination to origin airport
					const nearestToOrigin = findNearestDestination(originCoord)
					if (nearestToOrigin) {
						L.polyline([nearestToOrigin, originCoord], {
							color: '#059669',
							weight: 3,
							opacity: 0.6,
							dashArray: '5, 5',
							lineJoin: 'round'
						}).addTo(flightRoutesRef.current!)
					}

					// Draw road from destination airport to next destination
					const nearestToDestination = findNearestDestination(destCoord)
					if (nearestToDestination) {
						L.polyline([destCoord, nearestToDestination], {
							color: '#059669',
							weight: 3,
							opacity: 0.6,
							dashArray: '5, 5',
							lineJoin: 'round'
						}).addTo(flightRoutesRef.current!)
					}
				}
			})

			// Expand bounds to include airports
			const allCoords = [...coordinates]
			airports.forEach((airportInfo) => {
				allCoords.push([
					airportInfo.airport.geoCode.latitude,
					airportInfo.airport.geoCode.longitude
				])
			})
			
			if (allCoords.length > 0) {
				const expandedBounds = L.latLngBounds(allCoords)
				map.fitBounds(expandedBounds, { padding: [50, 50] })
			}
		} else {
			// Fit map to show all markers (original behavior)
			const bounds = L.latLngBounds(coordinates)
			map.fitBounds(bounds, { padding: [50, 50] })
		}

		// Cleanup
		return () => {
			if (mapRef.current) {
				mapRef.current.off('zoomend', createMarkers)
				mapRef.current.remove()
				mapRef.current = null
			}
			markersLayerRef.current = null
			airportMarkersRef.current = null
			flightRoutesRef.current = null
		}
	}, [destinations, airports, showFlightRoutes])

	if (!destinations || destinations.length === 0) {
		return (
			<div className="tour-map-container" style={{ height: '400px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
				<p className="text-md-medium neutral-500">No route information available</p>
			</div>
		)
	}

	return (
		<div className="tour-map-wrapper" style={{ position: 'relative' }}>
			<div 
				ref={mapContainerRef} 
				className="tour-map-container" 
				style={{ 
					height: '500px', 
					width: '100%',
					borderRadius: '0'
				}} 
			/>
		</div>
	)
}
