<?php

namespace App\Http\Controllers;

use App\Models\DireccionToma;
use Inertia\Inertia;
use Illuminate\Http\Request;


class DireccionController extends Controller
{
    public function index()
    {
        // Carga relaciones necesarias: tomasAgua -> contratos -> usuario
        $direcciones = DireccionToma::with('tomasAgua.contratos.usuario')->get();

        // Añade arreglo de clientes a cada dirección
        $direcciones = $direcciones->map(function ($direccion) {
            $clientes = $direccion->tomasAgua->flatMap(function ($toma) {
                return $toma->contratos->map(function ($contrato) {
                    return $contrato->usuario->nombre . ' ' . $contrato->usuario->a_paterno;
                });
            })->unique()->values()->all();

            // Agrega propiedad 'clientes' al objeto
            $direccion->clientes = $clientes;

            return $direccion;
        });

        return Inertia::render('Direcciones', [
            'direcciones' => $direcciones,
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'codigo_postal' => 'required|string|max:10',
            'estado' => 'required|string|max:100',
            'municipio' => 'required|string|max:100',
            'colonia' => 'required|string|max:100',
            'calle' => 'required|string|max:100',
            'numero_interior' => 'nullable|string|max:10',
            'numero_exterior' => 'required|string|max:10',
            'referencias' => 'nullable|string|max:255',
        ]);

        $direccion = DireccionToma::create($validated);

        return response()->json(['id' => $direccion->iddireccion]);
    }


}
