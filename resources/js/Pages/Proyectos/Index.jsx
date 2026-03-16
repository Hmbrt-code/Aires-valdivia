import AppLayout from '@/Components/Layout/AppLayout';
import Pagination from '@/Components/UI/Pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';

const fmtDate = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    return `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;
};

const statusBadge = (status) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
    }`}>
        {status}
    </span>
);

export default function Index({ projects }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este proyecto?')) {
            router.delete(`/proyectos/${id}`);
        }
    };

    return (
        <AppLayout title="Proyectos">
            <Head title="Proyectos" />

            <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-500">{projects.total} proyecto(s)</p>
                {isAdmin && (
                    <Link
                        href="/proyectos/create"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                        + Nuevo proyecto
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Inicio</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Minutas</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Avances</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {projects.data.map(project => (
                            <tr key={project.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <Link href={`/proyectos/${project.id}`} className="text-blue-600 font-medium hover:underline">
                                        {project.name}
                                    </Link>
                                    {project.description && (
                                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{project.description}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4">{statusBadge(project.status)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{fmtDate(project.start_date)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{project.minutes_count}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{project.project_updates_count}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3 text-sm">
                                        <Link href={`/proyectos/${project.id}`} className="text-gray-500 hover:text-gray-700">Ver</Link>
                                        {isAdmin && (
                                            <>
                                                <Link href={`/proyectos/${project.id}/edit`} className="text-blue-500 hover:text-blue-700">Editar</Link>
                                                <button onClick={() => handleDelete(project.id)} className="text-red-500 hover:text-red-700">
                                                    Eliminar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.data.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-400 text-sm">
                                    No hay proyectos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={projects.links} />
        </AppLayout>
    );
}
