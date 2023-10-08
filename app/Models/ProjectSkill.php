<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectSkill extends Model {
    use HasFactory;

    /**
     * @var array
     */
    protected $guarded = [];

    /**
     * @return array
     */
    public function present(): array {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'image_url' => $this->image_url,
        ];
    }
}
