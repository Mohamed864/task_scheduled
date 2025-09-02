<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class TaskController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $user = $request->user();

        $query = Task::assignedTo($user->id);

        //filter by priority
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        //filter by status
        if ($request->filled('status')) {
            $status = $request->status;
            switch ($status) {
                case 'Done':
                    $query->whereNotNull('completed_at');
                    break;
                case 'Missed/Late':
                    $query->whereNull('completed_at')->where('due_date', '<', now()->toDateString());
                    break;
                case 'Due Today':
                    $query->whereNull('completed_at')->where('due_date', '=', now()->toDateString());
                    break;
                case 'Upcoming':
                    $query->whereNull('completed_at')->where('due_date', '>', now()->toDateString());
                    break;
            }
        }

        //sorting task and pagination
        $sort = $request->get('sort', 'due_date');
        $order = $request->get('order', 'asc');

        $perPage = (int) $request->get('per_page', 20);

        $tasks = $query->orderBy($sort, $order)->paginate($perPage);

        return TaskResource::collection($tasks);
    }

    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();

        $assignee = User::where('email', $data['assignee_email'])->first();
        if (! $assignee) {
            return response()->json(['message' => 'Assignee email not found'], 404);
        }

        $task = Task::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'due_date' => $data['due_date'],
            'priority' => $data['priority'] ?? 'medium',
            'creator_id' => $request->user()->id,
            'assignee_id' => $assignee->id,
        ]);

        return (new TaskResource($task))->response()->setStatusCode(201);
    }

    public function show(Request $request, Task $task)
    {
        $this->authorize('view', $task);

        return new TaskResource($task);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        $task->update($request->validated());

        return new TaskResource($task);
    }

    public function toggleComplete(Request $request, Task $task)
    {
        $this->authorize('complete', $task);

        if ($task->completed_at) {
            $task->completed_at = null;
        } else {
            $task->completed_at = now();
        }

        $task->save();

        return new TaskResource($task);
    }

    //for reassignment of task
    public function reassign(Request $request, Task $task)
    {
        $this->authorize('reassign', $task);

        $request->validate([
            'assignee_email' => ['required', 'email', 'exists:users,email'],
        ], [
            'assignee_email.exists' => 'Assignee email not found',
        ]);

        $assignee = User::where('email', $request->assignee_email)->first();

        $task->assignee_id = $assignee->id;
        $task->save();

        return new TaskResource($task);
    }

    public function destroy(Request $request, Task $task)
    {
        $this->authorize('delete', $task);

        $task->delete();

        return response()->json('Task deleted successfully', 200);
    }
}
