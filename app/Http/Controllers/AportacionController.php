<?php

namespace App\Http\Controllers;

use App\Models\Aportacion;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AportacionController extends Controller
{
public function index()
{
$aportaciones = Aportacion::with('usuario')->get();
return Inertia::render('Aportaciones', [
'aportaciones' => $aportaciones
]);
}

public function store(Request $request)
{
$data = $request->validate([
'fecha_Aportacion' => 'required|date',
'concepto' => 'required|string|max:255',
'descripcion' => 'nullable|string|max:255',
'monto' => 'required|numeric',
'usuarios_id_usuarios' => 'required|exists:usuarios,id_usuarios'
]);

$aportacion = Aportacion::create($data);
return response()->json($aportacion);
}

public function update(Request $request, $id)
{
$aportacion = Aportacion::findOrFail($id);

$data = $request->validate([
'fecha_Aportacion' => 'required|date',
'concepto' => 'required|string|max:255',
'descripcion' => 'nullable|string|max:255',
'monto' => 'required|numeric',
'usuarios_id_usuarios' => 'required|exists:usuarios,id_usuarios'
]);

$aportacion->update($data);
return response()->json(['message' => 'Aportación actualizada']);
}

public function destroy($id)
{
$aportacion = Aportacion::findOrFail($id);
$aportacion->delete();
return response()->json(['message' => 'Aportación eliminada']);
}
}
