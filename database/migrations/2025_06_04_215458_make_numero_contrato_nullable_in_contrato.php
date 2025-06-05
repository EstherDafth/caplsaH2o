<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('contrato', function (Blueprint $table) {
            $table->string('numero_contrato')->nullable()->change();
        });
    }

    public function down()
    {
        Schema::table('contrato', function (Blueprint $table) {
            $table->string('numero_contrato')->nullable(false)->change();
        });
    }

};
