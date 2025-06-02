<?php

namespace App\Http\Controllers;

use App\Models\Contrato;
use App\Models\DireccionToma;
use App\Models\Documento;
use App\Models\TomaAgua;
use App\Models\Usuario;
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

        return Inertia::render('Contratos', [
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

        return redirect()->back()->with([
            'success' => 'Dirección registrada correctamente.',
            'direccion_id' => $direccion->iddireccion
        ]);
    }

    public function storeTomaAgua(Request $request)
    {
        $request->validate([
            'tipo_toma' => 'required|string|max:50',
            'estatus' => 'required|string|max:50',
            'direccion_toma_iddireccion' => 'required|exists:direccion_toma,iddireccion'
        ]);

        $toma = TomaAgua::create([
            'tipo_toma' => $request->tipo_toma,
            'estatus' => $request->estatus,
            'direccion_toma_iddireccion' => $request->direccion_toma_iddireccion
        ]);

        return redirect()->back()->with([
            'success' => 'Toma de agua registrada.',
            'toma_id' => $toma->idtoma_agua
        ]);
    }

    public function buscarUsuario(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'a_paterno' => 'required|string|max:255',
            'a_materno' => 'required|string|max:255',
            'correo_electronico' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
        ]);

        $usuario = Usuario::where('nombre', $validated['nombre'])
            ->where('a_paterno', $validated['a_paterno'])
            ->where('a_materno', $validated['a_materno'])
            ->where('correo_electronico', $validated['correo_electronico'])
            ->first();

        if ($usuario) {
            return redirect()->back()->with([
                'exists' => true,
                'usuario_id' => $usuario->id_usuarios
            ]);
        }

        $validated['roles_tipo_id_rol'] = 3;
        $nuevo = Usuario::create($validated);

        return redirect()->back()->with([
            'exists' => false,
            'usuario_id' => $nuevo->id_usuarios
        ]);
    }

    public function storeContrato(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'required|exists:usuarios,id_usuarios',
            'toma_id' => 'required|exists:toma_agua,idtoma_agua',
        ]);

        $numero = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT);

        $contrato = Contrato::create([
            'numero_contrato' => $numero,
            'fecha_inicio' => now(),
            'fecha_fin' => null,
            'usuarios_id_usuarios' => $validated['usuario_id'],
            'toma_agua_idtoma_agua' => $validated['toma_id']
        ]);

        return redirect()->route('contratos.index')->with([
            'success' => 'Contrato registrado correctamente.',
            'contrato_id' => $contrato->idcontrato
        ]);
    }

    public function storeDocumento(Request $request)
    {
        $request->validate([
            'documento' => 'required|file',
            'contrato_id' => 'required|integer|exists:contrato,idcontrato',
            'tipo_documento_id' => 'required|integer',
        ]);

        $path = $request->file('documento')->store('documentos');

        Documento::create([
            'ruta_documento' => $path,
            'contrato_idcontrato' => $request->contrato_id,
            'tipo_documento_idtipo_documento' => $request->tipo_documento_id,
        ]);

        return redirect()->back()->with('success', 'Documento subido correctamente.');
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

        return redirect()->route('contratos.index')->with('success', 'Contrato finalizado correctamente.');
    }

    public function destroy($id)
    {
        $contrato = Contrato::find($id);

        if (!$contrato) {
            return redirect()->back()->withErrors('Contrato no encontrado.');
        }

        $contrato->delete();

        return redirect()->back()->with('success', 'Contrato eliminado correctamente.');
    }
}
