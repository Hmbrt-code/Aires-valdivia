<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'create-minuta',
            'edit-minuta',
            'delete-minuta',
            'create-avance',
            'edit-avance',
            'delete-avance',
            'manage-users',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $admin = Role::firstOrCreate(['name' => 'admin']);
        $admin->syncPermissions($permissions);

        $usuario = Role::firstOrCreate(['name' => 'usuario']);
        $usuario->syncPermissions([
            'create-minuta',
            'edit-minuta',
            'create-avance',
            'edit-avance',
        ]);
    }
}
