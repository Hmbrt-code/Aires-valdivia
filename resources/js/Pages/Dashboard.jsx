import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats }) {
    const cards = [
        { label: 'Proyectos Activos', value: stats?.active_projects ?? 0, href: '/proyectos', icon: '📁' },
        { label: 'Total Minutas', value: stats?.total_minutes ?? 0, href: '/minutas', icon: '📝' },
        { label: 'Avances Registrados', value: stats?.total_updates ?? 0, href: '/avances', icon: '📊' },
    ];

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {cards.map(card => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                                <p className="text-sm text-gray-500">{card.label}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-sm">
                <h3 className="text-base font-semibold text-gray-700 mb-4">Acciones rápidas</h3>
                <div className="space-y-2">
                    <Link href="/proyectos/create" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        ➕ Nuevo proyecto
                    </Link>
                    <Link href="/minutas/create" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        ➕ Nueva minuta
                    </Link>
                    <Link href="/avances/create" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                        ➕ Registrar avance
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
