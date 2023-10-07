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

Route::group(['middleware' => 'guest'], static function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');

    Route::get('/login/google', [AuthController::class, 'google'])->name('google-login');
    Route::get('/login/google/redirect', [AuthController::class, 'googleRedirect']);

    Route::get('/login/github', [AuthController::class, 'github'])->name('github-login');
    Route::get('/login/github/redirect', [AuthController::class, 'githubRedirect']);

    Route::get('/login/facebook', [AuthController::class, 'facebook'])->name('facebook-login');
    Route::get('/login/facebook/redirect', [AuthController::class, 'facebookRedirect']);
});

Route::group(['middleware' => 'auth'], static function () {
    Route::get('/logout', [AuthController::class, 'logout']);
});
