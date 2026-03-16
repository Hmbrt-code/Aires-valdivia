import AppLayout from '@/Components/Layout/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

const Field = ({ label, error, children, hint }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
        {children}
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
);

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
const textareaClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none';

const SectionTitle = ({ number, title }) => (
    <div className="flex items-center gap-3 mb-4">
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{number}</span>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    </div>
);

export default function Edit({ vecino }) {
    const { data, setData, put, processing, errors } = useForm({
        nombres_apellidos: vecino.nombres_apellidos ?? '',
        comuna_residencia: vecino.comuna_residencia ?? '',
        telefono: vecino.telefono ?? '',
        correo: vecino.correo ?? '',
        etapa: vecino.etapa ?? '',
        numero_parcela: vecino.numero_parcela ?? '',
        como_se_entero: vecino.como_se_entero ?? '',
        medio_difusion: vecino.medio_difusion ?? '',
        contacto_vendedor_nombre: vecino.contacto_vendedor_nombre ?? '',
        medio_contacto_vendedor: vecino.medio_contacto_vendedor ?? '',
        fecha_firma_contrato: vecino.fecha_firma_contrato ?? '',
        valor_terreno: vecino.valor_terreno ?? '',
        forma_pago: vecino.forma_pago ?? '',
        datos_cuenta_pago: vecino.datos_cuenta_pago ?? '',
        plazo_pago_entrega: vecino.plazo_pago_entrega ?? '',
        registro_pagos: vecino.registro_pagos ?? '',
        estado_parcela: vecino.estado_parcela ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/vecinos/${vecino.id}`);
    };

    return (
        <AppLayout title="Editar Vecino">
            <Head title="Editar Vecino" />

            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6">

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="1" title="Datos personales" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <Field label="Nombres y Apellidos" error={errors.nombres_apellidos}>
                                    <input type="text" value={data.nombres_apellidos} onChange={e => setData('nombres_apellidos', e.target.value)} className={inputClass} />
                                </Field>
                            </div>
                            <Field label="Comuna de Residencia" error={errors.comuna_residencia}>
                                <input type="text" value={data.comuna_residencia} onChange={e => setData('comuna_residencia', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Teléfono de contacto" error={errors.telefono}>
                                <input type="text" value={data.telefono} onChange={e => setData('telefono', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Correo electrónico" error={errors.correo}>
                                <input type="email" value={data.correo} onChange={e => setData('correo', e.target.value)} className={inputClass} />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Etapa" error={errors.etapa}>
                                    <input type="text" value={data.etapa} onChange={e => setData('etapa', e.target.value)} className={inputClass} />
                                </Field>
                                <Field label="N° de Parcela" error={errors.numero_parcela}>
                                    <input type="text" value={data.numero_parcela} onChange={e => setData('numero_parcela', e.target.value)} className={inputClass} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="2" title="¿Cómo se enteró del proyecto?" />
                        <div className="space-y-4">
                            <Field label="Medio por el que se enteró" error={errors.como_se_entero}>
                                <input type="text" value={data.como_se_entero} onChange={e => setData('como_se_entero', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Indicar medio (si corresponde)" hint="Página web o Red Social" error={errors.medio_difusion}>
                                <input type="text" value={data.medio_difusion} onChange={e => setData('medio_difusion', e.target.value)} className={inputClass} />
                            </Field>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="3" title="Contacto con el/la vendedor/a" />
                        <div className="space-y-4">
                            <Field label="Nombre del vendedor/a con quien se contactó" error={errors.contacto_vendedor_nombre}>
                                <input type="text" value={data.contacto_vendedor_nombre} onChange={e => setData('contacto_vendedor_nombre', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Medio por el que se contactó" error={errors.medio_contacto_vendedor}>
                                <input type="text" value={data.medio_contacto_vendedor} onChange={e => setData('medio_contacto_vendedor', e.target.value)} className={inputClass} />
                            </Field>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="4" title="Contrato y pago" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field label="Fecha de firma del contrato o promesa" error={errors.fecha_firma_contrato}>
                                <input type="date" value={data.fecha_firma_contrato} onChange={e => setData('fecha_firma_contrato', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Valor del terreno" error={errors.valor_terreno}>
                                <input type="number" min="0" step="0.01" value={data.valor_terreno} onChange={e => setData('valor_terreno', e.target.value)} className={inputClass} />
                            </Field>
                            <Field label="Cómo se realizó el pago" error={errors.forma_pago}>
                                <input type="text" value={data.forma_pago} onChange={e => setData('forma_pago', e.target.value)} className={inputClass} />
                            </Field>
                            <div className="md:col-span-2">
                                <Field label="Datos de la cuenta a la que se realizó el pago" error={errors.datos_cuenta_pago}>
                                    <textarea value={data.datos_cuenta_pago} onChange={e => setData('datos_cuenta_pago', e.target.value)} rows={3} className={textareaClass} />
                                </Field>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="5" title="Plazos pactados" />
                        <Field label="Plazo para el pago y fecha de entrega del terreno" error={errors.plazo_pago_entrega}>
                            <textarea value={data.plazo_pago_entrega} onChange={e => setData('plazo_pago_entrega', e.target.value)} rows={3} className={textareaClass} />
                        </Field>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <SectionTitle number="6" title="Registro de pagos" />
                        <Field label="¿Mantiene registro de los pagos realizados?" hint="Comprobantes o plataforma virtual donde quedan registrados" error={errors.registro_pagos}>
                            <textarea value={data.registro_pagos} onChange={e => setData('registro_pagos', e.target.value)} rows={3} className={textareaClass} />
                        </Field>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Field label="Estado de la Parcela" error={errors.estado_parcela}>
                            <input type="text" value={data.estado_parcela} onChange={e => setData('estado_parcela', e.target.value)} className={inputClass} />
                        </Field>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Guardando…' : 'Guardar cambios'}
                        </button>
                        <Link href="/vecinos" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
