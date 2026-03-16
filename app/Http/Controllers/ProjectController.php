<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::withCount(['minutes', 'projectUpdates'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Proyectos/Index', [
            'projects' => $projects,
        ]);
    }

    public function create()
    {
        return Inertia::render('Proyectos/Create');
    }

    public function store(StoreProjectRequest $request)
    {
        Project::create($request->validated());

        return redirect()->route('proyectos.index')
            ->with('success', 'Proyecto creado exitosamente.');
    }

    public function show(Project $proyecto)
    {
        $proyecto->load([
            'minutes.user',
            'projectUpdates.user',
        ]);

        $latestUpdate = $proyecto->projectUpdates()->latest('date')->first();

        return Inertia::render('Proyectos/Show', [
            'project' => $proyecto,
            'latestUpdate' => $latestUpdate,
        ]);
    }

    public function edit(Project $proyecto)
    {
        return Inertia::render('Proyectos/Edit', [
            'project' => $proyecto,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $proyecto)
    {
        $proyecto->update($request->validated());

        return redirect()->route('proyectos.index')
            ->with('success', 'Proyecto actualizado exitosamente.');
    }

    public function destroy(Project $proyecto)
    {
        $proyecto->delete();

        return redirect()->route('proyectos.index')
            ->with('success', 'Proyecto eliminado exitosamente.');
    }
}
