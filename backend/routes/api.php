<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CitaController;


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

// Ruta protegida
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); 
//Ruta Cierre de sesion

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

    Route::middleware('auth:sanctum')->group(function () {

    Route::get('/citas', [CitaController::class, 'index']);

    Route::get('/citas/{id}', [CitaController::class, 'show']);

});
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/citas', [CitaController::class, 'index']);

    Route::get('/citas/{id}', [CitaController::class, 'show']);

    Route::post('/citas', [CitaController::class, 'store']);

});