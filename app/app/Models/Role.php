<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name, description, created_at'];

    public function users(){
        return $this->belongsToMany('App\Models\User');
    }
}
