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
        Schema::create('tours', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['pre_prepared', 'custom'])->default('pre_prepared');
            $table->string('title');
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('duration_days');
            $table->integer('max_group_size')->nullable();
            $table->enum('difficulty_level', ['easy', 'moderate', 'challenging', 'difficult'])->default('moderate');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_eco_friendly')->default(true);
            $table->json('included_services')->nullable();
            $table->json('excluded_services')->nullable();
            $table->timestamps();
            
            $table->index('difficulty_level');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
