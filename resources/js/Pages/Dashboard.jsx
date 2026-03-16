import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, usePage } from '@inertiajs/react';

const FolderIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
);

const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
);

export default function Dashboard({ stats }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');

    const cards = [
        {
            label: 'Proyectos Activos',
            value: stats?.active_projects ?? 0,
            href: '/proyectos',
            icon: <FolderIcon />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            label: 'Total Minutas',
            value: stats?.total_minutes ?? 0,
            href: '/minutas',
            icon: <DocumentIcon />,
            color: 'text-violet-600',
            bg: 'bg-violet-50',
        },
        {
            label: 'Avances Registrados',
            value: stats?.total_updates ?? 0,
            href: '/avances',
            icon: <ChartIcon />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    const quickActions = [
        { label: 'Nuevo proyecto', href: '/proyectos/create' },
        { label: 'Nueva minuta', href: '/minutas/create' },
        { label: 'Registrar avance', href: '/avances/create' },
    ];

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {cards.map(card => (
                    <Link
                        key={card.label}
                        href={card.href}
                        className="group bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                                <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                            </div>
                            <div className={`${card.bg} ${card.color} p-3 rounded-xl`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className={`mt-4 flex items-center gap-1 text-xs font-medium ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                            Ver todos <ArrowIcon />
                        </div>
                    </Link>
                ))}
            </div>

            {isAdmin && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-sm">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Acciones rápidas</h3>
                    <div className="space-y-1">
                        {quickActions.map(action => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            >
                                <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <PlusIcon />
                                </span>
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
