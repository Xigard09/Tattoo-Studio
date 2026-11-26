<?php

namespace App\Http\Controllers;

use App\Models\Tatuador;
use App\Models\Servicio;
use Illuminate\Http\JsonResponse;

class CatalogoController extends Controller
{
    // Consultar tatuadores registrados
    public function tatuadores(): JsonResponse
    {
        $tatuadores = Tatuador::select(
            'id_tatuador',
            'nombre',
            'especialidad'
        )
            ->orderBy('nombre', 'asc')
            ->get();

        return response()->json($tatuadores, 200);
    }

    // Consultar servicios activos
    public function servicios(): JsonResponse
    {
        $servicios = Servicio::select(
            'id_servicio',
            'nombre_servicio',
            'descripcion',
            'duracion_estimada',
            'estado'
        )
            ->where('estado', 'Activo')
            ->orderBy('nombre_servicio', 'asc')
            ->get();

        return response()->json($servicios, 200);
    }
}