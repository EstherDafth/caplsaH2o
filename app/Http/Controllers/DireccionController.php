<?php

namespace App\Http\Controllers;

use App\Models\DireccionToma;
use Inertia\Inertia;

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
}
