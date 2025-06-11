<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contrato;
use Inertia\Inertia;

class GestionContratoController extends Controller
{
    public function index()
    {
        $contratos = Contrato::with(['usuario', 'toma_agua'])->get();

        return Inertia::render('GContratos', [
            'contratos' => $contratos
        ]);
    }

    public function destroy($id)
    {
        $contrato = Contrato::findOrFail($id);
        $contrato->delete();

        return response()->json(['message' => 'Contrato eliminado']);
    }
    public function edit($id)
    {
        $contrato = Contrato::with(['usuario', 'tomaAgua'])->findOrFail($id);

        return Inertia::render('EditarContrato', [
            'contrato' => $contrato
        ]);
    }
    public function update(Request $request, $id)
    {
        $contrato = Contrato::findOrFail($id);
        $contrato->fecha_inicio = $request->input('fecha_inicio');
        // Agrega más campos si los editas
        $contrato->save();

        return response()->json(['message' => 'Contrato actualizado']);
    }

}
