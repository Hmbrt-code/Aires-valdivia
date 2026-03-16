<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vecino extends Model
{
    protected $fillable = [
        'nombres_apellidos',
        'comuna_residencia',
        'telefono',
        'correo',
        'etapa',
        'numero_parcela',
        'como_se_entero',
        'medio_difusion',
        'contacto_vendedor_nombre',
        'medio_contacto_vendedor',
        'fecha_firma_contrato',
        'valor_terreno',
        'forma_pago',
        'datos_cuenta_pago',
        'plazo_pago_entrega',
        'registro_pagos',
        'estado_parcela',
    ];

    protected $casts = [
        'fecha_firma_contrato' => 'date',
        'valor_terreno' => 'decimal:2',
    ];
}
