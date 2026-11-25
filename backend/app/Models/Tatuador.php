<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tatuador extends Model
{
    protected $table = 'tatuador';

    protected $primaryKey = 'id_tatuador';

    public $timestamps = false;

    public function citas()
    {
        return $this->hasMany(
            Cita::class,
            'id_tatuador',
            'id_tatuador'
        );
    }
}