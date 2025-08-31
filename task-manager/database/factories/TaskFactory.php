<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $creator = User::factory()->create();
        $assignee = User::factory()->create();

        return [
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->paragraph(),
            'due_date' => $this->faker->dateTimeBetween('-1 week', '+2 weeks')->format('Y-m-d'),
            'priority' => $this->faker->randomElement(['low','medium','high']),
            'creator_id' => $creator->id,
            'assignee_id' => $assignee->id,
            'completed_at' => null,
        ];


    }

    public function withAssignee(User $user)
    {
        //after creating task override assignee_id with user id
        return $this->state(fn (array $attributes) => [
                'assignee_id' => $user->id,
        ]);
    }

    public function withCreator(User $user)
    {
        //after creating task override creator_id with user id
        return $this->state(fn (array $attributes) => [
                'creator_id' => $user->id,
        ]);
    }
}
