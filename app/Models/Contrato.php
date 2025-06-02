<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;



class Contrato extends Model
{
    use SoftDeletes;

    protected $table = 'contrato';
    protected $primaryKey = 'idcontrato';
    public $timestamps = false;

    protected $fillable = [
        'numero_contrato',
        'fecha_inicio',
        'fecha_fin',
        'usuarios_id_usuarios',
        'toma_agua_idtoma_agua'
    ];

    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuarios_id_usuarios');
    }

    public function tomaAgua()
    {
        return $this->belongsTo(TomaAgua::class, 'toma_agua_idtoma_agua');
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class, 'contrato_idcontrato');
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class, 'contrato_idcontrato');
    }

    protected static function booted()
    {
        static::deleting(function ($contrato) {

            // Eliminar documentos asociados
            $contrato->documentos()->delete();

            if ($contrato->tomaAgua) {
                $toma = $contrato->tomaAgua;
                $direccion = $toma->direccion;
                $toma->delete();

                if ($direccion) {
                    $direccion->delete();
                }
            }
        });
    }

}
