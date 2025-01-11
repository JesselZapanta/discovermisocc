<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;

class AdminUpdateFacilatatorRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required','string','lowercase','email','max:255','unique:users,email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'integer', Rule::in('1', '0')],
            'status' => ['required', 'integer', Rule::in('1', '0')],
            'birthdate' => ['required'],
            'city' => ['string', 'nullable', 'required_if:type,0'],
            'barangay' => ['string', 'nullable', 'required_if:type,0'],
            'avatar' => ['nullable']
        ];
    }
}
