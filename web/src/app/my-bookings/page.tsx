'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Layout from "@/src/components/layout/Layout"
import Link from "next/link"

interface Booking {
    id: number
    booking_reference: string
    tour_id: number
    user_id: number
    contact_email: string
    contact_first_name: string
    contact_last_name: string
    tour?: {
        id: number
        title: string
        location?: string
    }
    adults_count: number
    children_count: number
    total_passengers: number
    total_price: string
    status: string
    payment_status: string
    payment_method?: string | null
    payment_date?: string | null
    start_date: string
    end_date: string
    special_requests?: string
    created_at: string
    updated_at: string
}

interface CustomTourBooking {
    id: number
    booking_reference: string
    user_email: string
    user_name: string
    destinations: Array<{
        id: number
        name: string
        order: number
    }> | null
    hotels: Array<{
        id: number
        name: string
        order: number
    }> | null
    number_of_persons: number
    proposed_price: string
    admin_price?: string
    final_price?: string
    minimum_price: string
    estimated_hotel_cost: string
    status: string
    notes?: string
    admin_notes?: string
    admin_recommended_destinations?: any[] | null
    admin_recommended_hotels?: any[] | null
    payment_status: string
    payment_method?: string | null
    paid_at?: string | null
    admin_reviewed_at?: string | null
    user_confirmed_at?: string | null
    created_at: string
    updated_at: string
}

type AllBookings = (Booking & { type: 'regular' }) | (CustomTourBooking & { type: 'custom' })

const statusColors: Record<string, string> = {
    'pending': 'badge-warning',
    'admin_reviewing': 'badge-info',
    'admin_proposed': 'badge-primary',
    'user_confirmed': 'badge-success',
    'payment_pending': 'badge-warning',
    'confirmed': 'badge-success',
    'completed': 'badge-success',
    'cancelled': 'badge-danger',
    'rejected': 'badge-danger'
}

const statusLabels: Record<string, string> = {
    'pending': 'Pending Review',
    'admin_reviewing': 'Under Review',
    'admin_proposed': 'Proposal Received',
    'user_confirmed': 'Confirmed',
    'confirmed': 'Confirmed',
    'payment_pending': 'Payment Pending',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rejected': 'Rejected'
}

export default function MyBookings() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [bookings, setBookings] = useState<AllBookings[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedBooking, setSelectedBooking] = useState<AllBookings | null>(null)
    const [showDetails, setShowDetails] = useState(false)

    // Type guard functions
    const isRegularBooking = (booking: AllBookings): booking is Booking & { type: 'regular' } => {
        return booking.type === 'regular'
    }

    const isCustomBooking = (booking: AllBookings): booking is CustomTourBooking & { type: 'custom' } => {
        return booking.type === 'custom'
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
            return
        }

        if (status === 'authenticated' && session?.user?.email) {
            fetchBookings()
        }
    }, [status, session, router])

    const fetchBookings = async () => {
        try {
            // Get the session token for authenticated requests
            const token = (session as any)?.accessToken
            
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            }
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            // Fetch both regular and custom tour bookings in parallel
            const [regularResponse, customResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
                    headers
                }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/custom-tour-bookings?user_email=${session?.user?.email}`)
            ])
            
            const allBookings: AllBookings[] = []

            // Process regular bookings
            if (regularResponse.ok) {
                const regularResult = await regularResponse.json()
                console.log('Regular bookings response:', regularResult)
                const regularBookingsData = regularResult.data || regularResult || []
                const typedRegularBookings = regularBookingsData.map((b: Booking) => ({
                    ...b,
                    type: 'regular' as const
                }))
                allBookings.push(...typedRegularBookings)
                console.log('Regular bookings loaded:', typedRegularBookings.length)
            } else {
                console.error('Failed to fetch regular bookings:', regularResponse.status, regularResponse.statusText)
                const errorText = await regularResponse.text()
                console.error('Error details:', errorText)
            }

            // Process custom tour bookings
            if (customResponse.ok) {
                const customResult = await customResponse.json()
                console.log('Custom bookings response:', customResult)
                const customBookingsData = customResult.data || customResult || []
                const typedCustomBookings = customBookingsData.map((b: CustomTourBooking) => ({
                    ...b,
                    type: 'custom' as const
                }))
                allBookings.push(...typedCustomBookings)
                console.log('Custom bookings loaded:', typedCustomBookings.length)
            } else {
                console.error('Failed to fetch custom bookings:', customResponse.status, customResponse.statusText)
            }

            // Sort by created_at date, newest first
            allBookings.sort((a, b) => 
                new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            )

            console.log('Total bookings:', allBookings.length)
            setBookings(allBookings)
        } catch (error) {
            console.error('Error fetching bookings:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = (booking: AllBookings) => {
        setSelectedBooking(booking)
        setShowDetails(true)
    }

    const handleConfirmProposal = async (bookingId: number) => {
        if (!confirm('Are you sure you want to confirm this proposal?')) return

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/custom-tour-bookings/${bookingId}/confirm`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            )

            if (!response.ok) {
                throw new Error('Failed to confirm proposal')
            }

            alert('Proposal confirmed! You will receive payment instructions via email.')
            fetchBookings()
            setShowDetails(false)
        } catch (error) {
            console.error('Error confirming proposal:', error)
            alert('Failed to confirm proposal. Please try again.')
        }
    }

    const handleRejectProposal = async (bookingId: number) => {
        const reason = prompt('Please provide a reason for rejection (optional):')
        
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/custom-tour-bookings/${bookingId}/reject`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        rejection_reason: reason || 'User declined proposal'
                    })
                }
            )

            if (!response.ok) {
                throw new Error('Failed to reject proposal')
            }

            alert('Booking has been rejected.')
            fetchBookings()
            setShowDetails(false)
        } catch (error) {
            console.error('Error rejecting proposal:', error)
            alert('Failed to reject proposal. Please try again.')
        }
    }

    if (loading) {
        return (
            <Layout headerStyle={1} footerStyle={1}>
                <div className="container">
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading your bookings...</p>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout headerStyle={1} footerStyle={1}>
            <main className="main">
                <section className="box-section box-breadcrumb background-body">
                    <div className="container">
                        <ul className="breadcrumbs">
                            <li><Link href="/">Home</Link><span className="arrow-right">
                                <svg width={7} height={12} viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 11L6 6L1 1" stroke="" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg></span>
                            </li>
                            <li><span className="text-breadcrumb">My Custom Tour Bookings</span></li>
                        </ul>
                    </div>
                </section>

                <section className="box-section box-content background-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="box-header-page">
                                    <h4 className="neutral-1000">My Bookings</h4>
                                    <p className="text-lg-medium neutral-500">
                                        View and manage all your tour bookings
                                    </p>
                                </div>

                                {bookings.length === 0 ? (
                                    <div className="text-center py-5">
                                        <svg width={80} height={80} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-3">
                                            <path d="M20 6H4C2.89543 6 2 6.89543 2 8V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6Z" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M2 10H22" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M7 2V6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M17 2V6" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        <h5 className="neutral-500 mb-3">No bookings yet</h5>
                                        <p className="text-md-medium neutral-500 mb-4">
                                            You haven't made any tour bookings yet.
                                        </p>
                                        <div className="d-flex gap-3 justify-content-center">
                                            <Link href="/tours" className="btn btn-brand-2">
                                                Browse Tours
                                            </Link>
                                            <Link href="/custom-tour" className="btn btn-outline-brand-2">
                                                Create Custom Tour
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bookings-table-container">
                                        <div className="table-responsive">
                                            <table className="bookings-table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Reference</th>
                                                        <th scope="col">Tour/Details</th>
                                                        <th scope="col">Persons</th>
                                                        <th scope="col">Price</th>
                                                        <th scope="col">Status</th>
                                                        <th scope="col">Created</th>
                                                        <th scope="col">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bookings.map((booking) => (
                                                        <tr key={`${booking.type}-${booking.id}`}>
                                                            <td>
                                                                <span className={`type-badge ${booking.type === 'custom' ? 'badge-custom' : 'badge-regular'}`}>
                                                                    {booking.type === 'custom' ? 'Custom' : 'Regular'}
                                                                </span>
                                                            </td>
                                                            <th scope="row">
                                                                <strong className="booking-reference">{booking.booking_reference}</strong>
                                                            </th>
                                                            <td>
                                                                {booking.type === 'regular' ? (
                                                                    <span className="tour-title">{booking.tour?.title || 'N/A'}</span>
                                                                ) : (
                                                                    <span className="destinations-summary">
                                                                        {booking.destinations?.length || 0} destinations, {booking.hotels?.length || 0} hotels
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>
                                                                {isRegularBooking(booking) ? booking.total_passengers : booking.number_of_persons}
                                                            </td>
                                                            <td>
                                                                {isRegularBooking(booking) ? (
                                                                    <span className="price-final">DA {parseFloat(booking.total_price).toFixed(2)}</span>
                                                                ) : isCustomBooking(booking) ? (
                                                                    booking.final_price ? (
                                                                        <span className="price-final">DA {parseFloat(booking.final_price).toFixed(2)}</span>
                                                                    ) : booking.admin_price ? (
                                                                        <span className="price-proposed">DA {parseFloat(booking.admin_price).toFixed(2)}</span>
                                                                    ) : (
                                                                        <span className="price-initial">DA {parseFloat(booking.proposed_price).toFixed(2)}</span>
                                                                    )
                                                                ) : null}
                                                            </td>
                                                            <td>
                                                                <span className={`status-badge ${statusColors[booking.status]}`}>
                                                                    {statusLabels[booking.status] || booking.status}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                                                            <td>
                                                                <button 
                                                                    className="btn-view-details"
                                                                    onClick={() => handleViewDetails(booking)}
                                                                >
                                                                    View Details
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <br /><br />
                </section>

                {/* Details Modal */}
                {showDetails && selectedBooking && (
                    <div className="modal-overlay" onClick={() => setShowDetails(false)}>
                        <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Booking Details - {selectedBooking.booking_reference}</h3>
                                <button className="modal-close" onClick={() => setShowDetails(false)}>×</button>
                            </div>
                            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="booking-details">
                                    <div className="mb-3">
                                        <span className={`type-badge ${selectedBooking.type === 'custom' ? 'badge-custom' : 'badge-regular'}`}>
                                            {selectedBooking.type === 'custom' ? 'Custom Tour' : 'Regular Tour'}
                                        </span>
                                    </div>
                                    
                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h5 className="mb-3">Booking Information</h5>
                                            <p><strong>Reference:</strong> {selectedBooking.booking_reference}</p>
                                            <p><strong>Status:</strong> <span className={`badge ${statusColors[selectedBooking.status]}`}>
                                                {statusLabels[selectedBooking.status]}
                                            </span></p>
                                            <p><strong>Number of Persons:</strong> {isRegularBooking(selectedBooking) ? selectedBooking.total_passengers : selectedBooking.number_of_persons}</p>
                                            {isRegularBooking(selectedBooking) && (
                                                <>
                                                    <p><strong>Adults:</strong> {selectedBooking.adults_count}</p>
                                                    <p><strong>Children:</strong> {selectedBooking.children_count}</p>
                                                    <p><strong>Tour Dates:</strong> {new Date(selectedBooking.start_date).toLocaleDateString()} - {new Date(selectedBooking.end_date).toLocaleDateString()}</p>
                                                </>
                                            )}
                                            <p><strong>Created:</strong> {new Date(selectedBooking.created_at).toLocaleString()}</p>
                                            {isRegularBooking(selectedBooking) && selectedBooking.tour && (
                                                <p><strong>Tour:</strong> {selectedBooking.tour.title}</p>
                                            )}
                                        </div>
                                        <div className="col-md-6">
                                            <h5 className="mb-3">Pricing</h5>
                                            {isRegularBooking(selectedBooking) ? (
                                                <>
                                                    <p className="text-success"><strong>Total Price:</strong> DA {parseFloat(selectedBooking.total_price).toFixed(2)}</p>
                                                    <p><strong>Payment Status:</strong> {selectedBooking.payment_status}</p>
                                                    {selectedBooking.payment_method && (
                                                        <p><strong>Payment Method:</strong> {selectedBooking.payment_method}</p>
                                                    )}
                                                    {selectedBooking.payment_date && (
                                                        <p><strong>Payment Date:</strong> {new Date(selectedBooking.payment_date).toLocaleString()}</p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <p><strong>Your Proposed Price:</strong> DA{parseFloat(selectedBooking.proposed_price).toFixed(2)}</p>
                                                    <p><strong>Minimum Price:</strong> DA{parseFloat(selectedBooking.minimum_price).toFixed(2)}</p>
                                                    {selectedBooking.admin_price && (
                                                        <p className="text-warning"><strong>Admin Proposed Price:</strong> DA{parseFloat(selectedBooking.admin_price).toFixed(2)}</p>
                                                    )}
                                                    {selectedBooking.final_price && (
                                                        <p className="text-success"><strong>Final Price:</strong> DA{parseFloat(selectedBooking.final_price).toFixed(2)}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {isRegularBooking(selectedBooking) && (
                                        <div className="row mb-4">
                                            <div className="col-md-12">
                                                <h5 className="mb-3">Contact Information</h5>
                                                <p><strong>Name:</strong> {selectedBooking.contact_first_name} {selectedBooking.contact_last_name}</p>
                                                <p><strong>Email:</strong> {selectedBooking.contact_email}</p>
                                                {selectedBooking.special_requests && (
                                                    <div className="mt-3">
                                                        <strong>Special Requests:</strong>
                                                        <p className="text-muted">{selectedBooking.special_requests}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && (
                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <h5 className="mb-3">Destinations ({selectedBooking.destinations?.length || 0})</h5>
                                                <ul className="list-unstyled">
                                                    {selectedBooking.destinations?.map((dest) => (
                                                        <li key={dest.id} className="mb-2">
                                                            <span className="badge bg-secondary me-2">Day {dest.order}</span>
                                                            {dest.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="col-md-6">
                                                <h5 className="mb-3">Hotels ({selectedBooking.hotels?.length || 0})</h5>
                                                <ul className="list-unstyled">
                                                    {selectedBooking.hotels?.map((hotel) => (
                                                        <li key={hotel.id} className="mb-2">
                                                            • {hotel.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && selectedBooking.notes && (
                                        <div className="mb-4">
                                            <h5 className="mb-3">Your Notes</h5>
                                            <p className="text-muted">{selectedBooking.notes}</p>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && selectedBooking.admin_notes && (
                                        <div className="mb-4">
                                            <h5 className="mb-3">Admin Response</h5>
                                            <div className="alert alert-info">
                                                {selectedBooking.admin_notes}
                                            </div>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && selectedBooking.admin_recommended_destinations && selectedBooking.admin_recommended_destinations.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="mb-3">Recommended Destinations</h5>
                                            <ul className="list-unstyled">
                                                {selectedBooking.admin_recommended_destinations.map((dest: any) => (
                                                    <li key={dest.id} className="mb-2">
                                                        <span className="badge bg-success me-2">Recommended</span>
                                                        {dest.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && selectedBooking.admin_recommended_hotels && selectedBooking.admin_recommended_hotels.length > 0 && (
                                        <div className="mb-4">
                                            <h5 className="mb-3">Recommended Hotels</h5>
                                            <ul className="list-unstyled">
                                                {selectedBooking.admin_recommended_hotels.map((hotel: any) => (
                                                    <li key={hotel.id} className="mb-2">
                                                        <span className="badge bg-success me-2">Recommended</span>
                                                        {hotel.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {isCustomBooking(selectedBooking) && selectedBooking.status === 'admin_proposed' && (
                                        <div className="mt-4">
                                            <div className="alert alert-warning">
                                                <h6>Action Required</h6>
                                                <p>The admin has reviewed your request and made a proposal. Please review the details and decide whether to accept or decline.</p>
                                            </div>
                                            <div className="d-flex gap-3">
                                                <button 
                                                    className="btn btn-success"
                                                    onClick={() => handleConfirmProposal(selectedBooking.id)}
                                                >
                                                    Accept Proposal
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger"
                                                    onClick={() => handleRejectProposal(selectedBooking.id)}
                                                >
                                                    Decline Proposal
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                .bookings-table-container {
                    position: relative;
                    overflow-x: auto;
                    background: #ffffff;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    border-radius: 8px;
                    border: 1px solid #e4e6e8;
                    margin-top: 1.5rem;
                }

                .bookings-table {
                    width: 100%;
                    text-align: left;
                    font-size: 0.875rem;
                    color: #4d4d4d;
                    border-collapse: collapse;
                }

                .bookings-table thead {
                    font-size: 0.875rem;
                    color: #4d4d4d;
                    background: #f2f4f6;
                    border-top: 1px solid #e4e6e8;
                    border-bottom: 1px solid #e4e6e8;
                }

                .bookings-table thead th {
                    padding: 0.75rem 1.5rem;
                    font-weight: 600;
                    white-space: nowrap;
                    color: #4d4d4d;
                }

                .bookings-table tbody tr {
                    background: #ffffff;
                    border-bottom: 1px solid #e4e6e8;
                    transition: background-color 0.15s ease;
                }

                .bookings-table tbody tr:hover {
                    background: #f2f4f6;
                }

                .bookings-table tbody tr:last-child {
                    border-bottom: none;
                }

                .bookings-table tbody th,
                .bookings-table tbody td {
                    padding: 1rem 1.5rem;
                    vertical-align: middle;
                    color: #4d4d4d;
                }

                .bookings-table tbody th {
                    font-weight: 600;
                    color: #000000;
                    white-space: nowrap;
                }

                .booking-reference {
                    color: #000000;
                    font-weight: 600;
                    font-size: 0.875rem;
                }

                .count-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 28px;
                    height: 28px;
                    padding: 0 8px;
                    background: #f2f4f6;
                    border-radius: 6px;
                    font-weight: 600;
                    color: #4d4d4d;
                    font-size: 0.8125rem;
                }

                .type-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .badge-custom {
                    background-color: #e0f2fe;
                    color: #0369a1;
                    border: 1px solid #7dd3fc;
                }

                .badge-regular {
                    background-color: #f3e8ff;
                    color: #7c3aed;
                    border: 1px solid #c4b5fd;
                }

                .tour-title {
                    font-weight: 500;
                    color: #4d4d4d;
                }

                .destinations-summary {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .price-final {
                    color: #3dc262;
                    font-weight: 600;
                }

                .price-proposed {
                    color: #f09814;
                    font-weight: 600;
                }

                .price-initial {
                    color: #4d4d4d;
                    font-weight: 600;
                }

                .status-badge {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 0.8125rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .btn-view-details {
                    padding: 6px 14px;
                    background: #ffffff;
                    color: #9761dc;
                    border: 1px solid #9761dc;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 0.8125rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .btn-view-details:hover {
                    background: #9761dc;
                    color: #ffffff;
                }

                /* Dark Mode Styles */
                @media (prefers-color-scheme: dark) {
                    .bookings-table-container {
                        background: #1e1e1e;
                        border-color: #3a3a3a;
                        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
                    }

                    .bookings-table {
                        color: #d1d5db;
                    }

                    .bookings-table thead {
                        background: #2a2a2a;
                        border-top-color: #3a3a3a;
                        border-bottom-color: #3a3a3a;
                        color: #e5e7eb;
                    }

                    .bookings-table thead th {
                        color: #e5e7eb;
                    }

                    .bookings-table tbody tr {
                        background: #1e1e1e;
                        border-bottom-color: #3a3a3a;
                    }

                    .bookings-table tbody tr:hover {
                        background: #2a2a2a;
                    }

                    .bookings-table tbody th,
                    .bookings-table tbody td {
                        color: #d1d5db;
                    }

                    .bookings-table tbody th {
                        color: #f9fafb;
                    }

                    .booking-reference {
                        color: #f9fafb;
                    }

                    .count-badge {
                        background: #2a2a2a;
                        color: #d1d5db;
                    }

                    .badge-custom {
                        background-color: #0c4a6e;
                        color: #7dd3fc;
                        border-color: #0369a1;
                    }

                    .badge-regular {
                        background-color: #581c87;
                        color: #d8b4fe;
                        border-color: #7c3aed;
                    }

                    .tour-title {
                        color: #d1d5db;
                    }

                    .destinations-summary {
                        color: #9ca3af;
                    }

                    .price-initial {
                        color: #d1d5db;
                    }

                    .btn-view-details {
                        background: #1e1e1e;
                        color: #a78bfa;
                        border-color: #a78bfa;
                    }

                    .btn-view-details:hover {
                        background: #a78bfa;
                        color: #1e1e1e;
                    }
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                }

                .modal-content {
                    background: #ffffff;
                    border-radius: 12px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    color: #000000;
                }

                .modal-content.modal-lg {
                    max-width: 900px;
                }

                .modal-header {
                    padding: 20px 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #ffffff;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #000000;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 28px;
                    cursor: pointer;
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #6b7280;
                    transition: color 0.2s;
                }

                .modal-close:hover {
                    color: #1f2937;
                }

                .modal-body {
                    padding: 24px;
                    overflow-y: auto;
                    background: #ffffff;
                    color: #000000;
                }

                .modal-body h5 {
                    color: #000000;
                    margin-bottom: 0.75rem;
                }

                .modal-body p,
                .modal-body li {
                    color: #4d4d4d;
                }

                .modal-body strong {
                    color: #000000;
                }

                .booking-details .row {
                    color: #4d4d4d;
                }

                /* Dark Mode Modal Styles */
                @media (prefers-color-scheme: dark) {
                    .modal-overlay {
                        background: rgba(0, 0, 0, 0.7);
                    }

                    .modal-content {
                        background: #1e1e1e;
                        color: #f9fafb;
                    }

                    .modal-header {
                        background: #1e1e1e;
                        border-bottom-color: #3a3a3a;
                    }

                    .modal-header h3 {
                        color: #f9fafb;
                    }

                    .modal-close {
                        color: #9ca3af;
                    }

                    .modal-close:hover {
                        color: #d1d5db;
                    }

                    .modal-body {
                        background: #1e1e1e;
                        color: #f9fafb;
                    }

                    .modal-body h5 {
                        color: #f9fafb;
                    }

                    .modal-body p,
                    .modal-body li {
                        color: #d1d5db;
                    }

                    .modal-body strong {
                        color: #f9fafb;
                    }

                    .booking-details .row {
                        color: #d1d5db;
                    }

                    .alert-info {
                        background: #1e3a5f;
                        color: #93c5fd;
                        border-color: #1e40af;
                    }

                    .alert-warning {
                        background: #78350f;
                        color: #fde68a;
                        border-color: #b45309;
                    }
                }

                .badge-warning {
                    background-color: #fff3cd;
                    color: #856404;
                    border: 1px solid #ffeaa7;
                }

                .badge-info {
                    background-color: #d1ecf1;
                    color: #0c5460;
                    border: 1px solid #bee5eb;
                }

                .badge-primary {
                    background-color: #e7e5ff;
                    color: #9761dc;
                    border: 1px solid #9761dc;
                }

                .badge-success {
                    background-color: #d4edda;
                    color: #155724;
                    border: 1px solid #c3e6cb;
                }

                .badge-danger {
                    background-color: #f8d7da;
                    color: #721c24;
                    border: 1px solid #f5c6cb;
                }

                /* Dark Mode Badge Styles */
                @media (prefers-color-scheme: dark) {
                    .badge-warning {
                        background-color: #78350f;
                        color: #fde68a;
                        border-color: #92400e;
                    }

                    .badge-info {
                        background-color: #1e40af;
                        color: #93c5fd;
                        border-color: #1e3a8a;
                    }

                    .badge-primary {
                        background-color: #4c1d95;
                        color: #c4b5fd;
                        border-color: #6d28d9;
                    }

                    .badge-success {
                        background-color: #065f46;
                        color: #6ee7b7;
                        border-color: #047857;
                    }

                    .badge-danger {
                        background-color: #991b1b;
                        color: #fca5a5;
                        border-color: #b91c1c;
                    }
                }

                @media (max-width: 768px) {
                    .bookings-table thead th,
                    .bookings-table tbody th,
                    .bookings-table tbody td {
                        padding: 0.75rem 0.75rem;
                        font-size: 0.8125rem;
                    }

                    .btn-view-details {
                        padding: 5px 10px;
                        font-size: 0.75rem;
                    }

                    .booking-reference {
                        font-size: 0.75rem;
                    }

                    .count-badge {
                        min-width: 24px;
                        height: 24px;
                }
            `}</style>
        </Layout>
    )
}
