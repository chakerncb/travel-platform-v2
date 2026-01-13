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
        Schema::table('custom_tour_bookings', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('user_name');
            $table->date('end_date')->nullable()->after('start_date');
            $table->string('payment_url')->nullable()->after('payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('custom_tour_bookings', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date', 'payment_url']);
        });
    }
};
