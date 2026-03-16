<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MinuteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectUpdateController;
use App\Models\Minute;
use App\Models\Project;
use App\Models\ProjectUpdate;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'active_projects' => Project::where('status', 'activo')->count(),
            'total_minutes' => Minute::count(),
            'total_updates' => ProjectUpdate::count(),
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Proyectos
    Route::resource('proyectos', ProjectController::class)->parameters([
        'proyectos' => 'proyecto',
    ]);

    // Minutas
    Route::resource('minutas', MinuteController::class)->parameters([
        'minutas' => 'minuta',
    ]);

    // Avances
    Route::resource('avances', ProjectUpdateController::class)->parameters([
        'avances' => 'avance',
    ]);

    // Admin
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::resource('usuarios', UserController::class)->parameters([
            'usuarios' => 'usuario',
        ]);
    });
});

require __DIR__.'/auth.php';
