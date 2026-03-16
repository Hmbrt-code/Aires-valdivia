<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectUpdate extends Model
{
    protected $fillable = [
        'project_id',
        'progress',
        'description',
        'date',
        'user_id',
    ];

    protected $casts = [
        'date' => 'datetime',
        'progress' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
