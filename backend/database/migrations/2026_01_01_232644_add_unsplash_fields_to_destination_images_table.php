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
        Schema::table('destination_images', function (Blueprint $table) {
            $table->string('photographer_name')->nullable()->after('order');
            $table->string('photographer_url')->nullable()->after('photographer_name');
            $table->string('source_url')->nullable()->after('photographer_url');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('destination_images', function (Blueprint $table) {
            $table->dropColumn(['photographer_name', 'photographer_url', 'source_url']);
        });
    }
};
