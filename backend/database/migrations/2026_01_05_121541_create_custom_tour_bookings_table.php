<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('custom_tour_bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_reference')->unique();
            $table->string('user_email');
            $table->string('user_name');
            $table->integer('number_of_persons');
            $table->decimal('proposed_price', 10, 2);
            $table->decimal('minimum_price', 10, 2);
            $table->decimal('estimated_hotel_cost', 10, 2)->default(0);
            $table->decimal('admin_price', 10, 2)->nullable();
            $table->decimal('final_price', 10, 2)->nullable();
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            
            // Status: pending, under_review, admin_proposed, user_confirmed, rejected, paid, completed
            $table->string('status')->default('pending');
            
            // Selected destinations and hotels (JSON)
            $table->json('destinations');
            $table->json('hotels')->nullable();
            
            // Admin recommendations (JSON)
            $table->json('admin_recommended_destinations')->nullable();
            $table->json('admin_recommended_hotels')->nullable();
            
            // Payment info
            $table->string('payment_status')->default('unpaid');
            $table->string('payment_method')->nullable();
            $table->timestamp('paid_at')->nullable();
            
            // Timestamps
            $table->timestamp('admin_reviewed_at')->nullable();
            $table->timestamp('user_confirmed_at')->nullable();
            $table->timestamps();
            
            $table->index('user_email');
            $table->index('status');
            $table->index('booking_reference');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('custom_tour_bookings');
    }
};
