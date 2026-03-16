import { usePage } from '@inertiajs/react';
import Sidebar from './Sidebar';

export default function AppLayout({ children, title }) {
    const { flash } = usePage().props;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {title && (
                    <header className="bg-white border-b border-gray-200 px-8 py-4">
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </header>
                )}

                <main className="flex-1 p-8 overflow-auto">
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
