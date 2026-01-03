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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            
            // Booking details
            $table->string('booking_reference')->unique();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('adults_count')->default(1);
            $table->integer('children_count')->default(0);
            $table->decimal('total_price', 10, 2);
            
            // Main contact information
            $table->string('contact_first_name');
            $table->string('contact_last_name');
            $table->string('contact_email');
            $table->string('contact_phone');
            $table->date('contact_date_of_birth')->nullable();
            $table->string('contact_passport_number')->nullable();
            $table->string('contact_nationality')->nullable();
            
            // Additional passengers (stored as JSON)
            $table->json('passengers')->nullable();
            
            // Special requests
            $table->text('special_requests')->nullable();
            
            // Booking status
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'completed'])->default('pending');
            $table->enum('payment_status', ['pending', 'paid', 'refunded'])->default('pending');
            
            // Payment information
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_transaction_id')->nullable();
            $table->timestamp('payment_date')->nullable();
            
            // Cancellation
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('booking_reference');
            $table->index('contact_email');
            $table->index(['tour_id', 'start_date']);
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
