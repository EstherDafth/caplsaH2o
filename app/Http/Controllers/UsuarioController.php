<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index()
    {
        $usuarios = Usuario::with('contratos')
            ->where('roles_tipo_id_rol', 3)
            ->get();

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios
        ]);
    }

    public function show($nombreCompleto)
    {
        $usuarios = Usuario::with('contratos')
            ->whereRaw("CONCAT(nombre, ' ', a_paterno, ' ', a_materno) LIKE ?", ["%{$nombreCompleto}%"])
            ->where('roles_tipo_id_rol', 3)
            ->get();

        if ($usuarios->isEmpty()) {
            return Inertia::render('Usuarios/Index', [
                'error' => 'No se encontraron coincidencias',
                'usuarios' => []
            ]);
        }

        return Inertia::render('Usuarios/Index', [
            'usuarios' => $usuarios
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'a_paterno' => 'required|string|max:255',
            'a_materno' => 'required|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'correo_electronico' => 'required|email|max:255|unique:usuarios,correo_electronico',
        ]);

        $validated['roles_tipo_id_rol'] = 3;

        Usuario::create($validated);

        return redirect()->route('usuarios.index')->with('success', 'Usuario creado correctamente.');
    }

    public function update(Request $request, $id)
    {
        $usuario = Usuario::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'nullable|string|max:255',
            'a_paterno' => 'nullable|string|max:255',
            'a_materno' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'celular' => 'nullable|string|max:20',
            'correo_electronico' => 'nullable|email|max:255|unique:usuarios,correo_electronico,' . $usuario->id_usuarios . ',id_usuarios',
        ]);

        $usuario->update($validated);

        return redirect()->route('usuarios.index')->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return redirect()->route('usuarios.index')->with('success', 'Usuario eliminado correctamente.');
    }
}
