import {
  FlightOffer,
  Airport,
  FlightSearchParams,
  MultiCityFlightSearchParams,
  CustomTourFlightResponse
} from '@/src/types/flight'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class FlightService {
  /**
   * Search for flights between two locations
   */
  async searchFlights(params: FlightSearchParams): Promise<{ data: FlightOffer[] }> {
    const queryParams = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      departure_date: params.departure_date,
      adults: params.adults.toString(),
      ...(params.return_date && { return_date: params.return_date }),
      ...(params.max && { max: params.max.toString() })
    })

    const response = await fetch(`${API_URL}/v1/flights/search?${queryParams}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search flights')
    }

    return response.json()
  }

  /**
   * Search for multi-city flights
   */
  async searchMultiCityFlights(params: MultiCityFlightSearchParams): Promise<{ data: FlightOffer[] }> {
    const response = await fetch(`${API_URL}/v1/flights/search-multi-city`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search multi-city flights')
    }

    return response.json()
  }

  /**
   * Search airports by city name
   */
  async searchAirportsByCity(city: string): Promise<{ data: Airport[] }> {
    const response = await fetch(`${API_URL}/v1/flights/airports/search?city=${encodeURIComponent(city)}`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to search airports')
    }

    return response.json()
  }

  /**
   * Get nearest airport to coordinates
   */
  async getNearestAirport(latitude: number, longitude: number): Promise<{ data: Airport[] }> {
    const response = await fetch(
      `${API_URL}/v1/flights/airports/nearest?latitude=${latitude}&longitude=${longitude}`
    )
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get nearest airport')
    }

    return response.json()
  }

  /**
   * Get all Algerian airports
   */
  async getAlgerianAirports(): Promise<{ data: Airport[], count: number }> {
    const response = await fetch(`${API_URL}/v1/flights/airports/algeria`)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get Algerian airports')
    }

    return response.json()
  }

  /**
   * Get flight suggestions for custom tour destinations
   */
  async getCustomTourFlights(
    destinations: Array<{
      city: string
      country: string
      latitude?: number
      longitude?: number
    }>,
    startDate: string,
    adults: number
  ): Promise<CustomTourFlightResponse> {
    const response = await fetch(`${API_URL}/v1/flights/custom-tour`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        destinations,
        start_date: startDate,
        adults
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to get custom tour flights')
    }

    return response.json()
  }

  /**
   * Format flight duration (ISO 8601 duration to readable format)
   */
  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?/)
    if (!match) return duration

    const hours = match[1] ? parseInt(match[1]) : 0
    const minutes = match[2] ? parseInt(match[2]) : 0

    if (hours && minutes) {
      return `${hours}h ${minutes}m`
    } else if (hours) {
      return `${hours}h`
    } else if (minutes) {
      return `${minutes}m`
    }
    return duration
  }

  /**
   * Format date and time
   */
  formatDateTime(dateTime: string): { date: string; time: string } {
    const date = new Date(dateTime)
    return {
      date: date.toLocaleDateString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }
  }

  /**
   * Get airline name from carrier code
   */
  getAirlineName(carrierCode: string, dictionaries?: any): string {
    if (dictionaries?.carriers?.[carrierCode]) {
      return dictionaries.carriers[carrierCode]
    }
    return carrierCode
  }

  /**
   * Get cabin class display name
   */
  getCabinClassName(cabin: string): string {
    const cabinMap: Record<string, string> = {
      'ECONOMY': 'Economy',
      'PREMIUM_ECONOMY': 'Premium Economy',
      'BUSINESS': 'Business',
      'FIRST': 'First Class'
    }
    return cabinMap[cabin] || cabin
  }

  /**
   * Calculate total stops for an itinerary
   */
  getTotalStops(itinerary: any): number {
    return itinerary.segments.reduce((total: number, segment: any) => 
      total + segment.numberOfStops, 0
    )
  }
}

export const flightService = new FlightService()
