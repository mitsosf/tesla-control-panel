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

Route::middleware('auth.api.lock')->post('/wakeup', [ApiController::class, 'wakeUp']);
Route::middleware('auth.api.lock')->post('/lock', [ApiController::class, 'lock']);
Route::middleware('auth.api.lock')->post('/unlock', [ApiController::class, 'unlock']);

Route::middleware('auth.api.driver')->post('/start', [ApiController::class, 'start']);

Route::middleware('auth.api.climate')->post('/climate', [ApiController::class, 'vehicleClimate']);
Route::middleware('auth.api.climate')->post('/climate/temperature', [ApiController::class, 'climateTemperature']);
Route::middleware('auth.api.climate')->post('/climate/on', [ApiController::class, 'climateOn']);
Route::middleware('auth.api.climate')->post('/climate/off', [ApiController::class, 'climateOff']);
Route::middleware('auth.api.climate')->post('/climate/seat', [ApiController::class, 'climateSeat']);

Route::middleware('auth.api.administrator')->post('/user/roles', [ApiController::class, 'editRoles']);
