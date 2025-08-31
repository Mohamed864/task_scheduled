<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;


class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //any auth user can create a task
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string', 'max:10000'],
            'due_date' => ['required', 'date'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'assignee_email' => ['required', 'email', 'exists:users,email'],
        ];
    }

    //RFC-3339 date format: yyyy-mm-ddThh:mm:ss[.sss]Z|[+-]hh:mm
    public function messages()
    {
        return [
            'assignee_email.exists' => 'Assignee email not found',
            'due_date.date' => 'Invalid date format (use YYYY-MM-DD or RFC-3339).',
        ];
    }
}
