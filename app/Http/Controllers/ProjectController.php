<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectSkill;
use App\Models\UserSkill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller {
    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        Project::query()->create([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
            'user_id' => $request->get($request->user()->id),
        ]);

        return response()->json(['message' => 'Project successfully created!']);
    }

    /**
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse {
        $request->validate([
            'name' => 'required|string',
            'description' => 'required|string',
        ]);

        Project::query()->update([
            'name' => $request->get('name'),
            'description' => $request->get('description'),
        ]);

        return response()->json(['message' => 'Project successfully updated!']);
    }

    /**
     * @param string $id
     * @return void
     */
    public function delete(string $id): void {
        Project::query()->findOrFail($id)->delete();
    }

    /**
     * @return array
     */
    public function fetch(): array {
        $user = auth()->user();
        $userSkills = UserSkill::query()->where('user_id', $user->id)->first();
        $project = ProjectSkill::query()->where('skill_id', $userSkills->skill_id)->first();
        return $project->present();
    }
}
