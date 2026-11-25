
<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitaController;

// Estado de la API
Route::get('/estado', function () {
    return response()->json([
        'proyecto' => 'Tattoo Studio',
        'servicio' => 'API REST',
        'version' => '1.0',
        'estado' => 'Activo',
        'mensaje' => 'API funcionando correctamente'
    ], 200);
});

// Rutas publicas
Route::post('/registro', [AuthController::class, 'registro']);

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:5,1');

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {

    // Autenticacion
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Gestion de citas
    Route::get('/citas', [CitaController::class, 'index']);

    Route::get('/citas/{id}', [CitaController::class, 'show']);

    Route::post('/citas', [CitaController::class, 'store']);

    Route::put('/citas/{id}', [CitaController::class, 'update']);

    Route::delete('/citas/{id}', [CitaController::class, 'destroy']);
});
