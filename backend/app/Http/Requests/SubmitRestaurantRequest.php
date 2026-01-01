<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class SubmitRestaurantRequest extends FormRequest
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
            'name'=> 'required|string|max:255|unique:restaurants,name',
            'address'=> 'required|string|max:255',
            'phone'=> 'required|string|max:10|min:10|unique:restaurants,phone',
            'email' => 'required|email|max:255',
            'description'=> 'required|string|max:1000',
            'logo_path' => 'required|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'is_active'=> 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'The restaurant name is required.',
            'name.unique' => 'The restaurant name is Used.',
            'address.required' => 'The restaurant address is required.',
            'phone.max' => 'The phone number must be exactly 10 characters.',
            'phone.min' => 'The phone number must be exactly 10 characters.',
            'phone.required'=> 'The phone number is required.',
            'phone.unique'=> 'The phone number is already in use.',
            'email.required' => 'The email is required.',
            'email.email' => 'The email must be a valid email address.',
            'description.required' => 'The restaurant description is required.',
            'logo_path.required' => 'The restaurant logo is required.',
            'is_active.boolean' => 'The active status must be true or false.',
        ];
    }

    /**
     * Handle a failed validation attempt.
     *
     * @param  \Illuminate\Contracts\Validation\Validator  $validator
     * @return void
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
