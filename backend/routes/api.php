<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/estado', function () {
    return response()->json([
        'proyecto' => 'Tattoo Studio',
        'servicio' => 'API REST',
        'version' => '1.0',
        'estado' => 'Activo',
        'mensaje' => 'API funcionando correctamente'
    ], 200);
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');