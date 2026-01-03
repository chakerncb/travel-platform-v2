'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentCancelPage() {
	const searchParams = useSearchParams()
	const reference = searchParams.get('reference')

	return (
		<div className="container mt-5 mb-5">
			<div className="row justify-content-center">
				<div className="col-md-8">
					<div className="card border-warning">
						<div className="card-body text-center p-5">
							{/* Cancel Icon */}
							<div className="mb-4">
								<svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="12" cy="12" r="10" stroke="#ffc107" strokeWidth="2"/>
									<path d="M12 8V12M12 16H12.01" stroke="#ffc107" strokeWidth="2" strokeLinecap="round"/>
								</svg>
							</div>

							{/* Cancel Message */}
							<h2 className="text-warning mb-3">Payment Cancelled</h2>
							<p className="lead mb-4">Your payment was cancelled and no charges were made.</p>

							{reference && (
								<div className="alert alert-info mb-4">
									<p className="mb-2">Booking Reference: <strong>{reference}</strong></p>
									<p className="mb-0 small">This booking is still pending. You can complete the payment later.</p>
								</div>
							)}

							<div className="mb-4">
								<p className="text-muted">
									Don't worry! Your booking details have been saved. You can try again or contact us for assistance.
								</p>
							</div>

							{/* Action Buttons */}
							<div className="d-flex gap-3 justify-content-center">
								{reference && (
									<Link href={`/booking/${reference}`} className="btn btn-primary">
										Try Payment Again
									</Link>
								)}
								<Link href="/tours" className="btn btn-outline-primary">
									Browse Tours
								</Link>
								<Link href="/contact" className="btn btn-outline-secondary">
									Contact Support
								</Link>
							</div>

							{/* Help Text */}
							<div className="mt-4 pt-4 border-top">
								<p className="text-muted small">
									Need help? Contact our support team at <a href="mailto:support@ecotravelapp.com">support@ecotravelapp.com</a>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
