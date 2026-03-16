<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->paginate(15);

        return Inertia::render('Admin/Usuarios/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::all();

        return Inertia::render('Admin/Usuarios/Create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'active' => $request->boolean('active', true),
        ]);

        $user->assignRole($request->role);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario creado exitosamente.');
    }

    public function edit(User $usuario)
    {
        $roles = Role::all();
        $usuario->load('roles');

        return Inertia::render('Admin/Usuarios/Edit', [
            'user' => $usuario,
            'roles' => $roles,
            'userRole' => $usuario->roles->first()?->name,
        ]);
    }

    public function update(UpdateUserRequest $request, User $usuario)
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
            'active' => $request->boolean('active', true),
        ];

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $usuario->update($data);
        $usuario->syncRoles([$request->role]);

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario actualizado exitosamente.');
    }

    public function destroy(User $usuario)
    {
        $usuario->delete();

        return redirect()->route('admin.usuarios.index')
            ->with('success', 'Usuario eliminado exitosamente.');
    }

    public function importForm()
    {
        return Inertia::render('Admin/Usuarios/Import');
    }

    public function importCsv(\Illuminate\Http\Request $request)
    {
        $request->validate([
            'csv' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $path = $request->file('csv')->getRealPath();
        $handle = fopen($path, 'r');

        $header = fgetcsv($handle); // skip header row
        $validRoles = Role::pluck('name')->toArray();

        $created = 0;
        $errors = [];
        $row = 1;

        while (($line = fgetcsv($handle)) !== false) {
            $row++;

            if (count($line) < 3) {
                $errors[] = "Fila {$row}: columnas insuficientes (se esperan name, email, password[, role]).";
                continue;
            }

            [$name, $email, $password] = $line;
            $role = trim($line[3] ?? 'user');
            $name = trim($name);
            $email = trim($email);
            $password = trim($password);

            $validator = Validator::make(
                ['name' => $name, 'email' => $email, 'password' => $password, 'role' => $role],
                [
                    'name'     => ['required', 'string', 'max:255'],
                    'email'    => ['required', 'email', 'unique:users,email'],
                    'password' => ['required', 'min:8'],
                    'role'     => ['required', 'in:' . implode(',', $validRoles)],
                ]
            );

            if ($validator->fails()) {
                foreach ($validator->errors()->all() as $msg) {
                    $errors[] = "Fila {$row} ({$email}): {$msg}";
                }
                continue;
            }

            $user = User::create([
                'name'     => $name,
                'email'    => $email,
                'password' => Hash::make($password),
                'active'   => true,
            ]);
            $user->assignRole($role);
            $created++;
        }

        fclose($handle);

        return Inertia::render('Admin/Usuarios/Import', [
            'result' => [
                'created' => $created,
                'errors'  => $errors,
            ],
        ]);
    }
}
