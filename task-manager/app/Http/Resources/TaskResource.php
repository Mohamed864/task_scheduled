<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date ? $this->due_date->toDateString() : null,
            'priority' => $this->priority,
            'creator' => [
                'id' => $this->creator->id,
                'email' => $this->creator->email,
            ],
            // assignee is usually the requesting user (but included for completeness)
            'assignee' => [
                'id' => $this->assignee->id,
                'email' => $this->assignee->email,
            ],
            'completed_at' => $this->completed_at ? $this->completed_at->toISOString() : null,
            'status' => $this->status, // from accessor
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
