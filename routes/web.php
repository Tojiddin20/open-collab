<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [HomeController::class, 'index']);

Route::get('/login', static fn () => view('login'));
Route::get('/logout', [AuthController::class, 'logout']);
Route::get('/dashboard', static fn () => view('dashboard'))->middleware(['auth']);

Route::get('auth/google', [AuthController::class, 'googleRedirect'])->name('google-auth');
Route::get('auth/google/call-back', [AuthController::class, 'googleCallback']);
