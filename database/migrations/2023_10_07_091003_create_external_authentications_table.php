<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('external_authentications', static function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('system_id')->references('id')->on('external_authentication_systems')->cascadeOnDelete();
            $table->string('authentication_id')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('external_authentications');
    }
};
