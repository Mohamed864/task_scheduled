<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TaskPolicy
{
    use HandlesAuthorization;

    public function view(User $user, Task $task)
    {
        //only assignee can view the task details
        return $user->id === $task->assignee_id;
    }

    public function update(User $user, Task $task)
    {
        //only assignee may update details
        return $user->id === $task->assignee_id;
    }

    public function complete(User $user, Task $task)
    {
        //only assignee may toggle completion
        return $user->id === $task->assignee_id;
    }

    public function delete(User $user, Task $task)
    {
        //creator or assignee may delete
        return $user->id === $task->creator_id || $user->id === $task->assignee_id;
    }

    public function reassign(User $user, Task $task)
    {
        //only the creator may reassign
        return $user->id === $task->creator_id;
    }
}
