<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TomaAgua extends Model
{
    use SoftDeletes;
    protected $table = 'toma_agua';
    protected $primaryKey = 'idtoma_agua';
    public $incrementing = true;
    public $timestamps = false;

    protected $fillable = [
        'tipo_toma',
        'estatus',
        'direccion_toma_iddireccion',
    ];

    // Relación con la dirección
    public function direccion()
    {
        return $this->belongsTo(DireccionToma::class, 'direccion_toma_iddireccion', 'iddireccion');
    }

    // Relación con contratos
    public function contratos()
    {
        return $this->hasMany(Contrato::class, 'toma_agua_idtoma_agua', 'idtoma_agua');
    }

    // Puedes acceder al cliente desde la dirección relacionada
    public function cliente()
    {
        return $this->direccion ? $this->direccion->cliente() : null;
    }

}
