<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        //0 = admin, 1 = tourist, 2 = facilator, 3 entrepreneur
        if(Auth::check()) {
            $role = Auth::user()->role;

            if($role === 0) {
                return redirect()->route('admin.dashboard');
            } else {
                return redirect()->route('dashboard');
            }
        }
    }
}
