<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
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

    public function landing() {
        if (Auth::user()->hasRole('user')){
            return redirect('dashboard');
        }
        return view('landing');
    }

    public function users () {
        $users = User::all();
        return view('dashboard.users', compact('users'));
    }

    public function user (User $user) {
        $api_token = Auth::user()->api_token;
        $user->roles;
        $roles = Role::all();
        return view('dashboard.user', compact('user', 'roles', 'api_token'));
    }

}
