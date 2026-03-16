<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectUpdateRequest;
use App\Http\Requests\UpdateProjectUpdateRequest;
use App\Models\Project;
use App\Models\ProjectUpdate;
use Inertia\Inertia;

class ProjectUpdateController extends Controller
{
    public function index()
    {
        $updates = ProjectUpdate::with(['project', 'user'])
            ->when(request('project_id'), fn($q) => $q->where('project_id', request('project_id')))
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        $projects = Project::select('id', 'name')->get();

        return Inertia::render('Avances/Index', [
            'updates' => $updates,
            'projects' => $projects,
            'filters' => request()->only(['project_id']),
        ]);
    }

    public function create()
    {
        $projects = Project::where('status', 'activo')->select('id', 'name')->get();

        return Inertia::render('Avances/Create', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreProjectUpdateRequest $request)
    {
        ProjectUpdate::create(array_merge($request->validated(), ['user_id' => auth()->id()]));

        return redirect()->route('avances.index')
            ->with('success', 'Avance registrado exitosamente.');
    }

    public function edit(ProjectUpdate $avance)
    {
        $projects = Project::where('status', 'activo')->select('id', 'name')->get();

        return Inertia::render('Avances/Edit', [
            'update' => $avance->load(['project', 'user']),
            'projects' => $projects,
        ]);
    }

    public function update(UpdateProjectUpdateRequest $request, ProjectUpdate $avance)
    {
        $avance->update($request->validated());

        return redirect()->route('avances.index')
            ->with('success', 'Avance actualizado exitosamente.');
    }

    public function destroy(ProjectUpdate $avance)
    {
        $avance->delete();

        return redirect()->route('avances.index')
            ->with('success', 'Avance eliminado exitosamente.');
    }
}
