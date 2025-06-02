<?php

// database/migrations/xxxx_xx_xx_create_facturas_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('facturas', function (Blueprint $table) {
            $table->id();
            $table->string('rfc');
            $table->string('nombre_completo');
            $table->string('calle');
            $table->string('codigo_postal');
            $table->string('ciudad');
            $table->string('numero_exterior')->nullable();
            $table->string('numero_interior')->nullable();
            $table->string('colonia');
            $table->string('email');
            $table->string('email_alternativo')->nullable();
            $table->string('regimen_fiscal');
            $table->text('concepto');
            $table->string('constancia_archivo');
            $table->string('estatus')->default('Pendiente');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('facturas');
    }
};
