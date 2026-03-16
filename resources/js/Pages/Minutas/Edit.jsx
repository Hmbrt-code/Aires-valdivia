import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const toDatetimeLocal = (val) => {
    if (!val) return '';
    if (val.includes('T')) return val.slice(0, 16);
    return val + 'T00:00';
};

export default function Edit({ minute, projects }) {
    const { data, setData, put, processing, errors } = useForm({
        title: minute.title,
        content: minute.content,
        date: toDatetimeLocal(minute.date),
        project_id: minute.project_id,
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/minutas/${minute.id}`);
    };

    return (
        <AppLayout title="Editar Minuta">
            <Head title="Editar Minuta" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto *</label>
                            <select
                                value={data.project_id}
                                onChange={e => setData('project_id', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Seleccionar proyecto...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y hora *</label>
                            <input
                                type="datetime-local"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
                            <textarea
                                value={data.content}
                                onChange={e => setData('content', e.target.value)}
                                rows={8}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                            />
                            {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
                            >
                                {processing ? 'Guardando...' : 'Actualizar minuta'}
                            </button>
                            <Link href="/minutas" className="text-sm text-gray-500 hover:text-gray-700">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
