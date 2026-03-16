import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link } from '@inertiajs/react';

const Row = ({ label, value }) => (
    <div className="py-3 grid grid-cols-3 gap-4">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="text-sm text-gray-800 col-span-2">{value || <span className="text-gray-300">—</span>}</dd>
    </div>
);

const SectionTitle = ({ number, title }) => (
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{number}</span>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
);

export default function Show({ vecino }) {
    const formatCurrency = (val) =>
        val ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val) : null;

    const formatDate = (val) =>
        val ? new Date(val).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' }) : null;

    return (
        <AppLayout title={vecino.nombres_apellidos}>
            <Head title={vecino.nombres_apellidos} />

            <div className="max-w-3xl space-y-5">

                <div className="flex items-center justify-between">
                    {vecino.estado_parcela && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {vecino.estado_parcela}
                        </span>
                    )}
                    <div className="flex items-center gap-3 ml-auto">
                        <Link href={`/vecinos/${vecino.id}/edit`} className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                            Editar
                        </Link>
                        <Link href="/vecinos" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            Volver al listado
                        </Link>
                    </div>
                </div>

                {/* Sección 1 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="1" title="Datos personales" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Nombres y Apellidos" value={vecino.nombres_apellidos} />
                        <Row label="Comuna de Residencia" value={vecino.comuna_residencia} />
                        <Row label="Teléfono de contacto" value={vecino.telefono} />
                        <Row label="Correo electrónico" value={vecino.correo} />
                        <Row label="Etapa" value={vecino.etapa} />
                        <Row label="N° de Parcela" value={vecino.numero_parcela} />
                    </dl>
                </div>

                {/* Sección 2 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="2" title="¿Cómo se enteró del proyecto?" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Cómo se enteró" value={vecino.como_se_entero} />
                        <Row label="Medio (web / red social)" value={vecino.medio_difusion} />
                    </dl>
                </div>

                {/* Sección 3 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="3" title="Contacto con el/la vendedor/a" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Nombre del vendedor/a" value={vecino.contacto_vendedor_nombre} />
                        <Row label="Medio de contacto" value={vecino.medio_contacto_vendedor} />
                    </dl>
                </div>

                {/* Sección 4 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="4" title="Contrato y pago" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Fecha de firma" value={formatDate(vecino.fecha_firma_contrato)} />
                        <Row label="Valor del terreno" value={formatCurrency(vecino.valor_terreno)} />
                        <Row label="Forma de pago" value={vecino.forma_pago} />
                        <Row label="Datos de la cuenta" value={vecino.datos_cuenta_pago} />
                    </dl>
                </div>

                {/* Sección 5 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="5" title="Plazos pactados" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Plazo de pago y entrega" value={vecino.plazo_pago_entrega} />
                    </dl>
                </div>

                {/* Sección 6 */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <SectionTitle number="6" title="Registro de pagos" />
                    <dl className="px-6 divide-y divide-gray-100">
                        <Row label="Registro de pagos" value={vecino.registro_pagos} />
                    </dl>
                </div>

            </div>
        </AppLayout>
    );
}
