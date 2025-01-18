<?php

use App\Http\Controllers\Admin\AdminDashboard;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminFacilatatorController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\AdminCityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Entrepreneur\EntrepreneurBusinessController;
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

    Route::get('/admin/city', [AdminCityController::class, 'index'])->name('admin.city');
    Route::get('/admin/city/getdata', [AdminCityController::class, 'getdata']);
    Route::put('/admin/city/update/{id}', [AdminCityController::class, 'update']);

    Route::get('/admin/facilatator', [AdminFacilatatorController::class, 'index'])->name('admin.facilatator');
    Route::post('/admin/facilatator/store', [AdminFacilatatorController::class, 'store']);
    Route::get('/admin/facilatator/getdata', [AdminFacilatatorController::class, 'getdata']);
    Route::put('/admin/facilatator/update/{id}', [AdminFacilatatorController::class, 'update']);
    Route::delete('/admin/facilatator/destroy/{id}', [AdminFacilatatorController::class, 'destroy']);

    Route::get('/admin/user', [AdminUserController::class, 'index'])->name('admin.user');
    Route::post('/admin/user/store', [AdminUserController::class, 'store']);
    Route::get('/admin/user/getdata', [AdminUserController::class, 'getdata']);
    Route::put('/admin/user/update/{id}', [AdminUserController::class, 'update']);
    Route::delete('/admin/user/destroy/{id}', [AdminUserController::class, 'destroy']);

    Route::post('/avatar-temp-upload', [AdminUserController::class, 'tempUpload']);
    Route::post('/avatar-temp-remove/{filename}', [AdminUserController::class, 'removeUpload']);
    Route::post('/avatar-image-replace/{id}/{filename}', [AdminUserController::class, 'replaceUpload']);
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

    Route::get('/entrepreneur/business', [EntrepreneurBusinessController::class, 'index'])->name('entrepreneur.business');
    Route::get('/entrepreneur/business/create', [EntrepreneurBusinessController::class, 'create'])->name('entrepreneur.business-create');

    //logo
    Route::post('/entrepreneur/logo-temp-upload', [EntrepreneurBusinessController::class, 'logoTempUpload']);
    Route::post('/entrepreneur/logo-temp-remove/{filename}', [EntrepreneurBusinessController::class, 'removeLogoUpload']);
    Route::post('/entrepreneur/logo-image-replace/{id}/{filename}', [EntrepreneurBusinessController::class, 'replaceLogoUpload']);

    //logo
    Route::post('/entrepreneur/mayor-permit-temp-upload', [EntrepreneurBusinessController::class, 'mayorPermitTempUpload']);
    Route::post('/entrepreneur/mayor-permit-temp-remove/{filename}', [EntrepreneurBusinessController::class, 'removeMayorPermitUpload']);
    Route::post('/entrepreneur/mayor-permit-image-replace/{id}/{filename}', [EntrepreneurBusinessController::class, 'replaceMayorPermitUpload']);
    
    //business_permit
    Route::post('/entrepreneur/business-permit-temp-upload', [EntrepreneurBusinessController::class, 'businessPermitTempUpload']);
    Route::post('/entrepreneur/business-permit-temp-remove/{filename}', [EntrepreneurBusinessController::class, 'removeBusinessPermitUpload']);
    Route::post('/entrepreneur/business-permit-image-replace/{id}/{filename}', [EntrepreneurBusinessController::class, 'replaceBusinessPermitUpload']);
    
    //bir
    Route::post('/entrepreneur/bir-temp-upload', [EntrepreneurBusinessController::class, 'birTempUpload']);
    Route::post('/entrepreneur/bir-temp-remove/{filename}', [EntrepreneurBusinessController::class, 'removeBirUpload']);
    Route::post('/entrepreneur/bir-image-replace/{id}/{filename}', [EntrepreneurBusinessController::class, 'replaceBirUpload']);
    
    Route::post('/entrepreneur/business/store', [EntrepreneurBusinessController::class, 'store']);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
