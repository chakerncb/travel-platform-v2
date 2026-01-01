<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Welcome to Our Platform</title>
    <style>
        /* Inline styles for simplicity, consider using CSS classes for larger templates */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f1f1f1;
        }

        .logo {
            text-align: center;
            margin-bottom: 20px;
        }

        .logo img {
            max-width: 200px;
        }

        .message {
            padding: 20px;
            background-color: #ffffff;
        }

        .message p {
            margin-bottom: 10px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="container">
        
        <div class="message">
            <p>Dear {{ $mailData['name'] }},</p>
            <p>Thank you accout are created successfully.</p>
            <p>Your account details are as follows:</p>
            <p><strong>Email:</strong> {{ $mailData['email'] }} |
            @if (!$mailData['confirmed'])
               <b style="color: red;" >please confirm your account before login</b> 
            @endif
            </p>
            <p><strong>Password:</strong> 
                <span style="background-color: #f4f4f4; border: 1px solid #ddd; padding: 5px 10px; border-radius: 4px; font-family: monospace;">{{ $mailData['password'] }}</span>
            </p>
            <p>Please log in to your account and change your password for security purposes.</p>
            <p>Thank you for joining us!</p>
        </div>
        
    </div>
</body>

</html>