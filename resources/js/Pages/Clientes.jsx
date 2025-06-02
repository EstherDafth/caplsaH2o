import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Clientes({ auth, clientes }) {
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
        nombre: '',
        a_paterno: '',
        a_materno: '',
        telefono: '',
        celular: '',
        correo_electronico: '',
        roles_tipo_id_rol: ''
    });

    const abrirModal = (cliente = null) => {
        if (cliente) {
            setEditando(cliente.id);
            setData({
                nombre: cliente.nombre,
                a_paterno: cliente.a_paterno,
                a_materno: cliente.a_materno,
                telefono: cliente.telefono,
                celular: cliente.celular,
                correo_electronico: cliente.correo_electronico,
                roles_tipo_id_rol: cliente.roles_tipo_id_rol,
            });
        } else {
            setEditando(null);
            reset();
        }
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        reset();
    };

    const guardar = () => {
        if (editando) {
            put(route('clientes.update', editando));
        } else {
            post(route('clientes.store'));
        }
        cerrarModal();
    };

    const eliminar = (id) => {
        if (confirm('¿Eliminar este cliente?')) {
            destroy(route('clientes.destroy', id));
        }
    };

    // Filtro por nombre, correo, apellido
    const clientesFiltrados = clientes.filter(cliente =>
        `${cliente.nombre} ${cliente.a_paterno} ${cliente.a_materno} ${cliente.correo_electronico}`
            .toLowerCase()
            .includes(busqueda.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Clientes
                </h2>
            }
        >
            <Head title="Clientes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">

                        <div className="flex justify-between items-center mb-4">
                            <button
                                onClick={() => abrirModal()}
                                className="bg-green-600 text-white px-4 py-2 rounded"
                            >
                                Crear Cliente
                            </button>

                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                className="border p-2 rounded w-1/3"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>

                        <table className="w-full border">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="border p-2">Nombre</th>
                                <th className="border p-2">Teléfono</th>
                                <th className="border p-2">Celular</th>
                                <th className="border p-2">Correo</th>
                                <th className="border p-2">Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map(cliente => (
                                    <tr key={cliente.id}>
                                        <td className="border p-2">{cliente.nombre} {cliente.a_paterno} {cliente.a_materno}</td>
                                        <td className="border p-2">{cliente.telefono}</td>
                                        <td className="border p-2">{cliente.celular}</td>
                                        <td className="border p-2">{cliente.correo_electronico}</td>
                                        <td className="border p-2 space-x-2">
                                            <button onClick={() => abrirModal(cliente)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded">Editar
                                            </button>
                                            <button onClick={() => eliminar(cliente.id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded">Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4 text-gray-500">No se encontraron clientes.</td>
                                </tr>
                            )}
                            </tbody>
                        </table>

                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                                <div className="bg-white p-6 rounded w-full max-w-md">
                                    <h2 className="text-lg font-bold mb-4">{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>

                                    <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Nombre" value={data.nombre} onChange={e => setData('nombre', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Apellido Paterno" value={data.a_paterno} onChange={e => setData('a_paterno', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Apellido Materno" value={data.a_materno} onChange={e => setData('a_materno', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Teléfono" value={data.telefono} onChange={e => setData('telefono', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-2" type="text" placeholder="Celular" value={data.celular} onChange={e => setData('celular', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-2" type="email" placeholder="Correo Electrónico" value={data.correo_electronico} onChange={e => setData('correo_electronico', e.target.value)} />
                                    <input className="w-full p-2 border rounded mb-4" type="number" placeholder="ID Rol" value={data.roles_tipo_id_rol} onChange={e => setData('roles_tipo_id_rol', e.target.value)} />

                                    <div className="flex justify-end space-x-2">
                                        <button onClick={cerrarModal} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
                                        <button onClick={guardar} className="bg-green-600 text-white px-4 py-2 rounded" disabled={processing}>Guardar</button>
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


