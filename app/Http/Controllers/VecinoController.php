<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVecinoRequest;
use App\Http\Requests\UpdateVecinoRequest;
use App\Models\Vecino;
use Inertia\Inertia;

class VecinoController extends Controller
{
    public function index()
    {
        $vecinos = Vecino::latest()->paginate(20);

        return Inertia::render('Vecinos/Index', [
            'vecinos' => $vecinos,
        ]);
    }

    public function create()
    {
        return Inertia::render('Vecinos/Create');
    }

    public function store(StoreVecinoRequest $request)
    {
        Vecino::create($request->validated());

        return redirect()->route('vecinos.index')
            ->with('success', 'Vecino registrado exitosamente.');
    }

    public function show(Vecino $vecino)
    {
        return Inertia::render('Vecinos/Show', [
            'vecino' => $vecino,
        ]);
    }

    public function edit(Vecino $vecino)
    {
        return Inertia::render('Vecinos/Edit', [
            'vecino' => $vecino,
        ]);
    }

    public function update(UpdateVecinoRequest $request, Vecino $vecino)
    {
        $vecino->update($request->validated());

        return redirect()->route('vecinos.index')
            ->with('success', 'Vecino actualizado exitosamente.');
    }

    public function destroy(Vecino $vecino)
    {
        $vecino->delete();

        return redirect()->route('vecinos.index')
            ->with('success', 'Vecino eliminado exitosamente.');
    }
}
