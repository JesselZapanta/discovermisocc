<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AdminStoreUserRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required','string','lowercase','email','max:255','unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'integer', Rule::in('1', '0')],
            'status' => ['required', 'integer', Rule::in('1', '0')],
            'type' => ['required', 'integer', Rule::in('1', '0')],
            'birthdate' => ['required'],
            'region' => ['string', 'nullable', 'required_if:type,0'],
            'province' => ['string', 'nullable', 'required_if:type,0'],
            'city' => ['string', 'nullable', 'required_if:type,0'],
            'barangay' => ['string', 'nullable', 'required_if:type,0'],
            'avatar' => ['nullable']
        ];
    }   
    
    /**
     * Get the custom messages for validation errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'The email has already been taken.',
            'region.required_if' => 'The region field is required when the type is Domestic.',
            'province.required_if' => 'The province field is required when the type is Domestic.',
            'city.required_if' => 'The city field is required when the type is Domestic.',
            'barangay.required_if' => 'The barangay field is required when the type is Domestic.',
        ];
    }
}
