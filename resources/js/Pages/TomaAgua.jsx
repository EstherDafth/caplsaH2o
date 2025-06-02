import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function TomaAgua({ auth, tomas, search }) {
    const [searchText, setSearchText] = useState(search || '');
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ tipo_toma: '', estatus: '' });

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            router.get(route('toma_agua.index'), { search: searchText }, { preserveState: true, replace: true });
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    const startEdit = (toma) => {
        setEditing(toma.idtoma);
        setForm({ tipo_toma: toma.tipo_toma, estatus: toma.estatus });
    };

    const handleUpdate = () => {
        router.post(route('toma_agua.update', editing), {
            _method: 'put',
            ...form
        }, {
            onSuccess: () => {
                setEditing(null);
                setForm({ tipo_toma: '', estatus: '' });
            }
        });
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="text-xl font-semibold text-gray-800">Tomas de Agua</h2>}
        >
            <Head title="Tomas de Agua" />

            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 shadow-sm rounded-lg overflow-x-auto">

                    {/* Buscador alineado a la derecha */}
                    <div className="flex justify-end mb-4">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="border p-2 rounded w-full md:w-1/3"
                            placeholder="Buscar por tipo, cliente, dirección..."
                        />
                    </div>

                    <table className="w-full border rounded text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Tipo de Toma</th>
                            <th className="border p-2">Estatus</th>
                            <th className="border p-2">Cliente</th>
                            <th className="border p-2">Dirección</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tomas.length > 0 ? (
                            tomas.map((toma) => (
                                <tr key={toma.idtoma}>
                                    <td className="border p-2">
                                        {editing === toma.idtoma ? (
                                            <select
                                                value={form.tipo_toma}
                                                onChange={(e) => setForm({ ...form, tipo_toma: e.target.value })}
                                                className="border p-1 rounded w-full"
                                            >
                                                <option value="">Selecciona...</option>
                                                <option value="Doméstica">Doméstica</option>
                                                <option value="Industrial">Industrial</option>
                                                <option value="Comercial">Comercial</option>
                                            </select>
                                        ) : (
                                            toma.tipo_toma
                                        )}
                                    </td>
                                    <td className="border p-2">
                                        {editing === toma.idtoma ? (
                                            <select
                                                value={form.estatus}
                                                onChange={(e) => setForm({ ...form, estatus: e.target.value })}
                                                className="border p-1 rounded w-full"
                                            >
                                                <option value="">Selecciona...</option>
                                                <option value="Activa">Activa</option>
                                                <option value="Inactiva">Inactiva</option>
                                            </select>
                                        ) : (
                                            toma.estatus
                                        )}
                                    </td>
                                    <td className="border p-2">{toma.cliente}</td>
                                    <td className="border p-2">{toma.direccion}</td>
                                    <td className="border p-2 text-center">
                                        {editing === toma.idtoma ? (
                                            <button
                                                onClick={handleUpdate}
                                                className="bg-green-600 text-white px-3 py-1 rounded"
                                            >
                                                Guardar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => startEdit(toma)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                                            >
                                                Editar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-500 p-4">
                                    No hay tomas registradas.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
