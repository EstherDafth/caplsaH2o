<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Aportacion extends Model
{
use HasFactory;

protected $table = 'aportaciones';
protected $primaryKey = 'idaportaciones';
public $timestamps = false;

protected $fillable = [
'fecha_Aportacion',
'concepto',
'descripcion',
'monto',
'usuarios_id_usuarios'
];

public function usuario()
{
return $this->belongsTo(Usuario::class, 'usuarios_id_usuarios');
}
}
