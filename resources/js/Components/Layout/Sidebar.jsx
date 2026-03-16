import { Link, usePage } from '@inertiajs/react';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { label: 'Proyectos', href: '/proyectos', icon: '📁' },
    { label: 'Minutas', href: '/minutas', icon: '📝' },
    { label: 'Avances', href: '/avances', icon: '📊' },
];

export default function Sidebar() {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.roles?.some(r => r.name === 'admin');
    const currentPath = window.location.pathname;

    return (
        <aside className="w-64 h-screen sticky top-0 bg-gray-900 text-white flex flex-col">
            <div className="p-6 border-b border-gray-700">
                <h1 className="text-lg font-bold leading-tight">Gestión de Proyectos</h1>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                            currentPath.startsWith(item.href) && item.href !== '/dashboard'
                                ? 'bg-blue-600 text-white'
                                : currentPath === item.href
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}

                {isAdmin && (
                    <div className="pt-4">
                        <p className="px-4 py-1 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            Administración
                        </p>
                        <Link
                            href="/admin/usuarios"
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors mt-1 ${
                                currentPath.startsWith('/admin/usuarios')
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <span>👥</span>
                            Usuarios
                        </Link>
                    </div>
                )}
            </nav>

            <div className="p-4 border-t border-gray-700">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                        {auth?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{auth?.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{auth?.user?.email}</p>
                    </div>
                </div>
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="mt-2 w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                    Cerrar sesión
                </Link>
            </div>
        </aside>
    );
}
