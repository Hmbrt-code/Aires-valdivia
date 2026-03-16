import AppLayout from '@/Components/Layout/AppLayout';
import Pagination from '@/Components/UI/Pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const fmt = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    const yyyy = d.getUTCFullYear();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const min = String(d.getUTCMinutes()).padStart(2, '0');
    return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
};

export default function Index({ minutes, projects, filters }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');
    const [projectId, setProjectId] = useState(filters.project_id ?? '');
    const [date, setDate] = useState(filters.date ?? '');

    const applyFilters = () => {
        router.get('/minutas', { project_id: projectId, date }, { preserveState: true });
    };

    const clearFilters = () => {
        setProjectId('');
        setDate('');
        router.get('/minutas');
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar esta minuta?')) {
            router.delete(`/minutas/${id}`);
        }
    };

    return (
        <AppLayout title="Minutas">
            <Head title="Minutas" />

            {/* Filtros */}
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
                <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Fecha</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                    />
                </div>
                <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700">
                    Filtrar
                </button>
                {(filters.project_id || filters.date) && (
                    <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                        Limpiar
                    </button>
                )}
            </div>

            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-500">{minutes.total} minuta(s)</p>
                {isAdmin && (
                    <Link href="/minutas/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                        + Nueva minuta
                    </Link>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Proyecto</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Autor</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {minutes.data.map(m => (
                            <tr key={m.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-800">
                                    <Link href={`/minutas/${m.id}`} className="text-blue-600 hover:underline">{m.title}</Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{m.project?.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{fmt(m.date)}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{m.user?.name}</td>
                                <td className="px-6 py-4 text-right">
                                    {isAdmin && (
                                        <div className="flex items-center justify-end gap-3 text-sm">
                                            <Link href={`/minutas/${m.id}/edit`} className="text-blue-500 hover:text-blue-700">Editar</Link>
                                            <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {minutes.data.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm">
                                    No se encontraron minutas.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination links={minutes.links} />
        </AppLayout>
    );
}
