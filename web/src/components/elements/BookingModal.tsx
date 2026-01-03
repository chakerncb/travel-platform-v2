'use client'
import { useState, useEffect } from 'react'
import { TourDto } from '@/src/types/api'
import { bookingService } from '@/src/services/bookingService'

interface BookingModalProps {
	tour: TourDto
	userSession: any
	adults: number
	children: number
	additionalPeople: number
	totalPrice: string
	onClose: () => void
	onSuccess?: () => void
}

interface PassengerInfo {
	firstName: string
	lastName: string
	email: string
	phone: string
	dateOfBirth: string
	passportNumber?: string
	nationality?: string
}

export default function BookingModal({ tour, userSession, adults, children, additionalPeople, totalPrice, onClose, onSuccess }: BookingModalProps) {
	const [step, setStep] = useState(1) // 1: Main contact, 2: Passengers, 3: Review
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

    console.log('BookingModal userSession:', userSession);
	
	// Main contact information
	const [mainContact, setMainContact] = useState<PassengerInfo>({
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		dateOfBirth: '',
		passportNumber: '',
		nationality: ''
	})

	// Additional passengers (including children and additional people)
	const totalPassengers = adults + children + additionalPeople
	const [passengers, setPassengers] = useState<PassengerInfo[]>(
		Array(totalPassengers - 1).fill(null).map(() => ({
			firstName: '',
			lastName: '',
			email: '',
			phone: '',
			dateOfBirth: '',
			passportNumber: '',
			nationality: ''
		}))
	)

	const [specialRequests, setSpecialRequests] = useState('')
	const [agreedToTerms, setAgreedToTerms] = useState(false)

	// Pre-populate form with user session data
	useEffect(() => {
		if (userSession?.user) {
			setMainContact(prev => ({
				...prev,
				firstName: userSession.user.f_name || prev.firstName,
				lastName: userSession.user.l_name || prev.lastName,
				email: userSession.user.email || prev.email,
				phone: userSession.user.phone || prev.phone
			}))
		}
	}, [userSession])

	const handleMainContactChange = (field: keyof PassengerInfo, value: string) => {
		setMainContact(prev => ({ ...prev, [field]: value }))
	}

	const handlePassengerChange = (index: number, field: keyof PassengerInfo, value: string) => {
		const updated = [...passengers]
		updated[index] = { ...updated[index], [field]: value }
		setPassengers(updated)
	}

	const validateMainContact = () => {
		if (!mainContact.firstName || !mainContact.lastName || !mainContact.email || !mainContact.phone) {
			setError('Please fill in all required fields')
			return false
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mainContact.email)) {
			setError('Please enter a valid email address')
			return false
		}
		setError('')
		return true
	}

	const handleNextStep = () => {
		if (step === 1) {
			if (validateMainContact()) {
				setStep(2)
			}
		} else if (step === 2) {
			setStep(3)
		}
	}

	const handleSubmitBooking = async () => {
		if (!agreedToTerms) {
			setError('Please agree to the terms and conditions')
			return
		}

		setLoading(true)
		setError('')

		try {
			const bookingData = {
				tour_id: tour.id,
				adults_count: adults,
				children_count: children,
				total_price: parseFloat(totalPrice),
				main_contact: mainContact,
				passengers: passengers,
				special_requests: specialRequests,
				start_date: tour.start_date || '',
				end_date: tour.end_date || ''
			}

			const response = await bookingService.create(bookingData)

			// Check if the response indicates success
			if (response.success && response.data) {
				// Show success message
				alert(`🎉 Booking created successfully!\n\nYour booking reference is: ${response.data.booking_reference}\n\nWe've sent a confirmation email to ${mainContact.email}`)
				
				// Call success callback if provided
				if (onSuccess) {
					onSuccess()
				} else {
					onClose()
				}
				
				// Optionally redirect to booking confirmation page
				// window.location.href = `/booking-confirmation/${response.data.booking_reference}`
			} else {
				throw new Error(response.message || 'Failed to create booking')
			}
			
		} catch (err: any) {
			console.error('Booking error:', err)
			// Handle axios error response
			const errorMessage = err.response?.data?.message || err.message || 'An error occurred while processing your booking'
			setError(errorMessage)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
			<div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Complete Your Booking</h5>
						<button type="button" className="btn-close" onClick={onClose}></button>
					</div>

					<div className="modal-body">
						{/* Progress Steps */}
						<div className="mb-4">
							<div className="d-flex justify-content-between align-items-center">
								<div className={`flex-fill text-center ${step >= 1 ? 'text-primary' : 'text-muted'}`}>
									<div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 1 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>1</div>
									<div className="small mt-1">Contact Info</div>
								</div>
								<div className={`flex-fill border-top ${step >= 2 ? 'border-primary' : 'border-secondary'}`} style={{margin: '0 10px', marginBottom: '30px'}}></div>
								<div className={`flex-fill text-center ${step >= 2 ? 'text-primary' : 'text-muted'}`}>
									<div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 2 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>2</div>
									<div className="small mt-1">Passengers</div>
								</div>
								<div className={`flex-fill border-top ${step >= 3 ? 'border-primary' : 'border-secondary'}`} style={{margin: '0 10px', marginBottom: '30px'}}></div>
								<div className={`flex-fill text-center ${step >= 3 ? 'text-primary' : 'text-muted'}`}>
									<div className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step >= 3 ? 'bg-primary text-white' : 'bg-light'}`} style={{width: '40px', height: '40px'}}>3</div>
									<div className="small mt-1">Review</div>
								</div>
							</div>
						</div>

						{/* Tour Summary */}
						<div className="alert alert-info mb-4">
							<h6 className="mb-2">{tour.title}</h6>
							<div className="d-flex justify-content-between small">
								<span>
									👤 {adults} Adult{adults > 1 ? 's' : ''} 
									{children > 0 && `, ${children} Child${children > 1 ? 'ren' : ''}`}
									{additionalPeople > 0 && `, ${additionalPeople} Additional`}
								</span>
								<span>📅 {tour.start_date && new Date(tour.start_date).toLocaleDateString()}</span>
								<span className="fw-bold">💰 ${totalPrice}</span>
							</div>
						</div>

						{error && (
							<div className="alert alert-danger" role="alert">
								{error}
							</div>
						)}

						{/* Step 1: Main Contact Information */}
						{step === 1 && (
							<div>
								<h6 className="mb-3">Main Contact Information</h6>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="form-label">First Name *</label>
										<input
											type="text"
											className="form-control"
										    value={mainContact.firstName}
											onChange={(e) => handleMainContactChange('firstName', e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Last Name *</label>
										<input
											type="text"
											className="form-control"
										    value={mainContact.lastName}
											onChange={(e) => handleMainContactChange('lastName', e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Email *</label>
										<input
											type="email"
											className="form-control"
										    value={mainContact.email}
											onChange={(e) => handleMainContactChange('email', e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Phone *</label>
										<input
											type="tel"
											className="form-control"
										    value={mainContact.phone}
											onChange={(e) => handleMainContactChange('phone', e.target.value)}
											required
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Date of Birth</label>
										<input
											type="date"
											className="form-control"
											value={mainContact.dateOfBirth}
											onChange={(e) => handleMainContactChange('dateOfBirth', e.target.value)}
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Nationality</label>
										<input
											type="text"
											className="form-control"
											value={mainContact.nationality}
											onChange={(e) => handleMainContactChange('nationality', e.target.value)}
										/>
									</div>
									<div className="col-md-6">
										<label className="form-label">Passport Number</label>
										<input
											type="text"
											className="form-control"
											value={mainContact.passportNumber}
											onChange={(e) => handleMainContactChange('passportNumber', e.target.value)}
										/>
									</div>
								</div>
							</div>
						)}

						{/* Step 2: Additional Passengers */}
						{step === 2 && (
							<div>
								<h6 className="mb-3">Additional Passengers ({passengers.length})</h6>
								{passengers.length === 0 ? (
									<p className="text-muted">No additional passengers</p>
								) : (
									passengers.map((passenger, index) => (
										<div key={index} className="border rounded p-3 mb-3">
											<h6 className="mb-3">Passenger {index + 2}</h6>
											<div className="row g-3">
												<div className="col-md-6">
													<label className="form-label">First Name</label>
													<input
														type="text"
														className="form-control"
														value={passenger.firstName}
														onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
													/>
												</div>
												<div className="col-md-6">
													<label className="form-label">Last Name</label>
													<input
														type="text"
														className="form-control"
														value={passenger.lastName}
														onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
													/>
												</div>
												<div className="col-md-6">
													<label className="form-label">Date of Birth</label>
													<input
														type="date"
														className="form-control"
														value={passenger.dateOfBirth}
														onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
													/>
												</div>
												<div className="col-md-6">
													<label className="form-label">Passport Number</label>
													<input
														type="text"
														className="form-control"
														value={passenger.passportNumber}
														onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
													/>
												</div>
											</div>
										</div>
									))
								)}

								<div className="mt-3">
									<label className="form-label">Special Requests or Dietary Requirements</label>
									<textarea
										className="form-control"
										rows={3}
										value={specialRequests}
										onChange={(e) => setSpecialRequests(e.target.value)}
										placeholder="Please let us know about any special requirements..."
									></textarea>
								</div>
							</div>
						)}

						{/* Step 3: Review and Confirm */}
						{step === 3 && (
							<div>
								<h6 className="mb-3">Review Your Booking</h6>
								
								<div className="card mb-3">
									<div className="card-body">
										<h6>Main Contact</h6>
										<p className="mb-1">{mainContact.firstName} {mainContact.lastName}</p>
										<p className="mb-1 small text-muted">{mainContact.email}</p>
										<p className="mb-0 small text-muted">{mainContact.phone}</p>
									</div>
								</div>

								{passengers.length > 0 && (
									<div className="card mb-3">
										<div className="card-body">
											<h6>Additional Passengers</h6>
											{passengers.map((passenger, index) => (
												<p key={index} className="mb-1">
													{passenger.firstName || 'Not provided'} {passenger.lastName || ''}
												</p>
											))}
										</div>
									</div>
								)}

								{specialRequests && (
									<div className="card mb-3">
										<div className="card-body">
											<h6>Special Requests</h6>
											<p className="mb-0">{specialRequests}</p>
										</div>
									</div>
								)}

								<div className="card mb-3">
									<div className="card-body">
										<h6>Booking Summary</h6>
										<div className="d-flex justify-content-between mb-1">
											<span>Adults ({adults})</span>
											<span>${(parseFloat(tour.price) * adults).toFixed(2)}</span>
										</div>
										{children > 0 && (
											<div className="d-flex justify-content-between mb-1">
												<span>Children ({children})</span>
												<span>${(parseFloat(tour.price) * 0.5 * children).toFixed(2)}</span>
											</div>
										)}
										{additionalPeople > 0 && (
											<div className="d-flex justify-content-between mb-1">
												<span>Additional People ({additionalPeople})</span>
												<span>${(parseFloat(tour.price) * additionalPeople).toFixed(2)}</span>
											</div>
										)}
										<hr />
										<div className="d-flex justify-content-between fw-bold">
											<span>Total</span>
											<span>${totalPrice}</span>
										</div>
									</div>
								</div>

								<div className="form-check mb-3">
									<input
										className="form-check-input"
										type="checkbox"
										id="termsCheck"
										checked={agreedToTerms}
										onChange={(e) => setAgreedToTerms(e.target.checked)}
									/>
									<label className="form-check-label" htmlFor="termsCheck">
										I agree to the <a href="/terms" target="_blank">terms and conditions</a> and <a href="/privacy" target="_blank">privacy policy</a>
									</label>
								</div>
							</div>
						)}
					</div>

					<div className="modal-footer">
						{step > 1 && (
							<button 
								type="button" 
								className="btn btn-secondary"
								onClick={() => setStep(step - 1)}
								disabled={loading}
							>
								Back
							</button>
						)}
						<button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
							Cancel
						</button>
						{step < 3 ? (
							<button type="button" className="btn btn-primary" onClick={handleNextStep}>
								Next
							</button>
						) : (
							<button 
								type="button" 
								className="btn btn-primary" 
								onClick={handleSubmitBooking}
								disabled={loading || !agreedToTerms}
							>
								{loading ? 'Processing...' : 'Confirm Booking'}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
