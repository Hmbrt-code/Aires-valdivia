<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVecinoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombres_apellidos'       => ['required', 'string', 'max:255'],
            'comuna_residencia'       => ['nullable', 'string', 'max:255'],
            'telefono'                => ['nullable', 'string', 'max:50'],
            'correo'                  => ['nullable', 'email', 'max:255'],
            'etapa'                   => ['nullable', 'string', 'max:100'],
            'numero_parcela'          => ['nullable', 'string', 'max:50'],
            'como_se_entero'          => ['nullable', 'string', 'max:255'],
            'medio_difusion'          => ['nullable', 'string', 'max:255'],
            'contacto_vendedor_nombre'=> ['nullable', 'string', 'max:255'],
            'medio_contacto_vendedor' => ['nullable', 'string', 'max:255'],
            'fecha_firma_contrato'    => ['nullable', 'date'],
            'valor_terreno'           => ['nullable', 'numeric', 'min:0'],
            'forma_pago'              => ['nullable', 'string', 'max:255'],
            'datos_cuenta_pago'       => ['nullable', 'string'],
            'plazo_pago_entrega'      => ['nullable', 'string'],
            'registro_pagos'          => ['nullable', 'string'],
            'estado_parcela'          => ['nullable', 'string', 'max:100'],
        ];
    }
}
