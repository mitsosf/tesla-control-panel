<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class DashboardController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function home() {
        $carName = '';
        try {
            $carName = json_decode(Http::get(env('TESLA_SERVICE_URL').'/name')->body())->name;
        } catch (\Exception $exception) {

        }

        $api_token = Auth::user()->api_token;
        return view('dashboard.home', compact('api_token', 'carName'));
    }
}
