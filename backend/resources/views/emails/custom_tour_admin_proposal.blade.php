<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Tour Proposal</title>
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
        .price-box {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #10b981;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        .price-box .label {
            color: #059669;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        .price-box .amount {
            color: #047857;
            font-size: 36px;
            font-weight: bold;
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
            color: white !important;
            padding: 14px 35px;
            text-decoration: none;
            border-radius: 8px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);
        }
        .notes {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 4px;
        }
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Your Custom Tour Proposal is Ready!</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $booking->user_name }},</p>
            
            <p>Great news! Our travel experts have crafted a personalized tour proposal just for you.</p>
            
            <div class="booking-ref">
                <strong>Booking Reference:</strong> {{ $booking->booking_reference }}
            </div>
            
            <div class="price-box">
                <div class="label">💰 Final Tour Price</div>
                <div class="amount">DA {{ number_format($booking->final_price, 2) }}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">
                    For {{ $booking->number_of_persons }} {{ $booking->number_of_persons == 1 ? 'person' : 'people' }}
                </p>
            </div>
            
            @if($booking->admin_notes)
            <div class="info-box">
                <strong>📝 Message from Your Travel Expert:</strong>
                <p style="margin: 10px 0 0 0;">{{ $booking->admin_notes }}</p>
            </div>
            @endif
            
            <div class="details-section">
                <h3>📅 Tour Details</h3>
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
                    <span class="detail-label">Number of Travelers:</span>
                    <span class="detail-value">{{ $booking->number_of_persons }} {{ $booking->number_of_persons == 1 ? 'person' : 'people' }}</span>
                </div>
            </div>
            
            @if($booking->admin_recommended_destinations && count($booking->admin_recommended_destinations) > 0)
            <div class="details-section">
                <h3>📍 Recommended Destinations</h3>
                <div class="destinations-list">
                    <ul>
                        @foreach($booking->admin_recommended_destinations as $destination)
                            <li>{{ is_array($destination) ? $destination['name'] : $destination }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @endif
            
            @if($booking->admin_recommended_hotels && count($booking->admin_recommended_hotels) > 0)
            <div class="details-section">
                <h3>🏨 Recommended Hotels</h3>
                <div class="destinations-list">
                    <ul>
                        @foreach($booking->admin_recommended_hotels as $hotel)
                            <li>{{ is_array($hotel) ? $hotel['name'] : $hotel }}</li>
                        @endforeach
                    </ul>
                </div>
            </div>
            @endif
            
            @if($booking->payment_url)
            <div class="button-container">
                <a href="{{ $booking->payment_url }}" class="button">
                    💳 Proceed to Payment
                </a>
                <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                    Secure payment powered by Chargily
                </p>
            </div>
            @endif
            
            <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f9fafb; border-radius: 8px;">
                <p><strong>Have questions about this proposal?</strong></p>
                <p style="color: #6b7280;">Reply to this email or call us to discuss the details with your travel expert.</p>
                <p style="color: #6b7280; margin-top: 10px;">Email: {{ config('mail.from.address') }}</p>
            </div>
        </div>
        
        <div class="footer">
            <p>This proposal is valid for 7 days. Please confirm your booking to secure your tour.</p>
            <p>&copy; {{ date('Y') }} Eco Travel. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
