'use client'
import { useState, useEffect } from 'react'
import { TourDto } from '@/src/types/api'
import BookingModal from './BookingModal'
import { bookingService } from '@/src/services/bookingService'
import { getSession } from 'next-auth/react';

interface BookingFormProps {
	tour?: TourDto | null
	bookedPlaces?: number
	userEmail?: string | null
}

interface AdditionalPerson {
	id: number
	name: string
}

export default function BookingForm({ tour, bookedPlaces = 0,  }: BookingFormProps) {
	const [adults, setAdults] = useState(1)
	const [children, setChildren] = useState(0)
	const [showModal, setShowModal] = useState(false)
	const [additionalPeople, setAdditionalPeople] = useState<AdditionalPerson[]>([])
	const [hasExistingBooking, setHasExistingBooking] = useState(false)
	const [isGuest, setIsGuest] = useState(true)
	const [checkingBooking, setCheckingBooking] = useState(true)
	const [session, setSession] = useState<any>(null);

	const  userEmail = session?.user?.email || null;

	useEffect(() => {
		const fetchSession = async () => {
			const sess = await getSession();
			setSession(sess);
		};
		fetchSession();
	}, []);
	

	const basePrice = parseFloat(tour?.price || '0')
	
	// Include additional people in total count
	const additionalCount = additionalPeople.length
	const totalParticipants = adults + children + additionalCount

	// Calculate remaining places
	const maxGroupSize = tour?.max_group_size || 20
	const remainingPlaces = maxGroupSize - bookedPlaces
	const isGroupSizeExceeded = totalParticipants > remainingPlaces
	const isFull = remainingPlaces <= 0

	// Calculate nights (duration_days - 1)
	const durationDays = tour?.duration_days || 0
	const durationNights = durationDays > 0 ? durationDays - 1 : 0

	useEffect(() => {

		const checkIsGuest = () => {
			if (session && session.user) {
				setIsGuest(false)
				checkExistingBooking();
			} else {
				setIsGuest(true)
			}
		}

		checkIsGuest()
	}, [session])

		const checkExistingBooking = async () => {
			if (!tour?.id) return
			
			try {
				setCheckingBooking(true)
				const response = await bookingService.checkUserBooking(tour.id, userEmail || undefined)
				if (response.success && response.data) {
					setHasExistingBooking(response.data.has_booking)
				}
			} catch (error) {
				console.error('Error checking existing booking:', error)
			} finally {
				setCheckingBooking(false)
			}
		}


	const calculateTotal = () => {
		const total = (adults * basePrice) + (additionalCount * basePrice)
		return total.toFixed(2)
	}

	const handleAddPerson = () => {
		if (totalParticipants < remainingPlaces) {
			setAdditionalPeople([...additionalPeople, { id: Date.now(), name: '' }])
		}
	}

	const handleRemovePerson = (id: number) => {
		setAdditionalPeople(additionalPeople.filter(person => person.id !== id))
	}

	const handleBookNow = () => {
		if (!isFull && !isGroupSizeExceeded && totalParticipants > 0 && !hasExistingBooking) {
			setShowModal(true)
		}
	}

	const handleBookingSuccess = () => {
		setShowModal(false)
		// Refresh the page to update availability
		window.location.reload()
	}

	if (!tour) {
		return (
			<div className="content-booking-form">
				<p className="text-center text-md-medium neutral-500">Loading booking information...</p>
			</div>
		)
	}

	return (
		<>
			<div className="content-booking-form">
				{/* Tour Duration */}
				{tour.duration_days && (
					<div className="item-line-booking">
						<strong className="text-md-bold neutral-1000">Duration:</strong>
						<div className="line-booking-right">
							<p className="text-md-medium neutral-1000">
								{durationDays} {durationDays === 1 ? 'Day' : 'Days'} / {durationNights} {durationNights === 1 ? 'Night' : 'Nights'}
							</p>
						</div>
					</div>
				)}

				{/* Tour Dates */}
				{(tour.start_date || tour.end_date) && (
					<div className="item-line-booking">
						<strong className="text-md-bold neutral-1000">Tour Period:</strong>
						<div className="line-booking-right">
							<p className="text-md-medium neutral-1000">
								{tour.start_date && new Date(tour.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
								{tour.start_date && tour.end_date && ' - '}
								{tour.end_date && new Date(tour.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
							</p>
						</div>
					</div>
				)}

				{/* Remaining Places */}
				<div className="item-line-booking">
					<strong className="text-md-bold neutral-1000">Availability:</strong>
					<div className="line-booking-right">
						<p className={`text-md-medium ${remainingPlaces <= 5 && remainingPlaces > 0 ? 'text-warning' : remainingPlaces === 0 ? 'text-danger' : 'neutral-1000'}`}>
							{isFull ? (
								<span className="badge bg-danger">SOLD OUT</span>
							) : (
								<>
									{remainingPlaces} / {maxGroupSize} places left
									{remainingPlaces <= 5 && <span className="ms-2">⚠️ Filling Fast!</span>}
								</>
							)}
						</p>
					</div>
				</div>

				{/* Participants Selection */}
				<div className="item-line-booking">
					<div className="box-tickets">
						<div className="d-flex justify-content-between align-items-center mb-2">
							<strong className="text-md-bold neutral-1000">Participants:</strong>
							<span className="text-xs neutral-500">Max {maxGroupSize} people</span>
						</div>
						
						{/* Adults */}
						<div className="line-booking-tickets">
							<div className="item-ticket">
								<p className="text-md-medium neutral-500 mr-30">Adults (18+ years)</p>
								<p className="text-md-medium neutral-500">DA{basePrice.toFixed(2)} </p>
							</div>
							<div className="dropdown-quantity">
								<div className="dropdown">
									<button className="btn dropdown-toggle" id="dropdownTicket" type="button" data-bs-toggle="dropdown" aria-expanded="false" data-bs-display="static"><span>{adults.toString().padStart(2, '0')}</span>
										<svg width={12} height={7} viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M1 1L6 6L11 1" stroke='#0D0D0D' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
									<ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownTicket">
										{[...Array(Math.min(15, remainingPlaces))].map((_, i) => (
											<li key={i+1}>
												<a 
													className={`dropdown-item ${adults === i+1 ? 'active' : ''}`} 
													href="#"
													onClick={(e) => { e.preventDefault(); setAdults(i+1); }}
												>
													{(i+1).toString().padStart(2, '0')}
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
				
						{/* Additional People */}
						{additionalPeople.map((person, index) => (
							<div key={person.id} className="line-booking-tickets mt-2" style={{backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px'}}>
								<div className="item-ticket">
									<p className="text-md-medium neutral-500 mr-30">{index + 1}</p>
									<p className="text-md-medium neutral-500">${basePrice.toFixed(2)}</p>
								</div>
								<button 
									className="btn btn-sm btn-danger ms-2"
									onClick={() => handleRemovePerson(person.id)}
									style={{padding: '4px 12px', fontSize: '12px', lineHeight: '14px', borderRadius: '4px'}}
								>
									<svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
										<path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
									</svg>
								</button>
							</div>
						))}

						{/* Add Person Button */}
						{totalParticipants < remainingPlaces && !isFull && (
							<button 
								className="btn btn-outline-primary btn-sm mt-2 w-100"
								onClick={handleAddPerson}
								style={{fontSize: '13px', padding: '8px'}}
							>
								+ Add Participant
							 ({totalParticipants}/{remainingPlaces})
							</button>
						)}

						{isGroupSizeExceeded && (
							<div className="alert alert-warning mt-2 mb-0" style={{fontSize: '12px', padding: '8px'}}>
								Not enough places available. Only {remainingPlaces} places left.
							</div>
						)}
					</div>
				</div>

				{/* Included Services */}
				{tour.included_services && tour.included_services.length > 0 && (
					<div className="item-line-booking">
						<div className="box-tickets">
							<strong className="text-md-bold neutral-1000 mb-2 d-block">Included Services:</strong>
							<ul className="list-unstyled" style={{fontSize: '13px'}}>
								{tour.included_services.map((service, index) => (
									<li key={index} className="mb-1 d-flex align-items-start">
										<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2 mt-1" style={{minWidth: '16px'}}>
											<path d="M13.3334 4L6.00002 11.3333L2.66669 8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
										<span className="neutral-700">{service}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* Eco-Friendly Badge */}
				{tour.is_eco_friendly && (
					<div className="item-line-booking">
						<div className="d-flex align-items-center p-2 rounded" style={{backgroundColor: '#f0fdf4', border: '1px solid #86efac'}}>
							<svg width={20} height={20} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
								<path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2M12 4L20 12L12 20L4 12L12 4M11 7V13H13V7H11M11 15V17H13V15H11Z" fill="#16a34a"/>
							</svg>
							<span className="text-sm-medium" style={{color: '#15803d'}}>
								🌿 Eco-Friendly Tour
							</span>
						</div>
					</div>
				)}

				{/* Total */}
				<div className="item-line-booking last-item"> 
					<strong className="text-md-bold neutral-1000">Total:</strong>
					<div className="line-booking-right">
						<p className="text-xl-bold neutral-1000">${calculateTotal()}</p>
					</div>
				</div>

				{/* Book Button */}
				<div className="box-button-book"> 
				  {isGuest ? (
					<button className="btn btn-book" disabled style={{opacity: 0.7, backgroundColor: '#6c757d'}}>
						Login to Book
					</button>
				 ) : checkingBooking ? (
					<button className="btn btn-book" disabled style={{opacity: 0.7}}>
						Checking...
					</button>
				) : hasExistingBooking ? (
					<button className="btn btn-book" disabled style={{opacity: 0.7, backgroundColor: '#6c757d'}}>
						Already Booked ✓
					</button>
				) : (
					<button 
						className="btn btn-book" 
						disabled={isFull || isGroupSizeExceeded || totalParticipants === 0}
						onClick={handleBookNow}
						style={{opacity: isFull || isGroupSizeExceeded || totalParticipants === 0 ? 0.5 : 1}}
					>
						{isFull ? 'Sold Out' : 'Book Now'}
						<svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M8 15L15 8L8 1M15 8L1 8" stroke='#0D0D0D' strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</button>
				)}
				</div>

				{hasExistingBooking && !isGuest && (
					<div className="alert alert-info mt-2 mb-2" style={{fontSize: '12px', padding: '8px'}}>
						You have already booked this tour. Check your email for booking details.
					</div>
				)}

				{isGuest && (
					<div className="alert alert-warning mt-2 mb-2" style={{fontSize: '12px', padding: '8px'}}>
						⚠️ You must login to book this tour.
					</div>
				)}

				{/* Help Link */}
				<div className="box-need-help"> 
					<a href="/contact">
						<svg width={12} height={14} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M2.83366 3.66667C2.83366 1.92067 4.25433 0.5 6.00033 0.5C7.74633 0.5 9.16699 1.92067 9.16699 3.66667C9.16699 5.41267 7.74633 6.83333 6.00033 6.83333C4.25433 6.83333 2.83366 5.41267 2.83366 3.66667ZM8.00033 7.83333H4.00033C1.88699 7.83333 0.166992 9.55333 0.166992 11.6667C0.166992 12.678 0.988992 13.5 2.00033 13.5H10.0003C11.0117 13.5 11.8337 12.678 11.8337 11.6667C11.8337 9.55333 10.1137 7.83333 8.00033 7.83333Z" fill='#0D0D0D' />
						</svg>Need some help?
					</a>
				</div>
			</div>

			{/* Booking Modal */}
			{showModal && tour && (
				<BookingModal
					tour={tour}
					userSession={session}
					adults={adults}
					children={children}
					additionalPeople={additionalCount}
					totalPrice={calculateTotal()}
					onClose={() => setShowModal(false)}
					onSuccess={handleBookingSuccess}
				/>
			)}
		</>
	)
}