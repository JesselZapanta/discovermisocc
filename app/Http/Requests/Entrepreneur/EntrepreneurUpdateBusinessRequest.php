<?php

namespace App\Http\Requests\Entrepreneur;

use Illuminate\Foundation\Http\FormRequest;

class EntrepreneurUpdateBusinessRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required','string'],
            'email' => ['required','string'],
            'contact' => ['required'],
            'address' => ['required','string'],
            'city' => ['required'],
            'latitude' => ['required','string'],
            'longitude' => ['required','string'],
            'description' => ['required','string'],
            'logo' => ['nullable'],
            'mayor_permit' => ['nullable'],
            'business_permit' => ['nullable'],
            'bir_clearance' => ['nullable'],
        ];
    }
}
