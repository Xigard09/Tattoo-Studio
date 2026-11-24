<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Cliente extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'cliente';

    protected $primaryKey = 'id_cliente';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'telefono',
        'correo',
        'password',
        'fecha_registro'
    ];

    protected $hidden = [
        'password'
    ];

    protected $casts = [
        'fecha_registro' => 'date',
        'password' => 'hashed'
    ];
}