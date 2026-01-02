@php
    $destinationId = $getDestinationId();
@endphp

<x-dynamic-component
    :component="$getFieldWrapperView()"
    :field="$field"
>
    <div x-data="{
        showPicker: false,
        searchQuery: 'travel destination',
        photos: [],
        currentPage: 1,
        totalPages: 1,
        isLoading: false,
        destinationId: {{ $destinationId ?? 'null' }},
        
        togglePicker() {
            if (!this.destinationId) {
                $wire.call('$parent.notifyWarning', 'Please save the destination first');
                return;
            }
            this.showPicker = !this.showPicker;
            if (this.showPicker && this.photos.length === 0) {
                this.search();
            }
        },
        
        async search() {
            if (!this.searchQuery) return;
            
            this.isLoading = true;
            this.currentPage = 1;
            await this.loadPhotos();
        },
        
        async loadPage(page) {
            this.currentPage = page;
            await this.loadPhotos();
        },
        
        async loadPhotos() {
            this.isLoading = true;
            
            try {
                const response = await fetch(`/api/unsplash/search?query=${encodeURIComponent(this.searchQuery)}&page=${this.currentPage}`);
                const data = await response.json();
                
                this.photos = data.results || [];
                this.totalPages = data.total_pages || 1;
            } catch (error) {
                console.error('Error loading photos:', error);
            } finally {
                this.isLoading = false;
            }
        },
        
        async selectPhoto(photoData) {
            try {
                const response = await fetch('/api/unsplash/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]').content
                    },
                    body: JSON.stringify({
                        destination_id: this.destinationId,
                        photo_id: photoData.id,
                        download_url: photoData.download_url,
                        photographer_name: photoData.photographer_name,
                        photographer_username: photoData.photographer_username,
                        unsplash_url: photoData.unsplash_url,
                        is_primary: false
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    new FilamentNotification()
                        .title('Image added successfully!')
                        .success()
                        .send();
                        
                    // Reload the page to show new images
                    setTimeout(() => window.location.reload(), 1000);
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                new FilamentNotification()
                    .title('Error saving image')
                    .body(error.message)
                    .danger()
                    .send();
            }
        }
    }" class="space-y-4">
        
        <!-- Toggle Button -->
        <div class="flex items-center justify-between">
            <button 
                type="button"
                @click="togglePicker"
                class="inline-flex items-center gap-2 px-4 py-2 bg-success-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-success-700 focus:bg-success-700 active:bg-success-900 focus:outline-none focus:ring-2 focus:ring-success-500 focus:ring-offset-2 transition ease-in-out duration-150"
            >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span x-text="showPicker ? 'Hide Unsplash Picker' : 'Add from Unsplash'"></span>
            </button>
        </div>

        <!-- Unsplash Picker Panel -->
        <div x-show="showPicker" 
             x-transition
             class="border border-gray-200 rounded-lg p-6 bg-white dark:bg-gray-800 dark:border-gray-700">
            
            <!-- Search Box -->
            <div class="mb-6">
                <div class="flex gap-3">
                    <input 
                        type="text" 
                        x-model="searchQuery"
                        @keydown.enter="search"
                        placeholder="Search for images (e.g., 'beach paradise', 'mountain sunset')"
                        class="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    >
                    <button 
                        type="button"
                        @click="search"
                        :disabled="isLoading"
                        class="inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-primary-700 focus:bg-primary-700 active:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition ease-in-out duration-150 disabled:opacity-50"
                    >
                        <span x-show="!isLoading">Search</span>
                        <span x-show="isLoading">Searching...</span>
                    </button>
                </div>
            </div>

            <!-- Loading State -->
            <div x-show="isLoading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p class="mt-4 text-gray-600 dark:text-gray-400">Searching Unsplash...</p>
            </div>

            <!-- Photos Grid -->
            <div x-show="!isLoading">
                <div x-show="photos.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                    <template x-for="photo in photos" :key="photo.id">
                        <div class="relative group rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900 aspect-video">
                            <img 
                                :src="photo.urls.small" 
                                :alt="photo.alt_description || 'Photo'"
                                class="w-full h-full object-cover"
                            >
                            
                            <!-- Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <div class="absolute bottom-0 left-0 right-0 p-3">
                                    <p class="text-white text-xs mb-2">
                                        Photo by 
                                        <a :href="`${photo.user.links.html}?utm_source=eco-travel-app&utm_medium=referral`" 
                                           target="_blank" 
                                           class="underline hover:text-primary-300"
                                           x-text="photo.user.name">
                                        </a>
                                    </p>
                                    <button 
                                        type="button"
                                        @click="selectPhoto({
                                            id: photo.id,
                                            download_url: photo.urls.regular,
                                            photographer_name: photo.user.name,
                                            photographer_username: photo.user.username,
                                            unsplash_url: photo.links.html
                                        })"
                                        class="w-full px-3 py-2 bg-success-600 text-white text-xs font-semibold rounded hover:bg-success-700 transition-colors"
                                    >
                                        Select Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>

                <!-- Pagination -->
                <div x-show="totalPages > 1" class="flex items-center justify-center gap-3">
                    <button 
                        type="button"
                        @click="loadPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        ← Previous
                    </button>
                    
                    <span class="text-sm text-gray-600 dark:text-gray-400">
                        Page <span x-text="currentPage"></span> of <span x-text="totalPages"></span>
                    </span>
                    
                    <button 
                        type="button"
                        @click="loadPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Next →
                    </button>
                </div>

                <!-- No Results -->
                <div x-show="photos.length === 0 && searchQuery" class="text-center py-12">
                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <p class="mt-4 text-gray-600 dark:text-gray-400">No images found. Try a different search term.</p>
                </div>
            </div>

            <!-- Attribution -->
            <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                <p class="text-xs text-gray-500 dark:text-gray-400">
                    Photos provided by 
                    <a href="https://unsplash.com?utm_source=eco-travel-app&utm_medium=referral" 
                       target="_blank" 
                       class="text-primary-600 hover:text-primary-700 underline">
                        Unsplash
                    </a>
                </p>
            </div>
        </div>
    </div>
</x-dynamic-component>
