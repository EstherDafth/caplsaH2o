import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function WizardContrato({ auth }) {
    const [paso, setPaso] = useState(1);
    const [tipoDocumentos, setTipoDocumentos] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [numeroContratoPreview, setNumeroContratoPreview] = useState('');

    const { data, setData, post, progress, processing } = useForm({
        // Dirección
        cp: '', estado: '', municipio: '', colonia: '', calle: '',
        numero_int: '', numero_ext: '', referencias: '',

        // Toma de agua
        tipo_toma: 'Doméstica', estatus: 'Activa',

        // Cliente
        cliente_id: '',

        // Contrato
        fecha_inicio: '',

        // Documentos
        documentos: [
            { tipo: '1', archivo: null }, // Credencial
            { tipo: '2', archivo: null }, // Predial
            { tipo: '3', archivo: null }  // Contrato de Compra-Venta
        ],
    });

    useEffect(() => {
        axios.get(route('tipo-documentos.list'))
            .then(res => setTipoDocumentos(res.data))
            .catch(() => alert('Error al cargar los tipos de documentos'))
            .finally(() => setLoadingTipos(false));
    }, []);

    const cambiarDocumento = (index, campo, valor) => {
        const nuevos = [...data.documentos];
        nuevos[index][campo] = valor;
        setData('documentos', nuevos);
    };

    const guardar = () => {
        post(route('contratos.store'), {
            forceFormData: true,
            onSuccess: () => setPaso(1),
        });
    };

    const siguiente = () => setPaso(p => p + 1);
    const anterior = () => setPaso(p => p - 1);


    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold">Nuevo Contrato</h2>}>
            <Head title="Crear Contrato"/>
            {/* Espaciado debajo del header */}
            <div className="mt-10"/>
            <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
                <div className="mb-4 flex justify-between items-center">
                    <span className="text-gray-600">Paso {paso} de 5</span>
                </div>

                {paso === 1 && (
                    <div>
                        <h3 className="font-bold mb-4 text-lg">Dirección</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input" placeholder="Código Postal" value={data.cp}
                                   onChange={e => setData('cp', e.target.value)}/>
                            <input className="input" placeholder="Estado" value={data.estado}
                                   onChange={e => setData('estado', e.target.value)}/>
                            <input className="input" placeholder="Municipio" value={data.municipio}
                                   onChange={e => setData('municipio', e.target.value)}/>
                            <input className="input" placeholder="Colonia" value={data.colonia}
                                   onChange={e => setData('colonia', e.target.value)}/>
                            <input className="input" placeholder="Calle" value={data.calle}
                                   onChange={e => setData('calle', e.target.value)}/>
                            <input className="input" placeholder="Número Exterior" value={data.numero_ext}
                                   onChange={e => setData('numero_ext', e.target.value)}/>
                            <input className="input" placeholder="Número Interior" value={data.numero_int}
                                   onChange={e => setData('numero_int', e.target.value)}/>
                        </div>
                        <div className="mt-4">
            <textarea
                className="input w-full"
                placeholder="Referencias"
                rows="3"
                value={data.referencias}
                onChange={e => setData('referencias', e.target.value)}
            />
                        </div>
                    </div>
                )}


                {paso === 2 && (
                    <div>
                        <h3 className="font-bold mb-2">Toma de Agua</h3>
                        <select className="input" value={data.tipo_toma}
                                onChange={e => setData('tipo_toma', e.target.value)}>
                            <option>Doméstica</option>
                            <option>Comercial</option>
                            <option>Industrial</option>
                        </select>
                        <select className="input" value={data.estatus}
                                onChange={e => setData('estatus', e.target.value)}>
                            <option>Activa</option>
                            <option>Inactiva</option>
                        </select>
                    </div>
                )}

                {paso === 3 && (
                    <div>
                        <h3 className="font-bold mb-4 text-lg">Buscar Usuario</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                className="input"
                                placeholder="Nombre completo (Ej. Juan Pérez Ramírez)"
                                value={data.nombre_completo || ''}
                                onChange={e => setData('nombre_completo', e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="Correo electrónico"
                                value={data.correo_electronico || ''}
                                onChange={e => setData('correo_electronico', e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="Teléfono"
                                value={data.telefono || ''}
                                onChange={e => setData('telefono', e.target.value)}
                            />
                            <input
                                className="input"
                                placeholder="Celular"
                                value={data.celular || ''}
                                onChange={e => setData('celular', e.target.value)}
                            />
                        </div>

                        <div className="mt-4">
                            <button
                                className="btn bg-blue-600 text-white"
                                onClick={async () => {
                                    try {
                                        const response = await axios.post(route('contratos.buscar-usuario'), {
                                            nombre_completo: data.nombre_completo,
                                            correo_electronico: data.correo_electronico,
                                            telefono: data.telefono,
                                            celular: data.celular,
                                        });

                                        const { exists, usuario } = response.data;
                                        setData('cliente_id', usuario.id_usuarios);
                                        alert(exists ? 'Usuario encontrado' : 'Usuario registrado');
                                    } catch (error) {
                                        console.error(error);
                                        alert('Error al buscar o registrar el usuario');
                                    }
                                }}
                            >
                                Buscar o Registrar Usuario
                            </button>

                        </div>

                        {data.cliente_id && (
                            <p className="mt-4 text-green-700 font-semibold">
                                Cliente asignado con ID: {data.cliente_id}
                            </p>
                        )}
                    </div>
                )}


                {paso === 4 && (
                    <div>
                        <h3 className="font-bold mb-2">Contrato</h3>
                        <input
                            className="input"
                            type="date"
                            value={data.fecha_inicio}
                            onChange={e => setData('fecha_inicio', e.target.value)}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            El número de contrato se generará automáticamente.<br/>
                            <span className="text-green-700 font-semibold">Ejemplo: {numeroContratoPreview}</span>
                        </p>
                    </div>
                )}


                {paso === 5 && (
                    <div>
                        <h3 className="font-bold mb-2 text-lg">Documentos</h3>
                        {loadingTipos ? (
                            <p className="text-gray-500">Cargando tipos de documentos...</p>
                        ) : (
                            <>
                                <p className="text-sm text-gray-600 mb-4">
                                    Sube los siguientes documentos requeridos por el comité: Credencial, Predial y
                                    Contrato de compra-venta.
                                </p>

                                {data.documentos.map((doc, i) => (
                                    <div key={i} className="mb-6 border p-4 rounded-lg shadow-sm bg-gray-50">
                                        <label className="block font-semibold mb-1">Tipo de Documento</label>
                                        <input
                                            type="text"
                                            className="input mb-2 bg-gray-100 cursor-not-allowed"
                                            value={
                                                doc.tipo === '1' ? 'Credencial' :
                                                    doc.tipo === '2' ? 'Predial' :
                                                        doc.tipo === '3' ? 'Contrato de Compra-Venta' :
                                                            'Tipo desconocido'
                                            }
                                            readOnly
                                        />


                                        <label className="block font-semibold mb-1">Archivo</label>
                                        <input
                                            type="file"
                                            className="input"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={e => cambiarDocumento(i, 'archivo', e.target.files[0])}
                                        />
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                {/* Controles */}
                <div className="mt-6 flex justify-between">
                    {paso > 1 && <button onClick={anterior} className="btn bg-gray-400">Anterior</button>}
                    {paso < 5 && <button onClick={siguiente} className="btn bg-blue-600 text-white">Siguiente</button>}
                    {paso === 5 && (
                        <button
                            onClick={guardar}
                            className="btn bg-green-600 text-white"
                            disabled={processing}
                        >
                            Guardar Contrato
                        </button>
                    )}
                </div>
                {progress && <div className="mt-2 text-sm text-blue-600">Subiendo... {progress.percentage}%</div>}
            </div>

        </AuthenticatedLayout>
    );


}
