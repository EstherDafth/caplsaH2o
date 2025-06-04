<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Documento extends Model
{
    use SoftDeletes;

    protected $table = 'documento';
    protected $primaryKey = 'iddocumento';

    protected $fillable = [
        'ruta_documento',
        'contrato_idcontrato',
        'tipo_documento_idtipo_documento',
    ];

    public function contrato()
    {
        return $this->belongsTo(Contrato::class, 'contrato_idcontrato');
    }

    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumento::class, 'tipo_documento_idtipo_documento');
    }
}
