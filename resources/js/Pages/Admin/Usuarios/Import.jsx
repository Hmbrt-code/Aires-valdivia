import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Import() {
    const { flash } = usePage().props;
    const importErrors = usePage().props.import_errors ?? [];
    const [preview, setPreview] = useState([]);

    const { data, setData, post, processing, errors } = useForm({
        archivo: null,
    });

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setData('archivo', file);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const lines = ev.target.result.split('\n').filter(Boolean);
            setPreview(lines.slice(0, 6)); // header + first 5 rows
        };
        reader.readAsText(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/usuarios/importar', { forceFormData: true });
    };

    const downloadTemplate = () => {
        const csv = 'nombre,email,contraseña,rol\nJuan Pérez,juan@ejemplo.cl,password123,vecino\n';
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'plantilla_usuarios.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AppLayout title="Importar Usuarios">
            <Head title="Importar Usuarios" />

            <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/admin/usuarios" className="text-sm text-gray-500 hover:text-gray-700">
                        ← Volver a usuarios
                    </Link>
                </div>

                {flash?.success && (
                    <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
                        {flash.success}
                    </div>
                )}

                {importErrors.length > 0 && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
                        <p className="text-sm font-medium text-yellow-800 mb-2">Filas con errores:</p>
                        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
                            {importErrors.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    </div>
                )}

                {/* Formato esperado */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800 mb-1">Formato del archivo CSV</h3>
                            <p className="text-xs text-gray-500">Una fila por usuario. La primera fila debe ser el encabezado.</p>
                        </div>
                        <button
                            onClick={downloadTemplate}
                            className="text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded-lg px-3 py-1.5 hover:bg-blue-50 transition-colors"
                        >
                            Descargar plantilla
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-xs border border-gray-200 rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gray-50">
                                    {['nombre', 'email', 'contraseña', 'rol'].map(col => (
                                        <th key={col} className="px-4 py-2 text-left font-semibold text-gray-600 border-b border-gray-200 uppercase tracking-wider">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="text-gray-500 italic">
                                    <td className="px-4 py-2 border-b border-gray-100">Juan Pérez</td>
                                    <td className="px-4 py-2 border-b border-gray-100">juan@ejemplo.cl</td>
                                    <td className="px-4 py-2 border-b border-gray-100">password123</td>
                                    <td className="px-4 py-2 border-b border-gray-100">vecino</td>
                                </tr>
                                <tr className="text-gray-500 italic">
                                    <td className="px-4 py-2">María López</td>
                                    <td className="px-4 py-2">maria@ejemplo.cl</td>
                                    <td className="px-4 py-2">password456</td>
                                    <td className="px-4 py-2">admin</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Valores válidos para <strong>rol</strong>: <code className="bg-gray-100 px-1 rounded">vecino</code> o <code className="bg-gray-100 px-1 rounded">admin</code>. La contraseña debe tener al menos 8 caracteres.
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Seleccionar archivo</h3>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg px-6 py-8 text-center hover:border-blue-400 transition-colors">
                        <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFile}
                            className="hidden"
                            id="csv-input"
                        />
                        <label htmlFor="csv-input" className="cursor-pointer">
                            <div className="text-3xl mb-2">📂</div>
                            <p className="text-sm font-medium text-gray-700">
                                {data.archivo ? data.archivo.name : 'Haz clic para seleccionar un archivo CSV'}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">CSV o TXT, máximo 2 MB</p>
                        </label>
                    </div>
                    {errors.archivo && <p className="mt-1 text-xs text-red-600">{errors.archivo}</p>}

                    {/* Vista previa */}
                    {preview.length > 0 && (
                        <div className="mt-4">
                            <p className="text-xs font-medium text-gray-600 mb-2">Vista previa:</p>
                            <div className="overflow-x-auto rounded-lg border border-gray-200">
                                <table className="min-w-full text-xs">
                                    <tbody>
                                        {preview.map((line, i) => {
                                            const cols = line.split(',');
                                            return (
                                                <tr key={i} className={i === 0 ? 'bg-gray-50 font-semibold' : 'border-t border-gray-100'}>
                                                    {cols.map((col, j) => (
                                                        <td key={j} className="px-3 py-1.5 text-gray-700">{col}</td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={!data.archivo || processing}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Importando...' : 'Importar usuarios'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
