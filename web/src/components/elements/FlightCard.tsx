import Link from 'next/link'
import { FlightOffer, FlightDictionaries, Segment } from '@/src/types/flight'
import { flightService } from '@/src/services/flightService'

interface FlightCardProps {
  flightOffer: FlightOffer
  dictionaries?: FlightDictionaries
  onSelect?: (flight: FlightOffer) => void
  showBookButton?: boolean
}

export default function FlightCard({ 
  flightOffer, 
  dictionaries,
  onSelect,
  showBookButton = true 
}: FlightCardProps) {
  const firstItinerary = flightOffer.itineraries[0]
  const firstSegment = firstItinerary.segments[0]
  const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1]
  const hasReturn = flightOffer.itineraries.length > 1

  const departureDT = flightService.formatDateTime(firstSegment.departure.at)
  const arrivalDT = flightService.formatDateTime(lastSegment.arrival.at)
  
  const duration = flightService.formatDuration(firstItinerary.duration)
  const stops = flightService.getTotalStops(firstItinerary)
  const airline = flightService.getAirlineName(firstSegment.carrierCode, dictionaries)

  // Get cabin class from traveler pricing
  const cabinClass = flightOffer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY'
  const cabinName = flightService.getCabinClassName(cabinClass)

  const handleBookNow = () => {
    if (onSelect) {
      onSelect(flightOffer)
    }
  }

  return (
    <div className="item-flight background-card border-1" style={{ padding: '20px' }}>
      {/* Flight Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <div className="flight-logo" style={{ 
            width: '50px', 
            height: '50px', 
            background: '#f0f0f0', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span className="text-lg-bold neutral-1000">{firstSegment.carrierCode}</span>
          </div>
          <div>
            <p className="text-lg-bold neutral-1000 mb-1">{airline}</p>
            <p className="text-sm-medium neutral-500 mb-0">
              Flight {firstSegment.carrierCode} {firstSegment.number} • {firstSegment.aircraft.code}
            </p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-xs-medium neutral-500 mb-1">{cabinName}</p>
          <p className="heading-5 neutral-1000 mb-0">
            {flightOffer.price.currency} {parseFloat(flightOffer.price.total).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Flight Route */}
      <div className="flight-route-modern mb-3">
        <div className="row align-items-center">
          {/* Departure */}
          <div className="col-4">
            <p className="text-xs-medium neutral-500 mb-1">Departure</p>
            <p className="heading-4 neutral-1000 mb-1">{departureDT.time}</p>
            <p className="text-sm-bold neutral-1000 mb-1">
              {firstSegment.departure.iataCode}
              {firstSegment.departure.terminal && <span className="text-xs-medium neutral-500"> Terminal {firstSegment.departure.terminal}</span>}
            </p>
            <p className="text-xs-medium neutral-500 mb-0">{departureDT.date}</p>
          </div>

          {/* Duration & Stops */}
          <div className="col-4 text-center">
            <p className="text-xs-medium neutral-500 mb-2">
              {stops === 0 ? 'Direct Flight' : `${stops} Stop${stops > 1 ? 's' : ''}`}
            </p>
            <div className="d-flex align-items-center justify-content-center mb-2">
              <div style={{ flex: 1, height: '2px', background: '#ddd' }}></div>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 8px' }}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#666"/>
              </svg>
              <div style={{ flex: 1, height: '2px', background: '#ddd' }}></div>
            </div>
            <p className="text-sm-medium neutral-1000 mb-0">{duration}</p>
          </div>

          {/* Arrival */}
          <div className="col-4 text-end">
            <p className="text-xs-medium neutral-500 mb-1">Arrival</p>
            <p className="heading-4 neutral-1000 mb-1">{arrivalDT.time}</p>
            <p className="text-sm-bold neutral-1000 mb-1">
              {lastSegment.arrival.iataCode}
              {lastSegment.arrival.terminal && <span className="text-xs-medium neutral-500"> Terminal {lastSegment.arrival.terminal}</span>}
            </p>
            <p className="text-xs-medium neutral-500 mb-0">{arrivalDT.date}</p>
          </div>
        </div>
      </div>

        {/* Return Flight (if exists) */}
        {hasReturn && flightOffer.itineraries[1] && (
        <div className="flight-route-modern mb-3 pt-3 border-top">
          {(() => {
            const returnItinerary = flightOffer.itineraries[1]
            const returnFirstSegment = returnItinerary.segments[0]
            const returnLastSegment = returnItinerary.segments[returnItinerary.segments.length - 1]
            const returnDepartureDT = flightService.formatDateTime(returnFirstSegment.departure.at)
            const returnArrivalDT = flightService.formatDateTime(returnLastSegment.arrival.at)
            const returnDuration = flightService.formatDuration(returnItinerary.duration)
            const returnStops = flightService.getTotalStops(returnItinerary)

            return (
              <>
                <p className="text-sm-bold neutral-1000 mb-3">Return Flight</p>
                <div className="row align-items-center">
                  {/* Return Departure */}
                  <div className="col-4">
                    <p className="text-xs-medium neutral-500 mb-1">Departure</p>
                    <p className="heading-4 neutral-1000 mb-1">{returnDepartureDT.time}</p>
                    <p className="text-sm-bold neutral-1000 mb-1">
                      {returnFirstSegment.departure.iataCode}
                      {returnFirstSegment.departure.terminal && <span className="text-xs-medium neutral-500"> Terminal {returnFirstSegment.departure.terminal}</span>}
                    </p>
                    <p className="text-xs-medium neutral-500 mb-0">{returnDepartureDT.date}</p>
                  </div>

                  {/* Duration & Stops */}
                  <div className="col-4 text-center">
                    <p className="text-xs-medium neutral-500 mb-2">
                      {returnStops === 0 ? 'Direct Flight' : `${returnStops} Stop${returnStops > 1 ? 's' : ''}`}
                    </p>
                    <div className="d-flex align-items-center justify-content-center mb-2">
                      <div style={{ flex: 1, height: '2px', background: '#ddd' }}></div>
                      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ margin: '0 8px', transform: 'rotate(180deg)' }}>
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#666"/>
                      </svg>
                      <div style={{ flex: 1, height: '2px', background: '#ddd' }}></div>
                    </div>
                    <p className="text-sm-medium neutral-1000 mb-0">{returnDuration}</p>
                  </div>

                  {/* Return Arrival */}
                  <div className="col-4 text-end">
                    <p className="text-xs-medium neutral-500 mb-1">Arrival</p>
                    <p className="heading-4 neutral-1000 mb-1">{returnArrivalDT.time}</p>
                    <p className="text-sm-bold neutral-1000 mb-1">
                      {returnLastSegment.arrival.iataCode}
                      {returnLastSegment.arrival.terminal && <span className="text-xs-medium neutral-500"> Terminal {returnLastSegment.arrival.terminal}</span>}
                    </p>
                    <p className="text-xs-medium neutral-500 mb-0">{returnArrivalDT.date}</p>
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      )}

      {/* Footer with availability and action */}
      <div className="d-flex justify-content-between align-items-center pt-3 border-top">
        <div className="d-flex align-items-center gap-3">
          <div className="badge bg-light text-dark px-3 py-2">
            <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" className="me-1">
              <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3zm2 4.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
            </svg>
            {flightOffer.numberOfBookableSeats} Seats Available
          </div>
          {stops === 0 && (
            <div className="badge bg-success text-white px-3 py-2">
              <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor" className="me-1">
                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
              </svg>
              Non-Stop
            </div>
          )}
        </div>
        {showBookButton && (
          <button 
            className="btn btn-brand-secondary"
            onClick={handleBookNow}
            style={{ minWidth: '140px' }}
          >
            Select Flight
          </button>
        )}
      </div>
    </div>
  )
}
