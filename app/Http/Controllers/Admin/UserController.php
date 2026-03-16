<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
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

    public function downloadTemplate()
    {
        $html = '
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8"></head>
<body>
<table>
<tr>
  <th>nombre</th>
  <th>email</th>
  <th>contraseña</th>
  <th>rol</th>
</tr>
<tr>
  <td>Juan Pérez</td>
  <td>juan@ejemplo.cl</td>
  <td>password123</td>
  <td>vecino</td>
</tr>
<tr>
  <td>María López</td>
  <td>maria@ejemplo.cl</td>
  <td>password456</td>
  <td>admin</td>
</tr>
</table>
</body></html>';

        return response($html, 200, [
            'Content-Type'        => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="plantilla_usuarios.xls"',
            'Cache-Control'       => 'no-cache',
        ]);
    }

    public function importForm()
    {
        return Inertia::render('Admin/Usuarios/Import');
    }

    public function importCsv(Request $request)
    {
        $request->validate([
            'archivo' => ['required', 'file', 'mimes:csv,txt', 'max:2048'],
        ]);

        $path = $request->file('archivo')->getRealPath();

        // Detect separator (semicolon for Spanish Excel, comma otherwise)
        $firstLine = file($path, FILE_IGNORE_NEW_LINES)[0] ?? '';
        $separator = str_contains($firstLine, ';') ? ';' : ',';

        $handle = fopen($path, 'r');

        // Skip header row
        fgetcsv($handle, 0, $separator);

        $created = 0;
        $errors = [];
        $row = 1;

        while (($data = fgetcsv($handle, 0, $separator)) !== false) {
            $row++;
            if (count($data) < 4) {
                $errors[] = "Fila {$row}: faltan columnas (se esperan 4: nombre, email, contraseña, rol).";
                continue;
            }

            [$nombre, $email, $password, $rol] = array_map('trim', $data);

            $validator = Validator::make(
                ['nombre' => $nombre, 'email' => $email, 'password' => $password, 'rol' => $rol],
                [
                    'nombre'   => ['required', 'string', 'max:255'],
                    'email'    => ['required', 'email', 'unique:users,email'],
                    'password' => ['required', 'string', 'min:8'],
                    'rol'      => ['required', 'in:admin,vecino'],
                ]
            );

            if ($validator->fails()) {
                $errors[] = "Fila {$row} ({$email}): " . implode(' ', $validator->errors()->all());
                continue;
            }

            $user = User::create([
                'name'     => $nombre,
                'email'    => $email,
                'password' => Hash::make($password),
                'active'   => true,
            ]);
            $user->assignRole($rol);
            $created++;
        }

        fclose($handle);

        $message = "{$created} usuario(s) importado(s) correctamente.";
        if ($errors) {
            $message .= ' ' . count($errors) . ' fila(s) con errores.';
        }

        return redirect()->route('admin.usuarios.import.form')
            ->with('success', $message)
            ->with('import_errors', $errors);
    }
}
