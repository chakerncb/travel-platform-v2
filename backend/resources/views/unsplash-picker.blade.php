<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Unsplash Image Picker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f8f9fa;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .header {
            margin-bottom: 30px;
        }

        h1 {
            font-size: 28px;
            color: #333;
            margin-bottom: 10px;
        }

        .search-box {
            display: flex;
            gap: 10px;
            margin-bottom: 30px;
        }

        #searchInput {
            flex: 1;
            padding: 12px 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.3s;
        }

        #searchInput:focus {
            outline: none;
            border-color: #4CAF50;
        }

        #searchBtn {
            padding: 12px 24px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: background 0.3s;
        }

        #searchBtn:hover {
            background: #45a049;
        }

        #searchBtn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .loading {
            text-align: center;
            padding: 40px;
            color: #666;
        }

        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #4CAF50;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .photo-card {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            background: #f5f5f5;
        }

        .photo-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .photo-card img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            display: block;
        }

        .photo-info {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 15px;
            color: white;
        }

        .photographer {
            font-size: 14px;
            font-weight: 500;
        }

        .photographer a {
            color: white;
            text-decoration: none;
        }

        .photographer a:hover {
            text-decoration: underline;
        }

        .select-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .photo-card:hover .select-btn {
            opacity: 1;
        }

        .pagination {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-top: 30px;
        }

        .pagination button {
            padding: 10px 20px;
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .pagination button:hover:not(:disabled) {
            background: #4CAF50;
            color: white;
            border-color: #4CAF50;
        }

        .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .pagination .current-page {
            padding: 10px 20px;
            color: #666;
        }

        .error {
            background: #ffebee;
            color: #c62828;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .success {
            background: #e8f5e9;
            color: #2e7d32;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .attribution {
            margin-top: 30px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 8px;
            font-size: 14px;
            color: #666;
            text-align: center;
        }

        .attribution a {
            color: #4CAF50;
            text-decoration: none;
        }

        .attribution a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🖼️ Unsplash Image Picker</h1>
            <p style="color: #666; margin-top: 10px;">Search and select high-quality images for your destination</p>
        </div>

        <div class="search-box">
            <input 
                type="text" 
                id="searchInput" 
                placeholder="Search for images (e.g., 'beach paradise', 'mountain sunset')" 
                value="travel destination"
            >
            <button id="searchBtn">Search</button>
        </div>

        <div id="messageArea"></div>
        <div id="loadingArea"></div>
        <div id="gallery" class="gallery"></div>
        <div id="pagination" class="pagination"></div>

        <div class="attribution">
            Photos provided by <a href="https://unsplash.com" target="_blank">Unsplash</a>
        </div>
    </div>

    <script>
        let currentPage = 1;
        let totalPages = 1;
        let currentQuery = 'travel destination';
        const destinationId = new URLSearchParams(window.location.search).get('destination_id');

        // Setup CSRF token for all AJAX requests
        const csrfToken = document.querySelector('meta[name="csrf-token"]').content;

        function showMessage(message, type = 'success') {
            const messageArea = document.getElementById('messageArea');
            messageArea.innerHTML = `<div class="${type}">${message}</div>`;
            setTimeout(() => {
                messageArea.innerHTML = '';
            }, 3000);
        }

        function showLoading(show = true) {
            const loadingArea = document.getElementById('loadingArea');
            if (show) {
                loadingArea.innerHTML = `
                    <div class="loading">
                        <div class="spinner"></div>
                        <p>Searching Unsplash...</p>
                    </div>
                `;
            } else {
                loadingArea.innerHTML = '';
            }
        }

        async function searchPhotos(query, page = 1) {
            showLoading(true);
            document.getElementById('searchBtn').disabled = true;

            try {
                const response = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}&page=${page}`, {
                    headers: {
                        'X-CSRF-TOKEN': csrfToken
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }

                const data = await response.json();
                currentPage = page;
                totalPages = data.total_pages;
                displayPhotos(data.results);
                displayPagination();
            } catch (error) {
                showMessage('Error loading images: ' + error.message, 'error');
                console.error('Error:', error);
            } finally {
                showLoading(false);
                document.getElementById('searchBtn').disabled = false;
            }
        }

        function displayPhotos(photos) {
            const gallery = document.getElementById('gallery');
            
            if (photos.length === 0) {
                gallery.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">No images found. Try a different search term.</p>';
                return;
            }

            gallery.innerHTML = photos.map(photo => `
                <div class="photo-card">
                    <img src="${photo.urls.small}" alt="${photo.alt_description || 'Photo'}">
                    <div class="photo-info">
                        <div class="photographer">
                            Photo by <a href="${photo.user.links.html}?utm_source=eco-travel-app&utm_medium=referral" target="_blank">${photo.user.name}</a>
                        </div>
                    </div>
                    <button class="select-btn" onclick="selectPhoto('${photo.id}', '${photo.urls.regular}', '${photo.user.name}', '${photo.user.username}', '${photo.links.html}')">
                        Select
                    </button>
                </div>
            `).join('');
        }

        function displayPagination() {
            const pagination = document.getElementById('pagination');
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            pagination.innerHTML = `
                <button onclick="searchPhotos(currentQuery, currentPage - 1)" ${currentPage === 1 ? 'disabled' : ''}>
                    ← Previous
                </button>
                <span class="current-page">Page ${currentPage} of ${totalPages}</span>
                <button onclick="searchPhotos(currentQuery, currentPage + 1)" ${currentPage === totalPages ? 'disabled' : ''}>
                    Next →
                </button>
            `;
        }

        async function selectPhoto(photoId, downloadUrl, photographerName, photographerUsername, unsplashUrl) {
            if (!destinationId) {
                showMessage('No destination ID provided', 'error');
                return;
            }

            try {
                const response = await fetch('/api/unsplash/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    },
                    body: JSON.stringify({
                        destination_id: destinationId,
                        photo_id: photoId,
                        download_url: downloadUrl,
                        photographer_name: photographerName,
                        photographer_username: photographerUsername,
                        unsplash_url: unsplashUrl,
                        is_primary: false
                    })
                });

                const data = await response.json();

                if (data.success) {
                    showMessage('✅ Image added successfully!', 'success');
                    // Optionally close the window after a delay
                    setTimeout(() => {
                        window.close();
                    }, 1500);
                } else {
                    showMessage('Failed to save image: ' + data.message, 'error');
                }
            } catch (error) {
                showMessage('Error saving image: ' + error.message, 'error');
                console.error('Error:', error);
            }
        }

        // Event listeners
        document.getElementById('searchBtn').addEventListener('click', () => {
            const query = document.getElementById('searchInput').value.trim();
            if (query) {
                currentQuery = query;
                searchPhotos(query, 1);
            }
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    currentQuery = query;
                    searchPhotos(query, 1);
                }
            }
        });

        // Initial search
        searchPhotos(currentQuery);
    </script>
</body>
</html>
