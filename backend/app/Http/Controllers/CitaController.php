<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class CitaController extends Controller
{
    public function index(Request $request)
    {
        $citas = Cita::with(['tatuador', 'servicio'])
            ->where('id_cliente', $request->user()->id_cliente)
            ->orderBy('fecha_cita', 'asc')
            ->orderBy('hora', 'asc')
            ->get();

        return response()->json($citas, 200);
    }

    public function show(Request $request, $id)
    {
        $cita = Cita::with(['tatuador', 'servicio'])
            ->where('id_cliente', $request->user()->id_cliente)
            ->findOrFail($id);

        return response()->json($cita, 200);
        }

        public function store(Request $request)
{
    $datos = $request->validate([
        'fecha_cita' => [
            'required',
            'date_format:Y-m-d',
            'after_or_equal:today'
        ],
        'hora' => [
            'required',
            'date_format:H:i'
        ],
        'id_tatuador' => [
            'required',
            'integer',
            'exists:tatuador,id_tatuador'
        ],
        'id_servicio' => [
            'required',
            'integer',
            Rule::exists('servicio', 'id_servicio')
                ->where('estado', 'Activo')
        ]
    ]);

    $fechaHora = Carbon::createFromFormat(
        'Y-m-d H:i',
        $datos['fecha_cita'] . ' ' . $datos['hora'],
        'America/Bogota'
    )->startOfMinute();

    if ($fechaHora->isPast()) {
        return response()->json([
            'mensaje' => 'No se puede agendar una cita en el pasado.'
        ], 422);
    }

    $ocupado = Cita::where(
        'id_tatuador', $datos['id_tatuador']
    )
        ->where('fecha_cita', $datos['fecha_cita'])
        ->where('hora', $datos['hora'] . ':00')
        ->whereIn('estado_cita', [
            'Pendiente',
            'Confirmada'
        ])
        ->exists();

    if ($ocupado) {
        return response()->json([
            'mensaje' => 'El tatuador ya tiene una cita en ese horario.'
        ], 409);
    }

    $cita = Cita::create([
        'fecha_cita' => $datos['fecha_cita'],
        'hora' => $datos['hora'],
        'estado_cita' => 'Pendiente',
        'id_cliente' => $request->user()->id_cliente,
        'id_tatuador' => $datos['id_tatuador'],
        'id_servicio' => $datos['id_servicio']
    ]);

    return response()->json([
        'mensaje' => 'Cita registrada correctamente.',
        'cita' => $cita->load(['tatuador', 'servicio'])
    ], 201);
}

}