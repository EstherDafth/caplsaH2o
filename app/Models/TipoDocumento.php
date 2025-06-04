<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumento extends Model
{
    // Nombre exacto de la tabla (si no sigue la convención pluralizada)
    protected $table = 'tipo_documento';

    // Especificar la clave primaria personalizada
    protected $primaryKey = 'idtipo_documento';

    // Si la clave primaria no es autoincremental, descomenta esto:
    // public $incrementing = false;

    // Si no usas timestamps (created_at y updated_at), indícalo:
    public $timestamps = false;

    // Si quieres permitir asignación masiva:
    protected $fillable = ['tipo_documento'];
}
