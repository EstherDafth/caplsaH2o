<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Usuario extends Model
{
    use SoftDeletes;

    protected $table = 'usuarios';
    protected $primaryKey = 'id_usuarios';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'a_paterno',
        'a_materno',
        'telefono',
        'celular',
        'correo_electronico',
        'roles_tipo_id_rol',
    ];

    public function credencial()
    {
        return $this->hasOne(Credencial::class, 'usuarios_id_usuario');
    }

    public function rol()
    {
        return $this->belongsTo(RolesTipo::class, 'roles_tipo_id_rol');
    }

    public function contratos()
    {
        return $this->hasMany(Contrato::class, 'usuarios_id_usuarios');
    }

    // Relación: un usuario tiene muchas aportaciones
    public function aportaciones()
    {
        return $this->hasMany(Aportacion::class, 'usuarios_id_usuarios');
    }

    public function egresos()
    {
        return $this->hasMany(Egreso::class, 'usuarios_id_usuarios');
    }

    protected static function booted()
    {
        static::deleting(function ($usuario) {
            // Eliminar contratos relacionados
            foreach ($usuario->contratos as $contrato) {

                // Eliminar documentos del contrato
                $contrato->documentos()->delete();

                // Eliminar pagos
                $contrato->pagos()->delete();

                // Eliminar la toma y su dirección
                if ($contrato->tomaAgua) {
                    $toma = $contrato->tomaAgua;

                    if ($toma->direccion) {
                        $toma->direccion->delete();
                    }

                    $toma->delete();
                }

                $contrato->delete();
            }

            // Eliminar aportaciones y egresos
            $usuario->aportaciones()->delete();
            $usuario->egresos()->delete();

        });
    }

}
