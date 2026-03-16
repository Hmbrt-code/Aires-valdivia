<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMinuteRequest;
use App\Http\Requests\UpdateMinuteRequest;
use App\Models\Minute;
use App\Models\Project;
use Inertia\Inertia;

class MinuteController extends Controller
{
    public function index()
    {
        $minutes = Minute::with(['project', 'user'])
            ->when(request('project_id'), fn($q) => $q->where('project_id', request('project_id')))
            ->when(request('date'), fn($q) => $q->whereDate('date', request('date')))
            ->latest('date')
            ->paginate(15)
            ->withQueryString();

        $projects = Project::select('id', 'name')->get();

        return Inertia::render('Minutas/Index', [
            'minutes' => $minutes,
            'projects' => $projects,
            'filters' => request()->only(['project_id', 'date']),
        ]);
    }

    public function create()
    {
        $projects = Project::where('status', 'activo')->select('id', 'name')->get();

        return Inertia::render('Minutas/Create', [
            'projects' => $projects,
        ]);
    }

    public function store(StoreMinuteRequest $request)
    {
        Minute::create(array_merge($request->validated(), ['user_id' => auth()->id()]));

        return redirect()->route('minutas.index')
            ->with('success', 'Minuta creada exitosamente.');
    }

    public function edit(Minute $minuta)
    {
        $projects = Project::where('status', 'activo')->select('id', 'name')->get();

        return Inertia::render('Minutas/Edit', [
            'minute' => $minuta->load(['project', 'user']),
            'projects' => $projects,
        ]);
    }

    public function update(UpdateMinuteRequest $request, Minute $minuta)
    {
        $minuta->update($request->validated());

        return redirect()->route('minutas.index')
            ->with('success', 'Minuta actualizada exitosamente.');
    }

    public function destroy(Minute $minuta)
    {
        $minuta->delete();

        return redirect()->route('minutas.index')
            ->with('success', 'Minuta eliminada exitosamente.');
    }
}
