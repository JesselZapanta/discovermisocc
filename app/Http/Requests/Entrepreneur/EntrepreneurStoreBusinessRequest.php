<?php

namespace App\Http\Requests\Entrepreneur;

use Illuminate\Foundation\Http\FormRequest;

class EntrepreneurStoreBusinessRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'logo' => ['required'],
            'mayor_permit' => ['required'],
            'business_permit' => ['required'],
            'bir_clearance' => ['required'],
        ];
    }
}