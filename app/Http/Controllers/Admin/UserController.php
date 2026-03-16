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
        $rows = [
            ['nombre', 'email', 'contraseña', 'rol'],
            ['Juan Pérez', 'juan@ejemplo.cl', 'password123', 'vecino'],
            ['María López', 'maria@ejemplo.cl', 'password456', 'admin'],
        ];

        $xmlRows = '';
        foreach ($rows as $row) {
            $cells = '';
            foreach ($row as $value) {
                $escaped = htmlspecialchars((string) $value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
                $cells .= "<Cell><Data ss:Type=\"String\">{$escaped}</Data></Cell>";
            }
            $xmlRows .= "<Row>{$cells}</Row>\n";
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
          xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Usuarios">
    <Table>
' . $xmlRows . '    </Table>
  </Worksheet>
</Workbook>';

        return response($xml, 200, [
            'Content-Type'        => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="plantilla_usuarios.xls"',
            'Cache-Control'       => 'no-cache, no-store, must-revalidate',
            'Pragma'              => 'no-cache',
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
