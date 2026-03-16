import AppLayout from '@/Components/Layout/AppLayout';
import Pagination from '@/Components/UI/Pagination';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ vecinos }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');

    const handleDelete = (id) => {
        if (confirm('¿Eliminar este vecino?')) {
            router.delete(`/vecinos/${id}`);
        }
    };

    return (
        <AppLayout title="Vecinos">
            <Head title="Vecinos" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-gray-500">{vecinos.total} vecino{vecinos.total !== 1 ? 's' : ''} registrado{vecinos.total !== 1 ? 's' : ''}</p>
                {isAdmin && (
                    <Link
                        href="/vecinos/create"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Nuevo vecino
                    </Link>
                )}
            </div>

            {vecinos.data.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <p className="text-gray-400 text-sm">No hay vecinos registrados aún.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nombre</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comuna</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Teléfono</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Etapa</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">N° Parcela</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado Parcela</th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {vecinos.data.map((vecino) => (
                                    <tr key={vecino.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-gray-800">{vecino.nombres_apellidos}</td>
                                        <td className="px-4 py-3 text-gray-600">{vecino.comuna_residencia ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{vecino.telefono ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{vecino.etapa ?? '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{vecino.numero_parcela ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            {vecino.estado_parcela ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                                    {vecino.estado_parcela}
                                                </span>
                                            ) : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 justify-end">
                                                <Link href={`/vecinos/${vecino.id}`} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    Ver
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <Link href={`/vecinos/${vecino.id}/edit`} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                            Editar
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(vecino.id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {vecinos.last_page > 1 && (
                        <div className="px-4 py-3 border-t border-gray-100">
                            <Pagination links={vecinos.links} />
                        </div>
                    )}
                </div>
            )}
        </AppLayout>
    );
}
