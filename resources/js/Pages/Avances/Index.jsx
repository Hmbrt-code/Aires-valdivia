import AppLayout from '@/Components/Layout/AppLayout';
import Pagination from '@/Components/UI/Pagination';
import ProgressBar from '@/Components/UI/ProgressBar';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ updates, projects, filters }) {
    const [projectId, setProjectId] = useState(filters.project_id ?? '');

    const applyFilters = () => {
        router.get('/avances', { project_id: projectId }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        router.get('/avances');
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este avance?')) {
            router.delete(`/avances/${id}`);
        }
    };

    return (
        <AppLayout title="Avances de Proyectos">
            <Head title="Avances" />

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-3 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Proyecto</label>
                    <select
                        value={projectId}
                        onChange={e => setProjectId(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    >
                        <option value="">Todos</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                    Filtrar
                </button>
                {filters.project_id && (
                    <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">Limpiar</button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">{updates.total} avance(s)</p>
                <Link href="/avances/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    + Registrar avance
                </Link>
            </div>

            <div className="space-y-4">
                {updates.data.map(u => (
                    <div key={u.id} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <Link href={`/proyectos/${u.project_id}`} className="font-medium text-blue-600 hover:underline text-sm">
                                    {u.project?.name}
                                </Link>
                                <p className="text-xs text-gray-400 mt-0.5">{u.date} — {u.user?.name}</p>
                            </div>
                            <div className="flex gap-3 text-sm">
                                <Link href={`/avances/${u.id}/edit`} className="text-blue-500 hover:text-blue-700">Editar</Link>
                                <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                            </div>
                        </div>
                        <ProgressBar value={u.progress} />
                        <p className="text-sm text-gray-600 mt-2">{u.description}</p>
                    </div>
                ))}
                {updates.data.length === 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 px-6 py-12 text-center text-gray-400 text-sm">
                        No se encontraron avances.
                    </div>
                )}
            </div>

            <Pagination links={updates.links} />
        </AppLayout>
    );
}
