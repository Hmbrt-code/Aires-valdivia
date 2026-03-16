<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
        'start_date',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];

    public function minutes(): HasMany
    {
        return $this->hasMany(Minute::class);
    }

    public function projectUpdates(): HasMany
    {
        return $this->hasMany(ProjectUpdate::class);
    }
}
