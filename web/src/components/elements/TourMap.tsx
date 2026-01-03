'use client'
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { TourDestinationDto } from '@/src/types/api'

interface TourMapProps {
	destinations: TourDestinationDto[]
}

export default function TourMap({ destinations }: TourMapProps) {
	const mapRef = useRef<L.Map | null>(null)
	const mapContainerRef = useRef<HTMLDivElement>(null)
	const markersLayerRef = useRef<L.LayerGroup | null>(null)

	useEffect(() => {
		if (!mapContainerRef.current || !destinations || destinations.length === 0) return

		// Initialize map
		if (!mapRef.current) {
			mapRef.current = L.map(mapContainerRef.current, {
				zoomControl: true,
				scrollWheelZoom: false,
			})

			// Add tile layer
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
				destinations: { dest: TourDestinationDto; originalIndex: number }[]
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

		// Fetch real road routes using OSRM
		const fetchRoute = async () => {
			if (!mapRef.current || coordinates.length < 2) return
			
			try {
				// Build OSRM API URL with all coordinates
				const coordsString = coordinates
					.map(coord => `${coord[1]},${coord[0]}`) // OSRM uses lon,lat format
					.join(';')
				
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
					// Fallback to straight lines if routing fails
					if (mapRef.current) {
						L.polyline(coordinates, {
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
				// Fallback to straight lines
				if (mapRef.current) {
					L.polyline(coordinates, {
						color: '#2563eb',
						weight: 4,
						opacity: 0.7,
						dashArray: '10, 10',
						lineJoin: 'round'
					}).addTo(mapRef.current)
				}
			}
		}

		if (coordinates.length > 1) {
			fetchRoute()
		}

		// Fit map to show all markers
		const bounds = L.latLngBounds(coordinates)
		map.fitBounds(bounds, { padding: [50, 50] })

		// Cleanup
		return () => {
			if (mapRef.current) {
				mapRef.current.off('zoomend', createMarkers)
				mapRef.current.remove()
				mapRef.current = null
			}
			markersLayerRef.current = null
		}
	}, [destinations])

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
			<div style={{
				position: 'absolute',
				bottom: '20px',
				right: '20px',
				background: 'white',
				padding: '12px 16px',
				borderRadius: '8px',
				boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
				zIndex: 1000,
				display: 'flex',
				gap: '15px',
				fontSize: '12px'
			}}>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
					<div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#16a34a' }}></div>
					<span>Start</span>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
					<div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb' }}></div>
					<span>Stop</span>
				</div>
				<div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
					<div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#dc2626' }}></div>
					<span>End</span>
				</div>
			</div>
		</div>
	)
}
