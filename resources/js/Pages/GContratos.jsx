import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import axios from 'axios';

export default function GContratos({ auth, contratos: initialContratos }) {
    const [contratos, setContratos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [contratoSeleccionado, setContratoSeleccionado] = useState(null);

    useEffect(() => {
        setContratos(initialContratos);
        setLoading(false);
    }, []);

    const eliminarContrato = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este contrato?')) return;
        try {
            await axios.delete(`/gestion-contratos/${id}`);
            setContratos(prev => prev.filter(c => c.idcontrato !== id));
            alert('Contrato eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar contrato:', error);
            alert('No se pudo eliminar el contrato.');
        }
    };

    const editarContrato = (contrato) => {
        setContratoSeleccionado(contrato);
        setModalAbierto(true);
    };

    const handleGuardarEdicion = async () => {
        try {
            await axios.put(`/gestion-contratos/${contratoSeleccionado.idcontrato}`, contratoSeleccionado);
            setContratos(prev =>
                prev.map(c => (c.idcontrato === contratoSeleccionado.idcontrato ? contratoSeleccionado : c))
            );
            setModalAbierto(false);
            alert('Contrato actualizado correctamente.');
        } catch (error) {
            console.error('Error al actualizar el contrato:', error);
            alert('No se pudo actualizar el contrato.');
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={<h2 className="text-2xl font-bold text-gray-800">Gestión de Contratos</h2>}
        >
            <Head title="Gestión de Contratos" />

            <div className="py-10 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white p-6 rounded shadow">
                    {loading ? (
                        <p>Cargando contratos...</p>
                    ) : contratos.length === 0 ? (
                        <p>No hay contratos registrados.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border text-sm rounded">
                                <thead className="bg-gray-100">
                                <tr className="text-left">
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">Cliente</th>
                                    <th className="p-2 border">Fecha Inicio</th>
                                    <th className="p-2 border">Toma de Agua</th>
                                    <th className="p-2 border">Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {contratos.map((contrato) => (
                                    <tr key={contrato.idcontrato} className="border-b hover:bg-gray-50">
                                        <td className="p-2 border">{contrato.idcontrato}</td>
                                        <td className="p-2 border">{contrato.usuario?.nombre || 'Sin nombre'}</td>
                                        <td className="p-2 border">{contrato.fecha_inicio}</td>
                                        <td className="p-2 border">{contrato.toma_agua?.tipo_toma}</td>
                                        <td className="p-2 border space-x-2">
                                            <button
                                                onClick={() => editarContrato(contrato)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => eliminarContrato(contrato.idcontrato)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Eliminar
                                            </button>
                                            <button
                                                onClick={() => { /* lógica pendiente */
                                                }}
                                                className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                                            >
                                                Descargar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {/* Modal de edición */}
                            {modalAbierto && contratoSeleccionado && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                                        <h2 className="text-xl font-bold mb-4">
                                            Editar Contrato #{contratoSeleccionado.idcontrato}
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-1 text-gray-700">Fecha de Inicio</label>
                                                <input
                                                    type="date"
                                                    className="border rounded p-2 w-full"
                                                    value={contratoSeleccionado.fecha_inicio || ''}
                                                    onChange={(e) =>
                                                        setContratoSeleccionado({
                                                            ...contratoSeleccionado,
                                                            fecha_inicio: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            {/* Aquí puedes agregar más campos si se necesita */}
                                        </div>

                                        <div className="mt-6 flex justify-end space-x-2">
                                            <button
                                                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                                onClick={() => setModalAbierto(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                className="bg-green-600 text-white px-4 py-2 rounded"
                                                onClick={handleGuardarEdicion}
                                            >
                                                Guardar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
