<?php

use App\Http\Controllers\Admin\AdminDashboard;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Entrepreneur\EntrepreneurDashboardController;
use App\Http\Controllers\Facilatator\FacilatatorDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tourist\TouristDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

//Admin routes

Route::middleware(['auth', 'admin'])->group(callback: function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
});

//Tourist routes

Route::middleware(['auth', 'tourist'])->group(function () {
    Route::get('/tourist/dashboard', [TouristDashboardController::class, 'index'])->name('tourist.dashboard');
});

//Facilatator routes

Route::middleware(['auth', 'facilator'])->group(function () {
    Route::get('/facilator/dashboard', [FacilatatorDashboardController::class, 'index'])->name('facilator.dashboard');
});

//Entrepreneur routes

Route::middleware(['auth', 'entrepreneur'])->group(function () {
    Route::get('/entrepreneur/dashboard', [EntrepreneurDashboardController::class, 'index'])->name('entrepreneur.dashboard');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
