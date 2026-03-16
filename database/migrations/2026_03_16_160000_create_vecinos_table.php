<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vecinos', function (Blueprint $table) {
            $table->id();
            // 1. Datos personales
            $table->string('nombres_apellidos');
            $table->string('comuna_residencia')->nullable();
            $table->string('telefono')->nullable();
            $table->string('correo')->nullable();
            $table->string('etapa')->nullable();
            $table->string('numero_parcela')->nullable();
            // 2. Cómo se enteró del proyecto
            $table->string('como_se_entero')->nullable();
            $table->string('medio_difusion')->nullable();
            // 3. Contacto con vendedor
            $table->string('contacto_vendedor_nombre')->nullable();
            $table->string('medio_contacto_vendedor')->nullable();
            // 4. Contrato y pago
            $table->date('fecha_firma_contrato')->nullable();
            $table->decimal('valor_terreno', 14, 2)->nullable();
            $table->string('forma_pago')->nullable();
            $table->text('datos_cuenta_pago')->nullable();
            // 5. Plazos
            $table->text('plazo_pago_entrega')->nullable();
            // 6. Registro de pagos
            $table->text('registro_pagos')->nullable();
            // Estado de la parcela
            $table->string('estado_parcela')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vecinos');
    }
};
