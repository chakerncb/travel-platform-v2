// Flight related types based on Amadeus API

export interface FlightOffer {
  type: string
  id: string
  source: string
  instantTicketingRequired: boolean
  nonHomogeneous: boolean
  oneWay: boolean
  lastTicketingDate?: string
  numberOfBookableSeats: number
  itineraries: Itinerary[]
  price: Price
  pricingOptions?: PricingOptions
  validatingAirlineCodes: string[]
  travelerPricings: TravelerPricing[]
}

export interface Itinerary {
  duration: string
  segments: Segment[]
}

export interface Segment {
  departure: LocationInfo
  arrival: LocationInfo
  carrierCode: string
  number: string
  aircraft: Aircraft
  operating?: Operating
  duration: string
  id: string
  numberOfStops: number
  blacklistedInEU: boolean
}

export interface LocationInfo {
  iataCode: string
  terminal?: string
  at: string
}

export interface Aircraft {
  code: string
}

export interface Operating {
  carrierCode: string
}

export interface Price {
  currency: string
  total: string
  base: string
  fees?: Fee[]
  grandTotal: string
}

export interface Fee {
  amount: string
  type: string
}

export interface PricingOptions {
  fareType: string[]
  includedCheckedBagsOnly: boolean
}

export interface TravelerPricing {
  travelerId: string
  fareOption: string
  travelerType: string
  price: Price
  fareDetailsBySegment: FareDetailsBySegment[]
}

export interface FareDetailsBySegment {
  segmentId: string
  cabin: string
  fareBasis: string
  class: string
  includedCheckedBags?: CheckedBags
}

export interface CheckedBags {
  weight?: number
  weightUnit?: string
  quantity?: number
}

export interface FlightDictionaries {
  locations?: Record<string, LocationDetail>
  aircraft?: Record<string, string>
  currencies?: Record<string, string>
  carriers?: Record<string, string>
}

export interface LocationDetail {
  cityCode: string
  countryCode: string
}

export interface Airport {
  type: string
  subType: string
  name: string
  detailedName: string
  id: string
  self?: {
    href: string
    methods: string[]
  }
  timeZoneOffset?: string
  iataCode: string
  geoCode: {
    latitude: number
    longitude: number
  }
  address: {
    cityName: string
    cityCode: string
    countryName: string
    countryCode: string
    regionCode?: string
  }
  analytics?: {
    travelers: {
      score: number
    }
  }
  distance?: {
    value: number
    unit: string
  }
}

export interface FlightSegmentInfo {
  segment_index: number
  from_destination: {
    id: number
    name: string
    city: string
    country: string
  }
  to_destination: {
    id: number
    name: string
    city: string
    country: string
  }
  origin_airport: Airport
  destination_airport: Airport
  flight_offers: FlightOffer[]
  dictionaries: FlightDictionaries
}

export interface CustomTourFlightResponse {
  flights: FlightSegmentInfo[]
  total_segments: number
  message?: string
}

export interface FlightSearchParams {
  origin: string
  destination: string
  departure_date: string
  adults: number
  return_date?: string
  max?: number
}

export interface MultiCityFlightSegment {
  origin: string
  destination: string
  date: string
  id?: number
}

export interface MultiCityFlightSearchParams {
  segments: MultiCityFlightSegment[]
  adults: number
}
