import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRef } from 'react';

const columns = [
    { name: 'name',     req: true,  desc: 'Nombre completo del usuario.' },
    { name: 'email',    req: true,  desc: 'Correo electrónico. Debe ser único en el sistema.' },
    { name: 'password', req: true,  desc: 'Contraseña inicial. Mínimo 8 caracteres.' },
    { name: 'role',     req: false, desc: 'Rol del usuario: admin o usuario. Si se omite, se asigna usuario.' },
];

export default function Import({ result }) {
    const fileRef = useRef();
    const { data, setData, post, processing, errors, reset } = useForm({ csv: null });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/usuarios/importar', {
            forceFormData: true,
            onSuccess: () => { reset(); if (fileRef.current) fileRef.current.value = ''; },
        });
    };

    return (
        <AppLayout title="Importar Usuarios">
            <Head title="Importar Usuarios" />

            <div className="max-w-2xl space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Carga masiva de usuarios desde CSV</h2>

                    {/* Descripción de columnas */}
                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Formato del archivo</p>
                            <a
                                href="/ejemplos/usuarios.xls"
                                download
                                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Descargar archivo de ejemplo
                            </a>
                        </div>

                        <code className="block bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-xs font-mono text-gray-700 mb-3">
                            name,email,password,role
                        </code>

                        <div className="border border-gray-200 rounded-lg overflow-hidden text-xs">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Columna</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Req.</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-500 uppercase tracking-wider">Descripción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {columns.map(col => (
                                        <tr key={col.name}>
                                            <td className="px-4 py-2 font-mono font-medium text-gray-800">{col.name}</td>
                                            <td className="px-4 py-2">
                                                {col.req
                                                    ? <span className="text-red-600 font-semibold">Sí</span>
                                                    : <span className="text-gray-400">No</span>
                                                }
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">{col.desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seleccionar archivo CSV *</label>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv,.xls,text/csv"
                                onChange={e => setData('csv', e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {errors.csv && <p className="text-red-500 text-xs mt-1">{errors.csv}</p>}
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                            <button
                                type="submit"
                                disabled={processing || !data.csv}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {processing ? 'Procesando...' : 'Importar'}
                            </button>
                            <Link href="/admin/usuarios" className="text-sm text-gray-500 hover:text-gray-700">
                                Cancelar
                            </Link>
                        </div>
                    </form>
                </div>

                {/* Resultados */}
                {result && (
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="text-sm text-green-800 font-medium">
                                {result.created} usuario{result.created !== 1 ? 's' : ''} creado{result.created !== 1 ? 's' : ''} exitosamente.
                            </p>
                        </div>

                        {result.errors.length > 0 && (
                            <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
                                <div className="px-5 py-3 bg-red-50 border-b border-red-200 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm font-semibold text-red-700">
                                        {result.errors.length} error{result.errors.length !== 1 ? 'es' : ''} encontrado{result.errors.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                                <ul className="divide-y divide-red-100 max-h-72 overflow-y-auto">
                                    {result.errors.map((err, i) => (
                                        <li key={i} className="px-5 py-2.5 text-xs text-red-700 font-mono">
                                            {err}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
