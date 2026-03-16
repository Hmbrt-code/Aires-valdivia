import AppLayout from '@/Components/Layout/AppLayout';
import ProgressBar from '@/Components/UI/ProgressBar';
import { Head, Link, router, usePage } from '@inertiajs/react';

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

const fmtDate = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    return `${String(d.getUTCDate()).padStart(2, '0')}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${d.getUTCFullYear()}`;
};

export default function Show({ project, latestUpdate }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');
    const handleDeleteMinute = (id) => {
        if (confirm('¿Eliminar esta minuta?')) {
            router.delete(`/minutas/${id}`);
        }
    };

    const handleDeleteUpdate = (id) => {
        if (confirm('¿Eliminar este avance?')) {
            router.delete(`/avances/${id}`);
        }
    };

    return (
        <AppLayout title={project.name}>
            <Head title={project.name} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                        {project.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">Inicio: {fmtDate(project.start_date)}</p>
                </div>
                {isAdmin && (
                    <Link
                        href={`/proyectos/${project.id}/edit`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                    >
                        Editar proyecto
                    </Link>
                )}
            </div>

            {project.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <p className="text-sm text-gray-600">{project.description}</p>
                </div>
            )}

            {latestUpdate && (
                <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Último avance registrado</h3>
                    <ProgressBar value={latestUpdate.progress} />
                    <p className="text-sm text-gray-500 mt-2">{latestUpdate.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{fmt(latestUpdate.date)} — {latestUpdate.user?.name}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Minutas */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">Minutas ({project.minutes?.length ?? 0})</h3>
                        {isAdmin && <Link href={`/minutas/create`} className="text-xs text-blue-600 hover:underline">+ Nueva</Link>}
                    </div>
                    <div className="divide-y divide-gray-100">
                        {project.minutes?.map(m => (
                            <div key={m.id} className="px-5 py-3 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{m.title}</p>
                                    <p className="text-xs text-gray-400">{fmt(m.date)} — {m.user?.name}</p>
                                </div>
                                {isAdmin && (
                                    <div className="flex gap-2 text-xs">
                                        <Link href={`/minutas/${m.id}/edit`} className="text-blue-500 hover:underline">Editar</Link>
                                        <button onClick={() => handleDeleteMinute(m.id)} className="text-red-500 hover:underline">Eliminar</button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {(!project.minutes || project.minutes.length === 0) && (
                            <p className="px-5 py-6 text-sm text-gray-400 text-center">Sin minutas aún.</p>
                        )}
                    </div>
                </div>

                {/* Avances */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-700">Avances ({project.project_updates?.length ?? 0})</h3>
                        {isAdmin && <Link href={`/avances/create`} className="text-xs text-blue-600 hover:underline">+ Nuevo</Link>}
                    </div>
                    <div className="divide-y divide-gray-100">
                        {[...(project.project_updates ?? [])].sort((a, b) => new Date(b.date) - new Date(a.date)).map((u, idx) => (
                            <div key={u.id} className={`px-5 py-3 ${idx > 0 ? 'opacity-40' : ''}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-xs text-gray-400">{fmt(u.date)} — {u.user?.name}</p>
                                    {isAdmin && (
                                        <div className="flex gap-2 text-xs">
                                            <Link href={`/avances/${u.id}/edit`} className="text-blue-500 hover:underline">Editar</Link>
                                            <button onClick={() => handleDeleteUpdate(u.id)} className="text-red-500 hover:underline">Eliminar</button>
                                        </div>
                                    )}
                                </div>
                                <ProgressBar value={u.progress} height="h-2" />
                                <p className="text-xs text-gray-500 mt-1">{u.description}</p>
                            </div>
                        ))}
                        {(!project.project_updates || project.project_updates.length === 0) && (
                            <p className="px-5 py-6 text-sm text-gray-400 text-center">Sin avances aún.</p>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
