<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
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
            'tour_id' => 'required|exists:tours,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'adults_count' => 'required|integer|min:1|max:20',
            'children_count' => 'required|integer|min:0|max:20',
            'total_price' => 'required|numeric|min:0',
            
            // Main contact information
            'main_contact' => 'required|array',
            'main_contact.firstName' => 'required|string|max:255',
            'main_contact.lastName' => 'required|string|max:255',
            'main_contact.email' => 'required|email|max:255',
            'main_contact.phone' => 'required|string|max:20',
            'main_contact.dateOfBirth' => 'nullable|date|before:today',
            'main_contact.passportNumber' => 'nullable|string|max:50',
            'main_contact.nationality' => 'nullable|string|max:100',
            
            // Additional passengers
            'passengers' => 'nullable|array',
            'passengers.*.firstName' => 'nullable|string|max:255',
            'passengers.*.lastName' => 'nullable|string|max:255',
            'passengers.*.email' => 'nullable|email|max:255',
            'passengers.*.phone' => 'nullable|string|max:20',
            'passengers.*.dateOfBirth' => 'nullable|date|before:today',
            'passengers.*.passportNumber' => 'nullable|string|max:50',
            'passengers.*.nationality' => 'nullable|string|max:100',
            
            // Special requests
            'special_requests' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'tour_id.required' => 'Tour selection is required.',
            'tour_id.exists' => 'The selected tour does not exist.',
            'adults_count.required' => 'Number of adults is required.',
            'adults_count.min' => 'At least one adult is required.',
            'main_contact.firstName.required' => 'Contact first name is required.',
            'main_contact.lastName.required' => 'Contact last name is required.',
            'main_contact.email.required' => 'Contact email is required.',
            'main_contact.email.email' => 'Please provide a valid email address.',
            'main_contact.phone.required' => 'Contact phone number is required.',
        ];
    }
}
