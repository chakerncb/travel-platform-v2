<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{{ $newsletter->subject }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 2px solid #007bff;
        }
        .header h1 {
            color: #007bff;
            margin: 0;
        }
        .content {
            padding: 30px 20px;
            line-height: 1.6;
            color: #333333;
        }
        .footer {
            text-align: center;
            padding: 20px;
            border-top: 1px solid #dddddd;
            margin-top: 30px;
            font-size: 12px;
            color: #888888;
        }
        .unsubscribe {
            margin-top: 20px;
        }
        .unsubscribe a {
            color: #007bff;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>T7wisa Newsletter</h1>
        </div>
        
        <div class="content">
            {!! nl2br(e($newsletter->content)) !!}
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} T7wisa. All rights reserved.</p>
            <div class="unsubscribe">
                <p>Don't want to receive these emails? <a href="{{ $unsubscribeUrl }}">Unsubscribe</a></p>
            </div>
        </div>
    </div>
</body>
</html>
