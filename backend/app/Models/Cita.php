<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    protected $table = 'cita';

    protected $primaryKey = 'id_cita';

    public $timestamps = false;

    protected $fillable = [
        'fecha_cita',
        'hora',
        'estado_cita',
        'id_cliente',
        'id_tatuador',
        'id_servicio'
    ];

    public function cliente()
    {
        return $this->belongsTo(
            Cliente::class,
            'id_cliente',
            'id_cliente'
        );
    }

    public function tatuador()
    {
        return $this->belongsTo(
            Tatuador::class,
            'id_tatuador',
            'id_tatuador'
        );
    }

    public function servicio()
    {
        return $this->belongsTo(
            Servicio::class,
            'id_servicio',
            'id_servicio'
        );
    }
}