import AppLayout from '@/Components/Layout/AppLayout';
import ProgressBar from '@/Components/UI/ProgressBar';
import { Head, Link, useForm } from '@inertiajs/react';

const toDatetimeLocal = (val) => {
    if (!val) return '';
    if (val.includes('T')) return val.slice(0, 16);
    return val + 'T00:00';
};

export default function Edit({ update, projects }) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: update.project_id,
        progress: update.progress,
        description: update.description,
        date: toDatetimeLocal(update.date),
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/avances/${update.id}`);
    };

    return (
        <AppLayout title="Editar Avance">
            <Head title="Editar Avance" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <form onSubmit={submit} className="space-y-5">
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Porcentaje de avance: {data.progress}%
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={data.progress}
                                onChange={e => setData('progress', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="mt-2">
                                <ProgressBar value={data.progress} showLabel={false} />
                            </div>
                            {errors.progress && <p className="text-red-500 text-xs mt-1">{errors.progress}</p>}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={4}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-60 transition-colors"
                            >
                                {processing ? 'Guardando...' : 'Actualizar avance'}
                            </button>
                            <Link href="/avances" className="text-sm text-gray-500 hover:text-gray-700">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
