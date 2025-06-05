import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { route } from 'ziggy-js';
import Swal from 'sweetalert2';

export default function WizardContrato({ auth }) {
    const [paso, setPaso] = useState(1);
    const [tipoDocumentos, setTipoDocumentos] = useState([]);
    const [loadingTipos, setLoadingTipos] = useState(true);
    const [numeroContrato, setNumeroContrato] = useState('');
    const [tomaAguaId, setTomaAguaId] = useState(null);

    const { data, setData, post, progress, processing } = useForm({
        cp: '', estado: '', municipio: '', colonia: '', calle: '',
        numero_int: '', numero_ext: '', referencias: '',
        tipo_toma: 'Doméstica', estatus: 'Activa',
        cliente_id: '', nombre_completo: '',
        fecha_inicio: '',
        documentos: [
            { tipo: '1', archivo: null },
            { tipo: '2', archivo: null },
            { tipo: '3', archivo: null }
        ],
    });


    const [form, setForm] = useState({
        nombre_completo: '',
        correo_electronico: '',
        telefono: '',
        celular: ''
    });

    const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const buscarUsuario = async () => {
        try {
            const response = await axios.post('/contratos/buscar-usuario', form);
            setUsuarioEncontrado(response.data.usuario);
            setMensaje(response.data.exists ? 'Usuario encontrado' : 'Usuario registrado automáticamente');
            setData('cliente_id', response.data.usuario.id_usuarios);
        } catch (error) {
            console.error(error);
            setMensaje('Error al buscar usuario');
        }
    };

    const guardarTomaAgua = async () => {
        try {
            const direccionResponse = await axios.post('/direccion', {
                codigo_postal: data.cp,
                estado: data.estado,
                municipio: data.municipio,
                colonia: data.colonia,
                calle: data.calle,
                numero_interior: data.numero_int,
                numero_exterior: data.numero_ext,
                referencias: data.referencias,
            });

            const direccionId = direccionResponse.data.id;
            if (!direccionId) throw new Error('No se obtuvo ID de dirección');

            // Forzar ID fijo para toma de agua
            const tomaAguaIdFijo = 1;
            setTomaAguaId(tomaAguaIdFijo);
            setData('toma_agua_idtoma_agua', tomaAguaIdFijo);

            setPaso(3); // Avanzar al paso 3
        } catch (error) {
            console.error('Error al guardar dirección o toma de agua:', error.response?.data || error.message);
            alert('No se pudo guardar la dirección o la toma de agua. Verifica los datos ingresados.');
        }
    };

    const guardarContrato = () => {
        post(route('contratos.store'), {
            forceFormData: true,
            onSuccess: (page) => {
                setPaso(1);

                const numeroContrato = page.props?.flash?.numero_contrato;
                if (numeroContrato) {
                    setNumeroContrato(numeroContrato);

                    Swal.fire({
                        title: '¡Contrato guardado!',
                        text: `El contrato ${numeroContrato} se guardó con éxito.`,
                        icon: 'success',
                        confirmButtonText: 'Descargar PDF',
                        showCancelButton: true,
                        cancelButtonText: 'Cerrar',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            const url = `/contratos/${numeroContrato}/pdf`; // Ajusta si es diferente
                            window.open(url, '_blank');
                        }
                    });
                }
            },
            onError: (errors) => {
                console.error("Errores al guardar contrato:", errors);
                console.log("Intentando guardar contrato...");

                Swal.fire({
                    title: 'Error',
                    text: 'Hubo un problema al guardar el contrato.',
                    icon: 'error',
                });
            }
        });
    };


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

    const siguiente = () => setPaso(p => p + 1);
    const anterior = () => setPaso(p => p - 1);


    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="text-xl font-semibold">Nuevo Contrato</h2>}>
            <Head title="Crear Contrato" />
            <div className="mt-10" />
            <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
                <div className="mb-4 flex justify-between items-center">
                    <span className="text-gray-600">Paso {paso} de 5</span>
                </div>

                {paso === 1 && (
                    // Dirección
                    <>
                        <h3 className="font-bold mb-4 text-lg">Dirección</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="input" placeholder="Código Postal" value={data.cp} onChange={e => setData('cp', e.target.value)} />
                            <input className="input" placeholder="Estado" value={data.estado} onChange={e => setData('estado', e.target.value)} />
                            <input className="input" placeholder="Municipio" value={data.municipio} onChange={e => setData('municipio', e.target.value)} />
                            <input className="input" placeholder="Colonia" value={data.colonia} onChange={e => setData('colonia', e.target.value)} />
                            <input className="input" placeholder="Calle" value={data.calle} onChange={e => setData('calle', e.target.value)} />
                            <input className="input" placeholder="Número Exterior" value={data.numero_ext} onChange={e => setData('numero_ext', e.target.value)} />
                            <input className="input" placeholder="Número Interior" value={data.numero_int} onChange={e => setData('numero_int', e.target.value)} />
                        </div>
                        <div className="mt-4">
                            <textarea className="input w-full" placeholder="Referencias" rows="3" value={data.referencias} onChange={e => setData('referencias', e.target.value)} />
                        </div>
                    </>
                )}

                {paso === 2 && (
                    // Toma de Agua
                    <>
                        <h3 className="font-bold mb-4 text-lg">Toma de Agua</h3>
                        <select className="input" value={data.tipo_toma}
                                onChange={e => setData('tipo_toma', e.target.value)}>
                            <option>Doméstica</option>
                            <option>Comercial</option>
                            <option>Industrial</option>
                        </select>
                        <select className="input mt-4" value={data.estatus}
                                onChange={e => setData('estatus', e.target.value)}>
                            <option>Activa</option>
                            <option>Inactiva</option>
                        </select>
                    </>
                )}

                {paso === 3 && (
                    // Usuario
                    <>
                        <h3 className="font-bold mb-4 text-lg">Buscar o Registrar Cliente</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" name="nombre_completo" placeholder="Nombre completo" value={form.nombre_completo} onChange={handleChange} className="input" />
                            <input type="email" name="correo_electronico" placeholder="Correo electrónico" value={form.correo_electronico} onChange={handleChange} className="input" />
                            <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="input" />
                            <input type="text" name="celular" placeholder="Celular" value={form.celular} onChange={handleChange} className="input" />
                        </div>
                        <button onClick={buscarUsuario} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                            Buscar / Registrar Usuario
                        </button>
                        {mensaje && <p className="text-sm text-green-600 mt-2">{mensaje}</p>}
                        {usuarioEncontrado && (
                            <div className="mt-4 p-4 border rounded bg-gray-100">
                                <h3 className="font-semibold mb-2">Resultado:</h3>
                                <p><strong>ID:</strong> {usuarioEncontrado.id_usuarios}</p>
                                <p><strong>Nombre:</strong> {usuarioEncontrado.nombre} {usuarioEncontrado.a_paterno} {usuarioEncontrado.a_materno}</p>
                                <p><strong>Correo:</strong> {usuarioEncontrado.correo_electronico}</p>
                            </div>
                        )}
                    </>
                )}

                {paso === 4 && (
                    // Fecha
                    <>
                        <h3 className="font-bold mb-4 text-lg">Contrato</h3>
                        <input type="date" className="input" value={data.fecha_inicio} onChange={e => setData('fecha_inicio', e.target.value)} />
                    </>
                )}

                {paso === 5 && (
                    // Documentos
                    <>
                        <h3 className="font-bold mb-4 text-lg">Documentos</h3>
                        {loadingTipos ? (
                            <p>Cargando tipos de documentos...</p>
                        ) : (
                            data.documentos.map((doc, i) => {
                                const tipo = tipoDocumentos.find(t => t.id == doc.tipo);
                                return (
                                    <div key={i} className="mb-4">
                                        <label className="block font-medium mb-1">
                                            {tipo ? tipo.nombre : `Tipo ${doc.tipo}`}
                                        </label>
                                        <input
                                            type="file"
                                            onChange={e => cambiarDocumento(i, 'archivo', e.target.files[0])}
                                            className="input"
                                        />
                                    </div>
                                );
                            })
                        )}
                        {numeroContrato && (
                            <div className="mt-4 p-4 border rounded bg-green-100">
                                <p className="text-green-800 font-bold">Contrato generado: {numeroContrato}</p>
                            </div>
                        )}
                    </>
                )}

                {/* Botones de navegación */}
                <div className="mt-6 flex justify-between">
                    {paso > 1 && (
                        <button onClick={anterior} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
                            Anterior
                        </button>
                    )}
                    {paso < 5 ? (
                            <button
                                onClick={paso === 2 ? guardarTomaAgua : siguiente}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                Siguiente
                            </button>

                    ) : (
                        <button onClick={guardarContrato} disabled={processing}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                            {processing ? 'Guardando...' : 'Guardar Contrato'}
                        </button>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
