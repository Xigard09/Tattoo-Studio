<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Carbon\Carbon;
use App\Models\Servicio;
use App\Models\Tatuador;
use Illuminate\Support\Facades\DB;

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

private function obtenerDuracionMinutos(string $duracion): int
{
    $duracion = strtolower(trim($duracion));

    if (preg_match('/^(\d+)\s*horas?$/', $duracion, $coincidencias)) {
        return (int) $coincidencias[1] * 60;
    }

    if (preg_match('/^(\d+)\s*minutos?$/', $duracion, $coincidencias)) {
        return (int) $coincidencias[1];
    }

    throw new \InvalidArgumentException(
        'La duración del servicio no tiene un formato válido.'
    );
}

private function existeSolapamiento(
    int $idTatuador,
    Carbon $inicio,
    Carbon $fin,
    ?int $idCitaExcluir = null
): bool
{
    $consulta = Cita::with('servicio')
        ->where('id_tatuador', $idTatuador)
        ->whereIn('estado_cita', [
            'Pendiente',
            'Confirmada'
        ]);

    if ($idCitaExcluir !== null) {
        $consulta->where('id_cita', '!=', $idCitaExcluir);
    }

    $citas = $consulta->get();

    foreach ($citas as $cita) {

        $inicioExistente = Carbon::parse(
            $cita->fecha_cita . ' ' . $cita->hora,
            'America/Bogota'
        );

        $duracion = $this->obtenerDuracionMinutos(
            $cita->servicio->duracion_estimada
        );

        $finExistente = $inicioExistente
            ->copy()
            ->addMinutes($duracion);

        if (
            $inicio->lt($finExistente) &&
            $fin->gt($inicioExistente)
        ) {
            return true;
        }
    }

    return false;
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

    $inicio = Carbon::parse(
        $datos['fecha_cita'] . ' ' . $datos['hora'],
        'America/Bogota'
    );

    if ($inicio->lte(Carbon::now('America/Bogota'))) {
        return response()->json([
            'mensaje' => 'La cita debe programarse en un horario futuro.'
        ], 422);
    }

    return DB::transaction(function () use (
        $datos,
        $request,
        $inicio
    ) {

        Tatuador::where(
            'id_tatuador',
            $datos['id_tatuador']
        )->lockForUpdate()->firstOrFail();

        $servicio = Servicio::where(
            'id_servicio',
            $datos['id_servicio']
        )->where('estado', 'Activo')->firstOrFail();

        $duracion = $this->obtenerDuracionMinutos(
            $servicio->duracion_estimada ?? ''
        );

        if ($duracion <= 0) {
            throw new \InvalidArgumentException(
                'La duración del servicio debe ser mayor que cero.'
            );
        }

        $fin = $inicio->copy()->addMinutes($duracion);

        if ($this->existeSolapamiento(
            $datos['id_tatuador'],
            $inicio,
            $fin
        )) {
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

    }, 3);
}
public function update(Request $request, $id)
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

    $inicio = Carbon::parse(
        $datos['fecha_cita'] . ' ' . $datos['hora'],
        'America/Bogota'
    );

    if ($inicio->lte(Carbon::now('America/Bogota'))) {
        return response()->json([
            'mensaje' => 'La cita debe programarse en un horario futuro.'
        ], 422);
    }

    return DB::transaction(function () use (
        $datos,
        $request,
        $inicio,
        $id
    ) {

        Tatuador::where(
            'id_tatuador',
            $datos['id_tatuador']
        )->lockForUpdate()->firstOrFail();

        $cita = Cita::where(
            'id_cliente',
            $request->user()->id_cliente
        )->lockForUpdate()->findOrFail($id);

        if ($cita->estado_cita !== 'Pendiente') {
            return response()->json([
                'mensaje' => 'Solo se pueden modificar citas pendientes.'
            ], 409);
        }

        $servicio = Servicio::where(
            'id_servicio',
            $datos['id_servicio']
        )->where('estado', 'Activo')->firstOrFail();

        $duracion = $this->obtenerDuracionMinutos(
            $servicio->duracion_estimada ?? ''
        );

        if ($duracion <= 0) {
            throw new \InvalidArgumentException(
                'La duración del servicio debe ser mayor que cero.'
            );
        }

        $fin = $inicio->copy()->addMinutes($duracion);

        if ($this->existeSolapamiento(
            $datos['id_tatuador'],
            $inicio,
            $fin,
            $cita->id_cita
        )) {
            return response()->json([
                'mensaje' => 'El tatuador ya tiene una cita en ese horario.'
            ], 409);
        }

        $cita->update([
            'fecha_cita' => $datos['fecha_cita'],
            'hora' => $datos['hora'],
            'id_tatuador' => $datos['id_tatuador'],
            'id_servicio' => $datos['id_servicio']
        ]);

        return response()->json([
            'mensaje' => 'Cita actualizada correctamente.',
            'cita' => $cita->load(['tatuador', 'servicio'])
        ], 200);

    }, 3);
}

public function destroy(Request $request, $id)
{
    return DB::transaction(function () use ($request, $id) {

        $cita = Cita::where('id_cita', $id)
            ->where('id_cliente', $request->user()->id_cliente)
            ->lockForUpdate()
            ->firstOrFail();

        if (!in_array($cita->estado_cita, [
            'Pendiente',
            'Confirmada'
        ])) {
            return response()->json([
                'mensaje' => 'La cita no se puede cancelar en su estado actual.'
            ], 409);
        }

        $cita->estado_cita = 'Cancelada';
            $fechaHoraCita = Carbon::parse(
    $cita->fecha_cita . ' ' . $cita->hora
);

if ($fechaHoraCita->lessThanOrEqualTo(Carbon::now())) {
    return response()->json([
        'mensaje' => 'No se puede cancelar una cita vencida.'
    ], 409);
}
        $cita->save();

        return response()->json([
            'mensaje' => 'Cita cancelada correctamente.',
            'cita' => $cita->load(['tatuador', 'servicio'])
        ], 200);
    });
}

}