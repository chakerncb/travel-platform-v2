<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
            border-left: 4px solid #667eea;
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
            background: #fef3c7;
            color: #92400e;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 14px;
        }
        .highlight {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Booking Received!</h1>
        <p>Thank you for choosing {{ config('app.name') }}</p>
    </div>
    
    <div class="content">
        <h2>Hello {{ $booking->contact_first_name }} {{ $booking->contact_last_name }},</h2>
        
        <p>We have successfully received your booking request. Your booking is currently <span class="status-badge">PENDING APPROVAL</span></p>
        
        <div class="highlight">
            <strong>⏳ What happens next?</strong>
            <p>Our admin team will review your booking and confirm availability. Once approved, you'll receive another email with a payment link to complete your reservation.</p>
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
                <span class="detail-label">Total Price:</span>
                <span class="detail-value"><strong>${{ number_format($booking->total_price, 2) }}</strong></span>
            </div>
        </div>
        
        <div class="booking-details">
            <h3>Contact Information</h3>
            <p><strong>Email:</strong> {{ $booking->contact_email }}</p>
            <p><strong>Phone:</strong> {{ $booking->contact_phone }}</p>
        </div>
        
        @if($booking->special_requests)
        <div class="booking-details">
            <h3>Special Requests</h3>
            <p>{{ $booking->special_requests }}</p>
        </div>
        @endif
        
        <p style="margin-top: 30px;">
            <strong>Need Help?</strong><br>
            If you have any questions, please contact us at <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a>
        </p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        <p>This email was sent to {{ $booking->contact_email }}</p>
    </div>
</body>
</html>
