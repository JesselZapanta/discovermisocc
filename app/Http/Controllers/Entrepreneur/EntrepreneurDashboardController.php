<?php

namespace App\Http\Controllers\Entrepreneur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EntrepreneurDashboardController extends Controller
{
    public function index()
    {
        return inertia('Entrepreneur/Dashboard');
    } 
}
