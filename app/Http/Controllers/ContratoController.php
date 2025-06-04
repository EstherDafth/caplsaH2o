<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\DireccionToma;
use App\Models\Documento;
use App\Models\TomaAgua;
use App\Models\Usuario;
use App\Models\TipoDocumento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContratoController extends Controller
{
    public function index()
    {
        $contratos = Contrato::with(['usuario', 'tomaAgua'])
            ->get()
            ->map(function ($contrato) {
                return [
                    'idcontrato'       => $contrato->idcontrato,
                    'numero_contrato'  => $contrato->numero_contrato,
                    'fecha_inicio'     => $contrato->fecha_inicio,
                    'fecha_fin'        => $contrato->fecha_fin,
                    'nombre_completo'  => $contrato->usuario
                        ? $contrato->usuario->nombre . ' ' . $contrato->usuario->a_paterno . ' ' . $contrato->usuario->a_materno
                        : null,
                    'tipo_toma'        => $contrato->tomaAgua->tipo_toma ?? null,
                ];
            });

        return Inertia::render('WizardContrato', [
            'contratos' => $contratos
        ]);
    }

    public function storeDireccion(Request $request)
    {
        $validated = $request->validate([
            'colonia' => 'required|string|max:100',
            'calle' => 'required|string|max:100',
            'numero_interior' => 'nullable|string|max:10',
            'numero_exterior' => 'required|string|max:10',
            'referencias' => 'nullable|string|max:255',
        ]);

        $direccion = DireccionToma::create($validated);

        return response()->json([
            'success' => 'Dirección registrada correctamente.',
            'direccion_id' => $direccion->iddireccion
        ]);
    }

    public function storeTomaAgua(Request $request)
    {
        $validated = $request->validate([
            'tipo_toma' => 'required|string|max:50',
            'estatus' => 'required|string|max:50',
            'direccion_toma_iddireccion' => 'required|exists:direccion_toma,iddireccion'
        ]);

        $toma = TomaAgua::create($validated);

        return response()->json([
            'success' => 'Toma de agua registrada.',
            'toma_id' => $toma->idtoma_agua
        ]);
    }

    public function buscarUsuario(Request $request)
    {
        $validated = $request->validate([
            'nombre_completo' => 'required|string|max:255',
            'correo_electronico' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
        ]);

        $partes = preg_split('/\s+/', trim($validated['nombre_completo']));
        $nombre = $partes[0] ?? '';
        $a_paterno = $partes[1] ?? '';
        $a_materno = $partes[2] ?? '';

        $usuario = Usuario::where('nombre', 'like', "%$nombre%")
            ->where('a_paterno', 'like', "%$a_paterno%")
            ->where('a_materno', 'like', "%$a_materno%")
            ->where('correo_electronico', $validated['correo_electronico'])
            ->first();

        if ($usuario) {
            return response()->json([
                'exists' => true,
                'usuario' => $usuario
            ]);
        }

        $nuevo = Usuario::create([
            'nombre' => $nombre,
            'a_paterno' => $a_paterno,
            'a_materno' => $a_materno,
            'correo_electronico' => $validated['correo_electronico'],
            'telefono' => $validated['telefono'],
            'celular' => $validated['celular'],
            'roles_tipo_id_rol' => 3
        ]);

        return back()->with([
            'usuario' => $usuario ?? $nuevo,
            'exists' => $usuario ? true : false
        ]);

    }

    public function storeContrato(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id_usuarios',
            'toma_id' => 'required|exists:toma_agua,idtoma_agua',
        ]);

        // Genera un número único con prefijo, fecha y random
        do {
            $numero = 'CTR-' . now()->format('Ymd') . '-' . rand(1000, 9999);
        } while (Contrato::where('numero_contrato', $numero)->exists());

        $contrato = Contrato::create([
            'numero_contrato' => $numero,
            'fecha_inicio' => now(),
            'fecha_fin' => null,
            'usuarios_id_usuarios' => $validated['usuario_id'],
            'toma_agua_idtoma_agua' => $validated['toma_id']
        ]);

        return response()->json([
            'success' => 'Contrato registrado correctamente.',
            'contrato_id' => $contrato->idcontrato
        ]);
    }

    public function storeDocumento(Request $request)
    {
        $validated = $request->validate([
            'documento' => 'required|file',
            'contrato_id' => 'required|exists:contrato,idcontrato',
            'tipo_documento_id' => 'required|integer',
        ]);

        $path = $request->file('documento')->store('documentos');

        Documento::create([
            'ruta_documento' => $path,
            'contrato_idcontrato' => $validated['contrato_id'],
            'tipo_documento_idtipo_documento' => $validated['tipo_documento_id'],
        ]);

        return response()->json(['success' => 'Documento subido correctamente.']);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'fecha_fin' => 'required|date',
        ]);

        $contrato = Contrato::findOrFail($id);
        $contrato->fecha_fin = $validated['fecha_fin'];
        $contrato->save();

        if ($contrato->tomaAgua) {
            $contrato->tomaAgua->estatus = 'inactiva';
            $contrato->tomaAgua->save();
        }

        return response()->json(['success' => 'Contrato finalizado correctamente.']);
    }

    public function destroy($id)
    {
        $contrato = Contrato::find($id);

        if (!$contrato) {
            return response()->json(['error' => 'Contrato no encontrado.'], 404);
        }

        $contrato->delete();

        return response()->json(['success' => 'Contrato eliminado correctamente.']);
    }

    public function tiposDocumento()
    {
        return response()->json(\App\Models\TipoDocumento::all());
    }
    public function create()
    {
        return Inertia::render('Contratos/WizardContrato', [
            'auth' => auth()->user(),
            'tipoDocumentos' => TipoDocumento::all(['idtipo_documento as id', 'nombre']),
        ]);
    }

    public function wizard()
    {

        return Inertia::render('WizardContrato', [
            'auth' => auth()->user(),
            'tipoDocumentos' => \App\Models\TipoDocumento::all([
                'idtipo_documento as id',
                'tipo_documento as nombre'
            ]),
        ]);
    }

    public function listarTipos()
    {
        return response()->json(\App\Models\TipoDocumento::all());
    }

    public function obtenerTipos()
    {
        return response()->json(TipoDocumento::all());
    }

}
