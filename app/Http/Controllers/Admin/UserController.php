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

        $path = tempnam(sys_get_temp_dir(), 'xlsx_');

        $zip = new \ZipArchive();
        $zip->open($path, \ZipArchive::OVERWRITE);

        $zip->addFromString('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
</Types>');

        $zip->addFromString('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>');

        $zip->addFromString('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
</Relationships>');

        $zip->addFromString('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/sheet" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Usuarios" sheetId="1" r:id="rId1"/></sheets>
</workbook>');

        $sheetRows = '';
        foreach ($rows as $ri => $row) {
            $rowNum = $ri + 1;
            $cells = '';
            foreach ($row as $ci => $value) {
                $col = chr(65 + $ci);
                $escaped = htmlspecialchars((string) $value, ENT_XML1, 'UTF-8');
                $cells .= "<c r=\"{$col}{$rowNum}\" t=\"inlineStr\"><is><t>{$escaped}</t></is></c>";
            }
            $sheetRows .= "<row r=\"{$rowNum}\">{$cells}</row>";
        }

        $zip->addFromString('xl/worksheets/sheet1.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/sheet">
  <sheetData>' . $sheetRows . '</sheetData>
</worksheet>');

        $zip->close();

        return response()->download($path, 'plantilla_usuarios.xlsx', [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend();
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
