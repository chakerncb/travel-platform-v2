<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification - TOURZ</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            text-align: center;
        }
        
        .icon {
            font-size: 80px;
            margin-bottom: 20px;
        }
        
        .success {
            color: #10b981;
        }
        
        .error {
            color: #ef4444;
        }
        
        h1 {
            font-size: 28px;
            margin-bottom: 15px;
            color: #1f2937;
        }
        
        p {
            font-size: 16px;
            color: #6b7280;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 10px;
            font-weight: 600;
            transition: transform 0.2s;
        }
        
        .button:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="container">
        @if($data['status'])
            <div class="icon success">✓</div>
            <h1>Email Verified Successfully!</h1>
            <p>{{ $data['message'] }}</p>
            <p>You can now login to your account using the mobile app.</p>
        @else
            <div class="icon error">✗</div>
            <h1>Verification Failed</h1>
            <p>{{ $data['message'] }}</p>
            <p>Please try again or contact support if the problem persists.</p>
        @endif
        
        <a href="{{ url('/') }}" class="button">Go to Website</a>
    </div>
</body>
</html>
