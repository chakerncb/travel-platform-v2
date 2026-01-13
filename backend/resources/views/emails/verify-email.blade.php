<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - T7wisa</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-message {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .verify-button:hover {
            transform: translateY(-2px);
        }
        .or-text {
            text-align: center;
            margin: 30px 0;
            color: #666;
            font-style: italic;
        }
        .link-box {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 5px;
            padding: 15px;
            word-break: break-all;
            font-size: 14px;
            color: #666;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .security-notice {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
        }
        .expiry-notice {
            color: #dc3545;
            font-size: 14px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">T7wisa</div>
            <h1>Welcome to T7wisa!</h1>
            <p>Please verify your email address to get started</p>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                Hello <strong>{{ $userName }}</strong>,
            </div>
            
            <p>Thank you for registering with T7wisa! We're excited to have you join our community of Travel lovers.</p>
            
            <p>To complete your registration and start exploring New Places, please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center;">
                <a href="{{ $verificationUrl }}" class="verify-button">
                    ✅ Verify My Email Address
                </a>
            </div>
            
            <div class="expiry-notice">
                <strong>⏰ This verification link will expire in 60 minutes.</strong>
            </div>
            
            <div class="or-text">
                Or copy and paste this link into your browser:
            </div>
            
            <div class="link-box">
                {{ $verificationUrl }}
            </div>
            
            <div class="security-notice">
                <strong>🔒 Security Notice:</strong> If you did not create an account with T7wisa, please ignore this email. This verification link is only valid for 1 hour and can only be used once.
            </div>
            <p>If you're having trouble with the verification link, you can request a new one from our app or contact our support team.</p>
            
            <p>Thank you for choosing T7wisa!</p>
            
            <p>Best regards,<br>
            <strong>The T7wisa Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} T7wisa. All rights reserved.</p>
            <p>This email was sent to {{ $user->email }}. If you received this email by mistake, please ignore it.</p>
        </div>
    </div>
</body>
</html>
