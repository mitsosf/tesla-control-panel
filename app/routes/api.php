<?php

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth.api.media')->post('/media/track', [ApiController::class, 'track']);
Route::middleware('auth.api.media')->post('/media/togglePlayback', [ApiController::class, 'togglePlayback']);
Route::middleware('auth.api.media')->post('/media/volume', [ApiController::class, 'volume']);

Route::middleware('auth.api.lock')->post('/lock', [ApiController::class, 'lock']);
Route::middleware('auth.api.lock')->post('/unlock', [ApiController::class, 'unlock']);
