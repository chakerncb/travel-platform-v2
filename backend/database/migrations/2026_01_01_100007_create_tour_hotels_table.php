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
        Schema::create('tour_hotels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tour_id')->constrained()->onDelete('cascade');
            $table->foreignId('hotel_id')->constrained()->onDelete('cascade');
            $table->integer('nights')->default(1);
            $table->integer('order')->default(0);
            $table->timestamps();
            
            $table->unique(['tour_id', 'hotel_id']);
            $table->index('tour_id');
            $table->index('hotel_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tour_hotels');
    }
};
