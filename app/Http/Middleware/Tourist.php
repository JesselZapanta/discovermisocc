<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Tourist
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        //0 = admin, 1 = tourist, 2 = facilator, 3 entrepreneur
        if(Auth::check() && Auth::user()->role === 1) {
            return $next($request);
        }

        abort(403, 'Unauthorized action.');
    }
}
