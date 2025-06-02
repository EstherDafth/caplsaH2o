<?php

// app/Models/Documento.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    protected $fillable = ['nombre_documento', 'nombre_archivo', 'estatus'];
}

