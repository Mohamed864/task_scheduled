<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

use App\Models\Task;
use App\Models\User;

class TaskPermissionsTest extends TestCase
{
   use RefreshDatabase;

   //i want here to test when assignee can view task
    public function test_assignee_can_view_task()
    {
        //create assignee and task with assignee
        $assignee = User::factory()->create();
        $task = Task::factory()->withAssignee($assignee)->create();


        //user login as assignee
        $this->actingAs($assignee, 'sanctum');

        //show task get 200 and task id
        $res = $this->getJson(route('tasks.show', $task->id));
        $res->assertStatus(200)
            ->assertJsonPath('data.id', $task->id);
    }

    //i want here to test when creator cant view task bec he is not assigned
    public function test_creator_cannot_view_unless_assigned()
    {
        //create creator & assignee and task with creator & assignee
        $creator = User::factory()->create();
        $assignee = User::factory()->create();

        $task = Task::factory()->withCreator($creator)->withAssignee($assignee)->create();

        //user login as creator
        $this->actingAs($creator, 'sanctum');

        //show task get 403 and cant show task
        $res = $this->getJson(route('tasks.show', $task->id));
        $res->assertStatus(403);
    }
}
