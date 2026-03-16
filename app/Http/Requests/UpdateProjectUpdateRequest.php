<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'project_id' => ['required', 'exists:projects,id'],
            'progress' => ['required', 'integer', 'min:0', 'max:100'],
            'description' => ['required', 'string'],
            'date' => ['required', 'date'],
        ];
    }
}
