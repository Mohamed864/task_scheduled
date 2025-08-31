<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'due_date',
        'priority',
        'creator_id',
        'assignee_id',
        'completed_at',
    ];

    protected $casts = [
        'due_date' => 'date',
        'completed_at'=>'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class,'creator_id');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class,'assignee_id');
    }

    //handle status of task
    public function getStatusAttribute(){
        if($this->completed_at){
            return "Done";
        }

        $today = now()->startOfDay();
        $due = $this->due_date->startOfDay();

        if ($due->lt($today)) {
            return 'Missed/Late';
        }

        if ($due->eq($today)) {
            return 'Due Today';
        }

        return 'Upcoming';
    }

    //get tasks assisgned to user
        public function scopeAssignedTo($query, $userId)
    {
        return $query->where('assignee_id', $userId);
    }


}

