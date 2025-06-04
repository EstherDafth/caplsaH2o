<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DireccionController;
use App\Http\Controllers\TomaAguaController;
use App\Http\Controllers\ContratoController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/clientes', [ClienteController::class, 'index'])->name('clientes.index');
    Route::post('/clientes', [ClienteController::class, 'store'])->name('clientes.store');
    Route::put('/clientes/{cliente}', [ClienteController::class, 'update'])->name('clientes.update');
    Route::delete('/clientes/{cliente}', [ClienteController::class, 'destroy'])->name('clientes.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/direcciones', [DireccionController::class, 'index'])->name('direcciones.index');
    Route::put('/direcciones/{id}', [DireccionController::class, 'update'])->name('direcciones.update');
});

Route::get('/toma_agua', [TomaAguaController::class, 'index'])->name('toma_agua.index');
Route::post('/toma_agua', [TomaAguaController::class, 'store'])->name('toma_agua.store');
Route::put('/toma_agua/{id}', [TomaAguaController::class, 'update'])->name('toma_agua.update');
Route::delete('/toma_agua/{id}', [TomaAguaController::class, 'destroy'])->name('toma_agua.destroy');

Route::get('/WizardContrato', function () {
    return Inertia::render('WizardContrato');
})->name('wizard.contrato');


// Página principal de contratos
Route::get('/contratos', [ContratoController::class, 'index'])->name('contratos.index');

// Paso 1: Registrar dirección
Route::post('/contratos/direccion', [ContratoController::class, 'storeDireccion'])->name('contratos.storeDireccion');

// Paso 2: Registrar toma de agua
Route::post('/contratos/toma', [ContratoController::class, 'storeTomaAgua'])->name('contratos.storeTomaAgua');

// Paso 3: Buscar o crear usuario
Route::post('/contratos/buscar-usuario', [ContratoController::class, 'buscarUsuario'])->name('contratos.buscarUsuario');

// Paso 4: Crear contrato
Route::post('/contratos/crear', [ContratoController::class, 'storeContrato'])->name('contratos.storeContrato');

// Paso 5: Subir documento
Route::post('/contratos/documento', [ContratoController::class, 'storeDocumento'])->name('contratos.storeDocumento');

// Finalizar contrato (actualizar fecha_fin y estatus)
Route::put('/contratos/{id}', [ContratoController::class, 'update'])->name('contratos.update');

// Eliminar contrato (y elementos relacionados)
Route::delete('/contratos/{id}', [ContratoController::class, 'destroy'])->name('contratos.destroy');

Route::get('/contrato', [ContratoController::class, 'wizard'])->name('wizard.contrato');

// En routes/web.php o routes/api.php si usas API aparte
Route::get('/api/tipo-documentos', function () {
    return \App\Models\TipoDocumento::all([
        'idtipo_documento as id',
        'tipo_documento as nombre'
    ]);
})->name('tipo-documentos.list');

Route::get('/tipo-documentos', [ContratoController::class, 'listarTipos'])->name('tipo-documentos.list');

Route::get('/api/tipo-documentos', [ContratoController::class, 'obtenerTipos'])->name('tipo-documentos.list');

Route::post('/contratos/buscar-usuario', [ContratoController::class, 'buscarUsuario'])->name('contratos.buscar-usuario');
Route::post('/contratos', [ContratoController::class, 'store'])->name('contratos.store');
Route::resource('contratos', ContratoController::class);
