import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const fmt = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
};

export default function Show({ minute }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');

    const handleDelete = () => {
        if (confirm('¿Eliminar esta minuta?')) {
            router.delete(`/minutas/${minute.id}`, {
                onSuccess: () => router.visit('/minutas'),
            });
        }
    };

    return (
        <AppLayout title={minute.title}>
            <Head title={minute.title} />

            <div className="max-w-3xl">
                <div className="mb-4 flex items-center justify-between">
                    <Link href="/minutas" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Volver a minutas
                    </Link>
                    {isAdmin && (
                        <div className="flex gap-3 text-sm">
                            <Link href={`/minutas/${minute.id}/edit`} className="text-blue-500 hover:text-blue-700">
                                Editar
                            </Link>
                            <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">{minute.title}</h2>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                            <span>{fmt(minute.date)}</span>
                            <span>Proyecto: <span className="font-medium text-gray-600">{minute.project?.name}</span></span>
                            <span>Autor: <span className="font-medium text-gray-600">{minute.user?.name}</span></span>
                        </div>
                    </div>

                    {minute.content && (
                        <div className="border-t border-gray-100 pt-4">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{minute.content}</p>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
