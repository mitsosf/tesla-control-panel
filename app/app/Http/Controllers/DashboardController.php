<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct() {
        $this->middleware('auth');
    }

    public function home() {
        $api_token = Auth::user()->api_token;
        return view('dashboard.home', compact('api_token'));
    }
}
