<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
        }
        .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #6b7280;
        }
        .detail-value {
            color: #111827;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            background: #d1fae5;
            color: #065f46;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .payment-button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 18px;
            margin: 20px 0;
            text-align: center;
        }
        .payment-button:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
        }
        .highlight {
            background: #dcfce7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #10b981;
        }
        .payment-section {
            background: #fef3c7;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
            border: 2px solid #f59e0b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Booking Confirmed!</h1>
        <p>Your adventure is almost ready</p>
    </div>
    
    <div class="content">
        <h2>Congratulations {{ $booking->contact_first_name }} {{ $booking->contact_last_name }}!</h2>
        
        <p>Great news! Your booking has been <span class="status-badge">CONFIRMED</span> by our team.</p>
        
        <div class="highlight">
            <strong>🎯 Next Step: Complete Your Payment</strong>
            <p>To finalize your reservation, please complete the payment using the secure link below. Your spot will be held for 48 hours.</p>
        </div>
        
        <div class="payment-section">
            <h3>💳 Payment Required</h3>
            <p style="font-size: 24px; color: #111827; margin: 15px 0;">
                <strong>Total Amount: ${{ number_format($booking->total_price, 2) }}</strong>
            </p>
            <a href="{{ $paymentLink }}" class="payment-button">
                Pay Now Securely →
            </a>
            <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
                Powered by Chargily - Secure Payment Gateway
            </p>
        </div>
        
        <div class="booking-details">
            <h3>Booking Details</h3>
            
            <div class="detail-row">
                <span class="detail-label">Booking Reference:</span>
                <span class="detail-value"><strong>{{ $booking->booking_reference }}</strong></span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Tour:</span>
                <span class="detail-value">{{ $tour->title }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Travel Date:</span>
                <span class="detail-value">{{ $booking->start_date->format('M d, Y') }} - {{ $booking->end_date->format('M d, Y') }}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Participants:</span>
                <span class="detail-value">{{ $booking->adults_count }} Adults, {{ $booking->children_count }} Children</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">{{ $tour->duration_days }} Days / {{ $tour->duration_days - 1 }} Nights</span>
            </div>
        </div>
        
        <div class="booking-details">
            <h3>📍 Tour Highlights</h3>
            @if($tour->included_services)
                <ul style="margin: 0; padding-left: 20px;">
                    @foreach($tour->included_services as $service)
                        <li>{{ $service }}</li>
                    @endforeach
                </ul>
            @endif
        </div>
        
        @if($booking->special_requests)
        <div class="booking-details">
            <h3>Special Requests</h3>
            <p>{{ $booking->special_requests }}</p>
        </div>
        @endif
        
        <div style="background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>⚠️ Important:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Payment must be completed within 48 hours to secure your booking</li>
                <li>After successful payment, you'll receive your booking voucher</li>
                <li>Save your booking reference: <strong>{{ $booking->booking_reference }}</strong></li>
            </ul>
        </div>
        
        <p style="margin-top: 30px;">
            <strong>Need Help?</strong><br>
            If you have any questions or need assistance, please contact us at <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a>
        </p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        <p>This email was sent to {{ $booking->contact_email }}</p>
    </div>
</body>
</html>
