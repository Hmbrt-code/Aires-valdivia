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
            'csv' => ['required', 'file', 'mimes:csv,txt,xls,xml', 'max:2048'],
        ]);

        $file = $request->file('csv');
        $path = $file->getRealPath();
        $content = file_get_contents($path);

        $validRoles = Role::pluck('name')->toArray();
        $created = 0;
        $errors = [];
        $rows = [];

        // Detect SpreadsheetML (.xls XML) vs plain CSV
        if (str_contains($content, 'schemas-microsoft-com:office:spreadsheet')) {
            // Parse SpreadsheetML
            libxml_use_internal_errors(true);
            $xml = simplexml_load_string($content);
            if (!$xml) {
                return back()->withErrors(['csv' => 'El archivo XLS no pudo ser leído.']);
            }
            $xml->registerXPathNamespace('ss', 'urn:schemas-microsoft-com:office:spreadsheet');
            $xmlRows = $xml->xpath('//ss:Row');
            foreach ($xmlRows as $i => $xmlRow) {
                if ($i === 0) continue; // skip header
                $cells = $xmlRow->xpath('ss:Cell/ss:Data');
                $rows[] = array_map('strval', $cells);
            }
        } else {
            // Parse CSV — detect separator
            $firstLine = strtok($content, "\n");
            $separator = str_contains($firstLine, ';') ? ';' : ',';
            $handle = fopen($path, 'r');
            fgetcsv($handle, 0, $separator); // skip header
            while (($line = fgetcsv($handle, 0, $separator)) !== false) {
                $rows[] = $line;
            }
            fclose($handle);
        }

        foreach ($rows as $i => $line) {
            $rowNum = $i + 2;
            if (count($line) < 3) {
                $errors[] = "Fila {$rowNum}: columnas insuficientes (se esperan name, email, password[, role]).";
                continue;
            }

            $name     = trim($line[0]);
            $email    = trim($line[1]);
            $password = trim($line[2]);
            $role     = trim($line[3] ?? 'usuario');

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
                    $errors[] = "Fila {$rowNum} ({$email}): {$msg}";
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

        return Inertia::render('Admin/Usuarios/Import', [
            'result' => [
                'created' => $created,
                'errors'  => $errors,
            ],
        ]);
    }
}
