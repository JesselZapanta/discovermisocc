<?php

namespace App\Http\Controllers\Facilatator;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class FacilatatorDashboardController extends Controller
{
    public function index()
    {
        return inertia('Facilatator/Dashboard');
    } 
}
