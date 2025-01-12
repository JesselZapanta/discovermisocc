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
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users')->ignore($this->route('id'))
            ],
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'role' => ['required', 'integer', Rule::in('0', '2')],
            'status' => ['required', 'integer', Rule::in('1', '0')],
            'sex' => ['required', 'string', Rule::in('Male', 'Female')],
            'birthdate' => ['required', 'date'],
            'city' => ['string', 'nullable', 'required_if:type,0'],
            'barangay' => ['string', 'nullable', 'required_if:type,0'],
            'avatar' => ['nullable'],
        ];
    }
}
