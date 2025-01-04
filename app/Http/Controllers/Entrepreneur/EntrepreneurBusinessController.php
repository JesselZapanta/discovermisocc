<?php

namespace App\Http\Controllers\Entrepreneur;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class EntrepreneurBusinessController extends Controller
{
    public function index()
    {
        return inertia('Entrepreneur/Business/Index');
    }

    public function create()
    {
        return inertia('Entrepreneur/Business/Create');
    }
}
