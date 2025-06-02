<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DireccionToma extends Model
{
    use SoftDeletes;

    protected $table = 'direccion_toma';
    protected $primaryKey = 'iddireccion';
    public $timestamps = false;

    protected $fillable = [
        'codigo_postal',
        'estado',
        'municipio',
        'colonia',
        'calle',
        'numero_interior',
        'numero_exterior',
        'referencias',
    ];

    // Relación con tomas de agua
    public function tomasAgua()
    {
        return $this->hasMany(TomaAgua::class, 'direccion_toma_iddireccion');
    }

    // app/Models/DireccionToma.php

    public function cliente()
    {
        return $this->belongsTo(Cliente::class, 'cliente_id', 'id'); // Ajusta las claves si es necesario
    }
    public function formatoCompleto()
    {
        return "{$this->calle} {$this->numero_exterior}" .
            ($this->numero_interior ? " Int. {$this->numero_interior}" : "") . ", " .
            "{$this->colonia}, {$this->municipio}, {$this->estado}, C.P. {$this->codigo_postal}";
    }

    public function clienteNombre()
    {
        return $this->cliente ? $this->cliente->nombreCompleto() : null;
    }



}
