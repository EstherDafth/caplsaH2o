import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Aportaciones({ auth, aportaciones: initialAportaciones }) {
    const [aportaciones, setAportaciones] = useState(initialAportaciones || []);
    const [form, setForm] = useState({
        fecha_Aportacion: '',
        concepto: '',
        descripcion: '',
        monto: '',
        usuarios_id_usuarios: ''
    });
    const [editandoId, setEditandoId] = useState(null);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const guardarAportacion = async () => {
        try {
            if (editandoId) {
                await axios.put(`/aportaciones/${editandoId}`, form);
                setAportaciones(prev =>
                    prev.map(a => a.idaportaciones === editandoId ? { ...a, ...form } : a)
                );
            } else {
                const response = await axios.post('/aportaciones', form);
                setAportaciones([...aportaciones, response.data]);
            }
            setForm({ fecha_Aportacion: '', concepto: '', descripcion: '', monto: '', usuarios_id_usuarios: '' });
            setEditandoId(null);
        } catch (error) {
            alert('Error al guardar la aportación');
            console.error(error);
        }
    };

    const editar = (aportacion) => {
        setForm({ ...aportacion });
        setEditandoId(aportacion.idaportaciones);
    };

    const eliminar = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta aportación?')) return;
        try {
            await axios.delete(`/aportaciones/${id}`);
            setAportaciones(prev => prev.filter(a => a.idaportaciones !== id));
        } catch (error) {
            alert('Error al eliminar la aportación');
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title="Aportaciones" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Aportaciones</h1>

                {/* Formulario */}
                <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium">Fecha de Aportación</label>
                            <input
                                type="date"
                                name="fecha_Aportacion"
                                value={form.fecha_Aportacion}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Concepto</label>
                            <input
                                type="text"
                                name="concepto"
                                value={form.concepto}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Descripción</label>
                            <input
                                type="text"
                                name="descripcion"
                                value={form.descripcion}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Monto</label>
                            <input
                                type="number"
                                name="monto"
                                value={form.monto}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">ID Usuario</label>
                            <input
                                type="number"
                                name="usuarios_id_usuarios"
                                value={form.usuarios_id_usuarios}
                                onChange={handleInputChange}
                                className="w-full border p-2 rounded"
                            />
                        </div>
                    </div>
                    <button
                        onClick={guardarAportacion}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        {editandoId ? 'Actualizar' : 'Crear'}
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border bg-white shadow rounded text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Nombre</th>
                            <th className="p-2 border">Monto</th>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Concepto</th>
                            <th className="p-2 border">Descripción</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {aportaciones.length > 0 ? (
                            aportaciones.map((a) => (
                                <tr key={a.idaportaciones}>
                                    <td className="p-2 border">{a.idaportaciones}</td>
                                    <td className="p-2 border">{a.usuario?.nombre || 'Desconocido'}</td>
                                    <td className="p-2 border">${a.monto}</td>
                                    <td className="p-2 border">{a.fecha_Aportacion}</td>
                                    <td className="p-2 border">{a.concepto}</td>
                                    <td className="p-2 border">{a.descripcion}</td>
                                    <td className="p-2 border space-x-2">
                                        <button
                                            onClick={() => editar(a)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => eliminar(a.idaportaciones)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 p-4">
                                    No hay aportaciones registradas.
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
