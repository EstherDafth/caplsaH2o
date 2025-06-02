<?php
// app/Http/Controllers/ClienteController.php
namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClienteController extends Controller
{
    public function index()
    {
        $clientes = Cliente::select(
            'id_usuarios as id',
            'nombre',
            'a_paterno',
            'a_materno',
            'telefono',
            'celular',
            'correo_electronico',
            'roles_tipo_id_rol'
        )->get();

        return Inertia::render('Clientes', ['clientes' => $clientes]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'a_paterno' => 'required|string|max:255',
            'a_materno' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'correo_electronico' => 'required|email|max:255',
            'roles_tipo_id_rol' => 'required|integer',
        ]);

        Cliente::create($request->all());

        return redirect()->back()->with('success', 'Cliente creado.');
    }

    public function update(Request $request, Cliente $cliente)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'a_paterno' => 'required|string|max:255',
            'a_materno' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'correo_electronico' => 'required|email|max:255',
            'roles_tipo_id_rol' => 'required|integer',
        ]);

        $cliente->update($request->all());

        return redirect()->back()->with('success', 'Cliente actualizado.');
    }

    public function destroy(Cliente $cliente)
    {
        $cliente->delete();

        return redirect()->back()->with('success', 'Cliente eliminado.');
    }
}
