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
        Schema::create('tour_flights', function (Blueprint $table) {
            $table->id();
            $table->foreignId('custom_tour_booking_id')->constrained('custom_tour_bookings')->onDelete('cascade');
            $table->integer('segment_index');
            $table->string('flight_offer_id');
            
            // Origin airport details
            $table->string('origin_airport_code');
            $table->string('origin_airport_name');
            $table->string('origin_city');
            $table->string('origin_country')->nullable();
            $table->decimal('origin_latitude', 10, 7)->nullable();
            $table->decimal('origin_longitude', 10, 7)->nullable();
            
            // Destination airport details
            $table->string('destination_airport_code');
            $table->string('destination_airport_name');
            $table->string('destination_city');
            $table->string('destination_country')->nullable();
            $table->decimal('destination_latitude', 10, 7)->nullable();
            $table->decimal('destination_longitude', 10, 7)->nullable();
            
            // Flight details
            $table->dateTime('departure_datetime');
            $table->dateTime('arrival_datetime');
            $table->string('duration')->nullable();
            $table->integer('number_of_stops')->default(0);
            
            // Airline and aircraft info
            $table->string('airline_code')->nullable();
            $table->string('airline_name')->nullable();
            $table->string('aircraft_code')->nullable();
            $table->string('flight_number')->nullable();
            
            // Pricing
            $table->decimal('price_amount', 10, 2);
            $table->string('price_currency', 3)->default('DZD');
            
            // Additional data stored as JSON
            $table->json('itineraries')->nullable();
            $table->json('traveler_pricings')->nullable();
            $table->json('fare_details')->nullable();
            
            $table->timestamps();
            
            $table->index(['custom_tour_booking_id', 'segment_index']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_flights');
    }
};
