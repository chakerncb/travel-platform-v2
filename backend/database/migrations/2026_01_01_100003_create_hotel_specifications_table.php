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
        Schema::create('hotel_specifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->boolean('has_wifi')->default(false);
            $table->boolean('has_parking')->default(false);
            $table->boolean('has_pool')->default(false);
            $table->boolean('has_gym')->default(false);
            $table->boolean('has_spa')->default(false);
            $table->boolean('has_restaurant')->default(false);
            $table->boolean('has_bar')->default(false);
            $table->boolean('has_room_service')->default(false);
            $table->boolean('has_airport_shuttle')->default(false);
            $table->boolean('has_pet_friendly')->default(false);
            $table->boolean('has_air_conditioning')->default(false);
            $table->boolean('has_laundry')->default(false);
            $table->boolean('has_conference_room')->default(false);
            $table->string('check_in_time')->nullable();
            $table->string('check_out_time')->nullable();
            $table->integer('total_rooms')->nullable();
            $table->timestamps();
            
            $table->index('hotel_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hotel_specifications');
    }
};
