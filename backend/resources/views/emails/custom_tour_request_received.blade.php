<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tour Request Received</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .booking-ref {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .booking-ref strong {
            color: #059669;
            font-size: 18px;
        }
        .details-section {
            margin: 25px 0;
        }
        .details-section h3 {
            color: #059669;
            margin-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #6b7280;
        }
        .detail-value {
            color: #111827;
            text-align: right;
        }
        .destinations-list {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
        }
        .destinations-list ul {
            margin: 0;
            padding-left: 20px;
        }
        .destinations-list li {
            padding: 5px 0;
            color: #374151;
        }
        .info-box {
            background: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
        .notes {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✈️ Custom Tour Request Received!</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $booking->user_name }},</p>
            
            <p>Thank you for submitting your custom tour request! We're excited to help you plan your perfect journey.</p>
            
            <div class="booking-ref">
                <strong>Booking Reference:</strong> {{ $booking->booking_reference }}
            </div>
            
            <div class="info-box">
                <strong>📋 What happens next?</strong>
                <p style="margin: 10px 0 0 0;">Our travel experts will review your request and contact you within 24-48 hours with a personalized tour proposal tailored to your preferences.</p>
            </div>
            
            <div class="details-section">
                <h3>📅 Tour Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Number of Travelers:</span>
                    <span class="detail-value">{{ $booking->number_of_persons }} {{ $booking->number_of_persons == 1 ? 'person' : 'people' }}</span>
                </div>
                @if($booking->start_date)
                <div class="detail-row">
                    <span class="detail-label">Start Date:</span>
                    <span class="detail-value">{{ $booking->start_date->format('F j, Y') }}</span>
                </div>
                @endif
                @if($booking->end_date)
                <div class="detail-row">
                    <span class="detail-label">End Date:</span>
                    <span class="detail-value">{{ $booking->end_date->format('F j, Y') }}</span>
                </div>
                @endif
                <div class="detail-row">
                    <span class="detail-label">Your Proposed Budget:</span>
                    <span class="detail-value">DA {{ number_format($booking->proposed_price, 2) }}</span>
                </div>
            </div>
            
            @if($booking->destinations && count($booking->destinations) > 0)
            <div class="details-section">
                <h3>📍 Selected Destinations</h3>
                <div class="destinations-list">
                    <ul>
                        @foreach($booking->destinations as $destination)
                            <li>{{ $destination['name'] ?? 'Destination ' . ($loop->index + 1) }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @endif
            
            @if($booking->hotels && count($booking->hotels) > 0)
            <div class="details-section">
                <h3>🏨 Selected Hotels</h3>
                <div class="destinations-list">
                    <ul>
                        @foreach($booking->hotels as $hotel)
                            <li>{{ $hotel['name'] ?? 'Hotel ' . ($loop->index + 1) }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @endif
            
            @if($booking->notes)
            <div class="notes">
                <strong>📝 Your Notes:</strong>
                <p style="margin: 10px 0 0 0;">{{ $booking->notes }}</p>
            </div>
            @endif
            
            <div style="text-align: center; margin-top: 30px;">
                <p><strong>Need to make changes or have questions?</strong></p>
                <p>Reply to this email or contact us at {{ config('mail.from.address') }}</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated confirmation email. Please save your booking reference for future correspondence.</p>
            <p>&copy; {{ date('Y') }} Eco Travel. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
