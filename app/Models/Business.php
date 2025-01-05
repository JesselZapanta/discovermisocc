<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    protected $table = 'businesses';
    protected $fillable = [
        'name',
        'email',
        'contact',
        'address',
        'city',
        'latitude',
        'longitude',
        'description',
        'logo',
        'mayor_permit',
        'business_permit',
        'bir_clearance',
    ];
}
