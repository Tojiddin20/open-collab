<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder {
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $now = now()->toDateTimeString();
        $skills = [
            ['name' => 'javascript', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'python', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'go', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'java', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'kotlin', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'php', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'c#', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'swift', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'r', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'ruby', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'c', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'c++', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'matlab', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'typescript', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'scala', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'sql', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'html', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'css', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'nosql', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'rust', 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'perl', 'created_at' => $now, 'updated_at' => $now],
        ];

        Skill::query()->insert($skills);
    }
}
