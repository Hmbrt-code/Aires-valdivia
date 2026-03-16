import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';

const HamburgerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export default function AppLayout({ children, title }) {
    const { flash } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Topbar móvil */}
                <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Abrir menú"
                    >
                        <HamburgerIcon />
                    </button>
                    {title && <h2 className="text-lg font-semibold text-gray-800 truncate">{title}</h2>}
                </header>

                {/* Header escritorio */}
                {title && (
                    <header className="hidden md:block bg-white border-b border-gray-200 px-8 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </header>
                )}

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {flash?.success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-lg px-4 py-3 text-sm">
                            {flash.error}
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}
