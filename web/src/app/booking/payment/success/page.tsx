'use client'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface BookingDetails {
	booking_reference: string
	status: string
	tour_title?: string
	total_amount?: number
	customer_email?: string
	payment_status?: string
	checkout_id?: string
}

export default function PaymentSuccessPage() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const [loading, setLoading] = useState(true)
	const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null)
	const [error, setError] = useState<string | null>(null)

	const reference = searchParams.get('reference')
	const checkoutId = searchParams.get('checkout_id')

	useEffect(() => {
		const verifyPayment = async () => {
			if (!reference) {
				setError('Missing booking reference')
				setLoading(false)
				return
			}

			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/bookings/verify-payment?reference=${reference}&checkout_id=${checkoutId || ''}`,
					{
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
						},
					}
				)

				const data = await response.json()

				if (response.ok && data.success) {
					setBookingDetails(data.data)
				} else {
					setError(data.message || 'Failed to verify payment')
				}
			} catch (err) {
				console.error('Payment verification error:', err)
				setError('An error occurred while verifying your payment')
			} finally {
				setLoading(false)
			}
		}

		verifyPayment()
	}, [reference, checkoutId])

	if (loading) {
		return (
			<div className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8 text-center">
						<div className="spinner-border text-primary mb-3" role="status">
							<span className="visually-hidden">Loading...</span>
						</div>
						<h4>Verifying your payment...</h4>
						<p className="text-muted">Please wait while we confirm your booking.</p>
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className="container mt-5 mb-5">
				<div className="row justify-content-center">
					<div className="col-md-8">
						<div className="card border-danger">
							<div className="card-body text-center p-5">
								<div className="mb-4">
									<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
										<circle cx="12" cy="12" r="10" stroke="#dc3545" strokeWidth="2"/>
										<path d="M15 9L9 15M9 9L15 15" stroke="#dc3545" strokeWidth="2" strokeLinecap="round"/>
									</svg>
								</div>
								<h2 className="text-danger mb-3">Payment Verification Failed</h2>
								<p className="text-muted mb-4">{error}</p>
								<div className="d-flex gap-3 justify-content-center">
									<Link href="/tours" className="btn btn-outline-primary">
										Browse Tours
									</Link>
									<Link href="/contact" className="btn btn-primary">
										Contact Support
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="container mt-5 mb-5">
			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="card border-success">
						<div className="card-body text-center p-5">
							{/* Success Icon */}
							<div className="mb-4">
								<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="12" r="10" stroke="#28a745" strokeWidth="2"/>
									<path d="M8 12L11 15L16 9" stroke="#28a745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</div>

							{/* Success Message */}
							<h2 className="text-success mb-3">Payment Successful!</h2>
							<p className="lead mb-4">Your booking has been confirmed.</p>

							{/* Booking Details */}
							{bookingDetails && (
								<div className="card bg-light mb-4">
									<div className="card-body text-start">
										<h5 className="card-title mb-3">Booking Details</h5>
										<div className="row mb-2">
											<div className="col-6 text-muted">Booking Reference:</div>
											<div className="col-6">
												<strong>{bookingDetails.booking_reference}</strong>
											</div>
										</div>
										{bookingDetails.tour_title && (
											<div className="row mb-2">
												<div className="col-6 text-muted">Tour:</div>
												<div className="col-6">{bookingDetails.tour_title}</div>
											</div>
										)}
										{bookingDetails.total_amount && (
											<div className="row mb-2">
												<div className="col-6 text-muted">Amount Paid:</div>
												<div className="col-6">
													<strong className="text-success">
													${Number(bookingDetails.total_amount).toFixed(2)}
													</strong>
												</div>
											</div>
										)}
										<div className="row mb-2">
											<div className="col-6 text-muted">Payment Status:</div>
											<div className="col-6">
												<span className="badge bg-success">
													{bookingDetails.payment_status || 'Paid'}
												</span>
											</div>
										</div>
										<div className="row">
											<div className="col-6 text-muted">Booking Status:</div>
											<div className="col-6">
												<span className="badge bg-info">
													{bookingDetails.status || 'Confirmed'}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* Email Confirmation Notice */}
							<div className="alert alert-info">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
									<path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
								{bookingDetails?.customer_email ? (
									<>
										A confirmation email has been sent to <strong>{bookingDetails.customer_email}</strong>
									</>
								) : (
									'A confirmation email has been sent to your email address.'
								)}
							</div>

							{/* Action Buttons */}
							<div className="d-flex gap-3 justify-content-center mt-4">
								<Link href="/tours" className="btn btn-outline-primary">
									Browse More Tours
								</Link>
								<button 
									onClick={() => window.print()} 
									className="btn btn-secondary"
								>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="me-2">
										<path d="M6 9V2H18V9M6 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V11C2 10.4696 2.21071 9.96086 2.58579 9.58579C2.96086 9.21071 3.46957 9 4 9H20C20.5304 9 21.0391 9.21071 21.4142 9.58579C21.7893 9.96086 22 10.4696 22 11V16C22 16.5304 21.7893 17.0391 21.4142 17.4142C21.0391 17.7893 20.5304 18 20 18H18M6 14H18V22H6V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
									</svg>
									Print Confirmation
								</button>
							</div>

							{/* Help Text */}
							<div className="mt-4 pt-4 border-top">
								<p className="text-muted small mb-2">
									Need help? Contact our support team at <a href="mailto:support@ecotravelapp.com">support@ecotravelapp.com</a>
								</p>
								<p className="text-muted small mb-0">
									Reference this booking number in all communications: <strong>{bookingDetails?.booking_reference || reference}</strong>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
