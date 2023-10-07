<?php

namespace Database\Seeders;

use App\Constants\ExternalAuthenticationSystems;
use App\Models\ExternalAuthenticationSystem;
use Illuminate\Database\Seeder;

class ExternalAuthenticationSystemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = now()->toDateTimeString();
        $systems = [
            ['name' => ExternalAuthenticationSystems::GOOGLE, 'created_at' => $now, 'updated_at' => $now],
            ['name' => ExternalAuthenticationSystems::FACEBOOK, 'created_at' => $now, 'updated_at' => $now],
            ['name' => ExternalAuthenticationSystems::LINKEDIN, 'created_at' => $now, 'updated_at' => $now],
            ['name' => ExternalAuthenticationSystems::GITHUB, 'created_at' => $now, 'updated_at' => $now],
        ];

        ExternalAuthenticationSystem::query()->insert($systems);
    }
}
