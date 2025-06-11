import React, { useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Egresos({ egresos: initialEgresos, usuarios }) {
    const [egresos, setEgresos] = useState(initialEgresos || []);
    const [form, setForm] = useState({
        concepto: '',
        descripcion: '',
        monto: '',
        estatus: '',
        fecha_egreso: '',
        comprobante: '',
        usuarios_id_usuarios: '', // <- Agregado
    });
    const [editandoId, setEditandoId] = useState(null);

    const handleInputChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const guardarEgreso = async () => {
        try {
            if (editandoId) {
                await axios.put(`/egresos/${editandoId}`, form);
                setEgresos(prev =>
                    prev.map(e => e.idegresos === editandoId ? { ...e, ...form } : e)
                );
            } else {
                const response = await axios.post('/egresos', form);
                setEgresos([...egresos, response.data]);
            }
            setForm({
                concepto: '',
                descripcion: '',
                monto: '',
                estatus: '',
                fecha_egreso: '',
                comprobante: '',
                usuarios_id_usuarios: '', // <- Reset
            });
            setEditandoId(null);
        } catch (error) {
            alert('Error al guardar el egreso');
            console.error(error);
        }
    };

    const editar = (egreso) => {
        setForm({
            concepto: egreso.concepto,
            descripcion: egreso.descripcion,
            monto: egreso.monto,
            estatus: egreso.estatus,
            fecha_egreso: egreso.fecha_egreso,
            comprobante: egreso.comprobante,
            usuarios_id_usuarios: egreso.usuarios_id_usuarios,
        });
        setEditandoId(egreso.idegresos);
    };

    const eliminar = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este egreso?')) return;
        try {
            await axios.delete(`/egresos/${id}`);
            setEgresos(prev => prev.filter(e => e.idegresos !== id));
        } catch (error) {
            alert('Error al eliminar el egreso');
            console.error(error);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Egresos" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Egresos</h1>

                {/* Formulario */}
                <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block">Concepto</label>
                            <input type="text" name="concepto" value={form.concepto} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Descripción</label>
                            <input type="text" name="descripcion" value={form.descripcion} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Monto</label>
                            <input type="number" name="monto" value={form.monto} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Estatus</label>
                            <input type="text" name="estatus" value={form.estatus} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Fecha de Egreso</label>
                            <input type="date" name="fecha_egreso" value={form.fecha_egreso} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Comprobante</label>
                            <input type="text" name="comprobante" value={form.comprobante} onChange={handleInputChange} className="w-full border p-2 rounded" />
                        </div>
                        <div>
                            <label className="block">Responsable</label>
                            <select name="usuarios_id_usuarios" value={form.usuarios_id_usuarios} onChange={handleInputChange} className="w-full border p-2 rounded">
                                <option value="">Seleccione un usuario</option>
                                {usuarios.map((u) => (
                                    <option key={u.id_usuarios} value={u.id_usuarios}>
                                        {u.nombre} {u.a_paterno}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button onClick={guardarEgreso} className="bg-green-600 text-white px-4 py-2 rounded">
                        {editandoId ? 'Actualizar' : 'Crear'}
                    </button>
                </div>

                {/* Tabla */}
                <div className="overflow-x-auto">
                    <table className="min-w-full border bg-white shadow rounded text-sm">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Concepto</th>
                            <th className="p-2 border">Descripción</th>
                            <th className="p-2 border">Monto</th>
                            <th className="p-2 border">Estatus</th>
                            <th className="p-2 border">Fecha</th>
                            <th className="p-2 border">Comprobante</th>
                            <th className="p-2 border">Responsable</th>
                            <th className="p-2 border">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {egresos.length > 0 ? (
                            egresos.map((e) => (
                                <tr key={e.idegresos}>
                                    <td className="p-2 border">{e.idegresos}</td>
                                    <td className="p-2 border">{e.concepto}</td>
                                    <td className="p-2 border">{e.descripcion}</td>
                                    <td className="p-2 border">${e.monto}</td>
                                    <td className="p-2 border">{e.estatus}</td>
                                    <td className="p-2 border">{e.fecha_egreso}</td>
                                    <td className="p-2 border">{e.comprobante}</td>
                                    <td className="p-2 border">
                                        {e.usuario?.nombre} {e.usuario?.a_paterno}
                                    </td>
                                    <td className="p-2 border space-x-2">
                                        <button onClick={() => editar(e)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                                        <button onClick={() => eliminar(e.idegresos)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center text-gray-500 p-4">No hay egresos registrados.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
