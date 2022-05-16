<?php

use App\Http\Controllers\AuthenticationController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
if (env('APP_ENV', 'production') === 'production') {
    URL::forceScheme('https');
}

Route::get('/', function () {
    return redirect(route('login'));
});
Route::get('/login', [AuthenticationController::class, 'login'])->name('login');

Route::get('/auth/google/redirect', function () {
    return Socialite::driver('google')->redirect();
})->name('login.google');
Route::get('/auth/google/callback', [AuthenticationController::class, 'google']);

Route::get('/auth/facebook/redirect', function () {
    return Socialite::driver('facebook')->redirect();
})->name('login.facebook');
Route::get('/auth/facebook/callback', [AuthenticationController::class, 'facebook']);

Route::get('/logout', [AuthenticationController::class, 'logout'])->name('logout');


Route::get('/dashboard', [DashboardController::class, 'home'])->name('dashboard');