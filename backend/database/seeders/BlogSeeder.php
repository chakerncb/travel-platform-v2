<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BlogCategory;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Adventure', 'slug' => 'adventure'],
            ['name' => 'Culture', 'slug' => 'culture'],
            ['name' => 'Food & Dining', 'slug' => 'food-dining'],
            ['name' => 'Travel Tips', 'slug' => 'travel-tips'],
            ['name' => 'Destinations', 'slug' => 'destinations'],
        ];

        foreach ($categories as $category) {
            BlogCategory::firstOrCreate(['slug' => $category['slug']], $category);
        }

        // Get first user as author (or create one)
        $author = User::first();
        if (!$author) {
            $author = User::create([
                'name' => 'Travel Writer',
                'email' => 'writer@t7wisa.com',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
            ]);
        }

        // Sample blog posts
        $blogs = [
            [
                'title' => 'Exploring the Sahara: A Journey Through Time',
                'slug' => 'exploring-sahara-journey-through-time',
                'excerpt' => 'Discover the majestic beauty of the Sahara Desert and experience an unforgettable adventure through golden dunes and ancient oases.',
                'content' => '<h2>Welcome to the Sahara</h2><p>The Sahara Desert is one of the most awe-inspiring places on Earth. Spanning across North Africa, this vast expanse of golden sand dunes offers travelers a unique opportunity to disconnect from modern life and connect with nature.</p><h3>What to Expect</h3><p>Your journey will take you through breathtaking landscapes, from towering sand dunes to ancient rock formations. You\'ll experience stunning sunrises and sunsets that paint the sky in vibrant hues of orange, pink, and purple.</p><h3>Best Time to Visit</h3><p>The ideal time to explore the Sahara is during the cooler months from October to April. During this period, daytime temperatures are more manageable, making your desert adventure more comfortable.</p>',
                'category_id' => 1, // Adventure
                'featured_image' => '/assets/imgs/page/blog/news.png',
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'views' => 245,
                'reading_time' => 5,
            ],
            [
                'title' => 'Algerian Cuisine: A Culinary Adventure',
                'slug' => 'algerian-cuisine-culinary-adventure',
                'excerpt' => 'From couscous to tajine, explore the rich flavors and diverse dishes that make Algerian cuisine a gastronomic delight.',
                'content' => '<h2>The Heart of North African Cuisine</h2><p>Algerian cuisine is a beautiful blend of Mediterranean, Middle Eastern, and Berber influences. Each dish tells a story of the country\'s rich history and cultural diversity.</p><h3>Must-Try Dishes</h3><p>Couscous is undoubtedly the national dish, traditionally served on Fridays. The fluffy semolina grains are paired with tender meat, vegetables, and a flavorful broth. Other must-try dishes include tajine, chakhchoukha, and the sweet pastry makroud.</p><h3>Street Food Culture</h3><p>Don\'t miss the vibrant street food scene. Try bourek, a crispy pastry filled with meat or cheese, or mahjouba, a delicious flatbread stuffed with tomatoes and onions.</p>',
                'category_id' => 3, // Food & Dining
                'featured_image' => '/assets/imgs/page/blog/news.png',
                'status' => 'published',
                'published_at' => now()->subDays(10),
                'views' => 189,
                'reading_time' => 6,
            ],
            [
                'title' => 'Hidden Gems: Unexplored Destinations in Algeria',
                'slug' => 'hidden-gems-unexplored-destinations-algeria',
                'excerpt' => 'Venture off the beaten path and discover Algeria\'s secret treasures that few travelers know about.',
                'content' => '<h2>Beyond the Tourist Trail</h2><p>While Algeria boasts famous destinations like the Casbah of Algiers and Timgad, there are countless hidden gems waiting to be discovered by adventurous travelers.</p><h3>Tassili n\'Ajjer</h3><p>This stunning plateau in the Sahara is home to one of the most important prehistoric rock art sites in the world. The landscape is otherworldly, with rock formations that seem to defy gravity.</p><h3>Tipaza</h3><p>This coastal town offers a perfect blend of history and natural beauty. Explore the ancient Roman ruins overlooking the Mediterranean Sea, then relax on pristine beaches.</p><h3>The M\'Zab Valley</h3><p>A UNESCO World Heritage site, the M\'Zab Valley showcases unique fortified cities built by the Berber Ibadi community. The architecture is fascinating and unlike anything else you\'ll see.</p>',
                'category_id' => 5, // Destinations
                'featured_image' => '/assets/imgs/page/blog/news.png',
                'status' => 'published',
                'published_at' => now()->subDays(3),
                'views' => 312,
                'reading_time' => 7,
            ],
            [
                'title' => '10 Essential Tips for First-Time Travelers to North Africa',
                'slug' => 'essential-tips-first-time-travelers-north-africa',
                'excerpt' => 'Planning your first trip to North Africa? Here are essential tips to help you make the most of your adventure.',
                'content' => '<h2>Prepare for an Unforgettable Journey</h2><p>North Africa is a region of incredible diversity, rich history, and warm hospitality. Here are ten essential tips to ensure your trip is smooth and memorable.</p><h3>1. Learn Basic Arabic Phrases</h3><p>While French is widely spoken in Algeria, learning a few Arabic phrases will endear you to locals and enhance your experience.</p><h3>2. Dress Respectfully</h3><p>North African countries are predominantly Muslim. Dressing modestly shows respect for local customs and helps you blend in.</p><h3>3. Stay Hydrated</h3><p>The climate can be hot and dry. Always carry water with you, especially when exploring cities or the desert.</p><h3>4. Try Local Transportation</h3><p>Using local buses and shared taxis is an authentic way to travel and interact with locals.</p><h3>5. Be Open to Mint Tea</h3><p>Sharing mint tea is a sign of hospitality. Accept graciously and enjoy this sweet tradition.</p>',
                'category_id' => 4, // Travel Tips
                'featured_image' => '/assets/imgs/page/blog/news.png',
                'status' => 'published',
                'published_at' => now()->subDays(7),
                'views' => 428,
                'reading_time' => 8,
            ],
        ];

        foreach ($blogs as $blogData) {
            $blogData['author_id'] = $author->id;
            Blog::firstOrCreate(['slug' => $blogData['slug']], $blogData);
        }

        $this->command->info('Blog posts seeded successfully!');
    }
}
