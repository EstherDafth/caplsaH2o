<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Usuario;

class Egreso extends Model
{
    use HasFactory;

    protected $table = 'egresos';
    protected $primaryKey = 'id';

    protected $fillable = [
        'concepto',
        'descripcion',
        'monto',
        'estatus',
        'fecha_egreso',
        'comprobante',
        'responsable',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'usuarios_id_usuarios');
    }
}
