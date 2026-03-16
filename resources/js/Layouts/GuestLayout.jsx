import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4">
            <div className="mb-6">
                <Link href="/">
                    <img
                        src="/images/logo.png"
                        alt="Aires de Valdivia"
                        className="h-24 w-auto object-contain"
                    />
                </Link>
            </div>

            <div className="w-full overflow-hidden bg-white px-6 py-6 shadow-md rounded-xl sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
