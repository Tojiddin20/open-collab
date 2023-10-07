<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExternalAuthentication extends Model
{
    use HasFactory, HasUuids;

    /**
     * @var array
     */
    protected $guarded = [];
}
