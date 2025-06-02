<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\DireccionController;
use App\Http\Controllers\TomaAguaController;


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
