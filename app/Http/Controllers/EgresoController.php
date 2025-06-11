<?php

namespace App\Http\Controllers;

use App\Models\Egreso;
use Illuminate\Http\Request;
use App\Models\Usuario;
use Inertia\Inertia;

class EgresoController extends Controller
{
    public function index()
    {
        $egresos = Egreso::all();
        $usuarios = Usuario::all(); // O el modelo que represente a tus responsables

        return Inertia::render('Egresos', [
            'egresos' => $egresos,
            'usuarios' => $usuarios,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([            'concepto' => 'required|string',
            'descripcion' => 'nullable|string',
            'monto' => 'required|numeric',
            'estatus' => 'required|string',
            'fecha_egreso' => 'required|date',
            'comprobante' => 'nullable|string',
            'responsable' => 'required|string',
        ]);

        $egreso = Egreso::create($validated);

        return response()->json($egreso);
    }

    public function update(Request $request, $id)
    {
        $egreso = Egreso::findOrFail($id);
        $egreso->update($request->all());
        return response()->json($egreso);
    }

    public function destroy($id)
    {
        $egreso = Egreso::findOrFail($id);
        $egreso->delete();
        return response()->json(['success' => true]);
    }
}
