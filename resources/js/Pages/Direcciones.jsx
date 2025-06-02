import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Direcciones({ auth, direcciones: propDirecciones }) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [direcciones, setDirecciones] = useState(propDirecciones || []);
    const { flash, errors } = usePage().props;

    const { data, setData, reset, put } = useForm({
        codigo_postal: '',
        estado: '',
        municipio: '',
        colonia: '',
        calle: '',
        numero_interior: '',
        numero_exterior: '',
        referencias: ''
    });

    const abrirModal = (direccion) => {
        setEditando(direccion.iddireccion);
        setData({
            codigo_postal: direccion.codigo_postal,
            estado: direccion.estado,
            municipio: direccion.municipio,
            colonia: direccion.colonia,
            calle: direccion.calle,
            numero_interior: direccion.numero_interior || '',
            numero_exterior: direccion.numero_exterior || '',
            referencias: direccion.referencias || ''
        });
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        reset();
    };

    const guardar = () => {
        if (editando) {
            put(`/direcciones/${editando}`);
        }
        cerrarModal();
    };

    const direccionesFiltradas = direcciones.filter(d =>
        `${d.codigo_postal} ${d.estado} ${d.municipio} ${d.colonia} ${d.calle}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Direcciones
                </h2>
            }
        >
            <Head title="Direcciones" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-end mb-4">
                            <input
                                type="text"
                                placeholder="Buscar dirección..."
                                className="border p-2 rounded w-1/3"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <table className="w-full border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Código Postal</th>
                                <th className="border p-2">Estado</th>
                                <th className="border p-2">Municipio</th>
                                <th className="border p-2">Colonia</th>
                                <th className="border p-2">Calle</th>
                                <th className="border p-2"># Ext</th>
                                <th className="border p-2"># Int</th>
                                <th className="border p-2">Referencias</th>
                                <th className="border p-2">Clientes</th>
                                <th className="border p-2">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {direccionesFiltradas.length > 0 ? (
                                direccionesFiltradas.map(d => (
                                    <tr key={d.iddireccion}>
                                        <td className="border p-2">{d.codigo_postal}</td>
                                        <td className="border p-2">{d.estado}</td>
                                        <td className="border p-2">{d.municipio}</td>
                                        <td className="border p-2">{d.colonia}</td>
                                        <td className="border p-2">{d.calle}</td>
                                        <td className="border p-2">{d.numero_exterior}</td>
                                        <td className="border p-2">{d.numero_interior}</td>
                                        <td className="border p-2">{d.referencias}</td>
                                        <td className="border p-2">
                                            {d.clientes?.length > 0 ? d.clientes.join(', ') : '—'}
                                        </td>
                                        <td className="border p-2">
                                            <button
                                                onClick={() => abrirModal(d)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center p-4 text-gray-500">
                                        No se encontraron direcciones.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                <div className="bg-white p-6 rounded w-full max-w-md">
                                    <h2 className="text-lg font-bold mb-4">Editar Dirección</h2>

                                    {[
                                        'codigo_postal',
                                        'estado',
                                        'municipio',
                                        'colonia',
                                        'calle',
                                        'numero_exterior',
                                        'numero_interior',
                                        'referencias'
                                    ].map(field => (
                                        <div key={field} className="mb-2">
                                            <input
                                                className="w-full p-2 border rounded"
                                                placeholder={field.replace(/_/g, ' ').toUpperCase()}
                                                value={data[field]}
                                                onChange={e => setData(field, e.target.value)}
                                            />
                                            {errors[field] && (
                                                <div className="text-red-500 text-sm">
                                                    {errors[field]}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            onClick={cerrarModal}
                                            className="bg-gray-300 px-4 py-2 rounded"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={guardar}
                                            className="bg-green-600 text-white px-4 py-2 rounded"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
