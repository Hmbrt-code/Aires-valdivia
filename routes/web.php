<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\MinuteController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectUpdateController;
use App\Http\Controllers\VecinoController;
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

    // Proyectos — escritura primero (create/edit específicos antes que {proyecto})
    Route::resource('proyectos', ProjectController::class)
        ->parameters(['proyectos' => 'proyecto'])
        ->except(['index', 'show'])
        ->middleware('role:admin');
    Route::resource('proyectos', ProjectController::class)
        ->parameters(['proyectos' => 'proyecto'])
        ->only(['index', 'show']);

    // Minutas
    Route::resource('minutas', MinuteController::class)
        ->parameters(['minutas' => 'minuta'])
        ->except(['index', 'show'])
        ->middleware('role:admin');
    Route::resource('minutas', MinuteController::class)
        ->parameters(['minutas' => 'minuta'])
        ->only(['index', 'show']);

    // Avances
    Route::resource('avances', ProjectUpdateController::class)
        ->parameters(['avances' => 'avance'])
        ->except(['index', 'show'])
        ->middleware('role:admin');
    Route::resource('avances', ProjectUpdateController::class)
        ->parameters(['avances' => 'avance'])
        ->only(['index', 'show']);

    // Vecinos
    Route::resource('vecinos', VecinoController::class)
        ->parameters(['vecinos' => 'vecino'])
        ->except(['index', 'show'])
        ->middleware('role:admin');
    Route::resource('vecinos', VecinoController::class)
        ->parameters(['vecinos' => 'vecino'])
        ->only(['index', 'show']);

    // Admin
    Route::prefix('admin')->name('admin.')->middleware('role:admin')->group(function () {
        Route::get('usuarios/importar', [UserController::class, 'importForm'])->name('usuarios.import.form');
        Route::post('usuarios/importar', [UserController::class, 'importCsv'])->name('usuarios.import');
        Route::resource('usuarios', UserController::class)->parameters([
            'usuarios' => 'usuario',
        ]);
    });
});

require __DIR__.'/auth.php';
