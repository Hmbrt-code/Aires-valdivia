import AppLayout from '@/Components/Layout/AppLayout';
import Pagination from '@/Components/UI/Pagination';
import { Head, Link, router } from '@inertiajs/react';

const RoleBadge = ({ user }) => {
    if (!user.roles?.[0]) return null;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.roles[0].name === 'admin'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-blue-100 text-blue-800'
        }`}>
            {user.roles[0].name}
        </span>
    );
};

const StatusBadge = ({ active }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
        {active ? 'Activo' : 'Inactivo'}
    </span>
);

export default function Index({ users }) {
    const handleDelete = (id) => {
        if (confirm('¿Eliminar este usuario? Esta acción no se puede deshacer.')) {
            router.delete(`/admin/usuarios/${id}`);
        }
    };

    return (
        <AppLayout title="Gestión de Usuarios">
            <Head title="Usuarios" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{users.total} usuario(s)</p>
                <div className="flex gap-2 sm:gap-3">
                    <Link
                        href="/admin/usuarios/importar"
                        className="border border-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                        Importar CSV
                    </Link>
                    <Link
                        href="/admin/usuarios/create"
                        className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                        + Nuevo
                    </Link>
                </div>
            </div>

            {/* Cards móvil */}
            <div className="block md:hidden space-y-3">
                {users.data.map(user => (
                    <div key={user.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                            <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                            <div className="flex gap-1.5 shrink-0 ml-2">
                                <RoleBadge user={user} />
                                <StatusBadge active={user.active} />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{user.email}</p>
                        <div className="flex items-center gap-3 text-sm border-t border-gray-100 pt-3">
                            <Link href={`/admin/usuarios/${user.id}/edit`} className="text-blue-500 hover:text-blue-700">
                                Editar
                            </Link>
                            <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
                {users.data.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center text-gray-400 text-sm">
                        No hay usuarios registrados.
                    </div>
                )}
            </div>

            {/* Tabla escritorio */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {users.data.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                <td className="px-6 py-4"><RoleBadge user={user} /></td>
                                <td className="px-6 py-4"><StatusBadge active={user.active} /></td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 text-sm">
                                        <Link href={`/admin/usuarios/${user.id}/edit`} className="text-blue-500 hover:text-blue-700">
                                            Editar
                                        </Link>
                                        <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:text-red-700">
                                            Eliminar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {users.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                    No hay usuarios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={users.links} />
        </AppLayout>
    );
}
