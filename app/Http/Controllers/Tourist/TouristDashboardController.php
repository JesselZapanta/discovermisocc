<?php

namespace App\Http\Controllers\Tourist;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TouristDashboardController extends Controller
{
    public function index()
    {
        return inertia('Tourist/Dashboard');
    } 
}
