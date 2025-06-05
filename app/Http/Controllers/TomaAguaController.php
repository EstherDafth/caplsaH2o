<?php

namespace App\Http\Controllers;

use App\Models\TomaAgua;
use App\Models\DireccionToma;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TomaAguaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $tomas = TomaAgua::with('direccion.cliente')
            ->when($search, function ($query, $search) {
                $query->where('tipo_toma', 'like', "%$search%")
                    ->orWhere('estatus', 'like', "%$search%")
                    ->orWhereHas('direccion.cliente', function ($q) use ($search) {
                        $q->where('nombre', 'like', "%$search%")
                            ->orWhere('a_paterno', 'like', "%$search%")
                            ->orWhere('a_materno', 'like', "%$search%");
                    });
            })
            ->get()
            ->map(function ($toma) {
                return [
                    'idtoma' => $toma->idtoma_agua,
                    'tipo_toma' => $toma->tipo_toma,
                    'estatus' => $toma->estatus,
                    'direccion_id' => $toma->direccion_toma_iddireccion,
                    'direccion' => optional($toma->direccion)->formatoCompleto(),
                    'cliente' => optional($toma->direccion?->cliente)->nombreCompleto(),
                ];
            });

        $direcciones = DireccionToma::with('cliente')->get()->map(function ($dir) {
            return [
                'id' => $dir->iddireccion,
                'texto' => $dir->formatoCompleto() . ' - ' . $dir->clienteNombre(),
            ];
        });

        return Inertia::render('TomaAgua', [
            'tomas' => $tomas,
            'direcciones' => $direcciones,
            'search' => $search,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo_toma' => 'required|string|max:30',
            'estatus' => 'required|string|max:15',
            'direccion_toma_iddireccion' => 'required|exists:direccion_toma,iddireccion',
        ]);

        $tomaAgua = TomaAgua::create($validated);

        return response()->json(['id' => $tomaAgua->idtoma_agua]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'tipo_toma' => 'required|string|max:30',
            'estatus' => 'required|string|max:15',
        ]);

        $toma = TomaAgua::findOrFail($id);
        $toma->update($request->only(['tipo_toma', 'estatus']));

        return redirect()->back()->with('success', 'Toma de agua actualizada correctamente.');
    }

    public function destroy($id)
    {
        $toma = TomaAgua::findOrFail($id);
        $toma->delete();

        return redirect()->back()->with('success', 'Toma de agua eliminada correctamente.');
    }
}
