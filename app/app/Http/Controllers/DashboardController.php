<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
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
        $roles= $user->roles;
        $all_roles = Role::all();
        return view('dashboard.user', compact('user', 'roles', 'all_roles', 'api_token'));
    }

    public function deleteUser (User $user) {

        $user->roles()->detach();
        $user->delete();
        return redirect(route('users'));
    }

    public function showRoles() {
        $roles = Auth::user()->roles;

        return view('dashboard.roles', compact('roles'));
    }

    public function grantIndefiniteRoles(User $user) {
        foreach ($user->roles as $role) {
            $user->grantIndefiniteRole($role->name);
        }

        return redirect(route('user.edit', $user->id));
    }


    public function toggleFavorite(User $user) {
        $user->favorite = !$user->favorite;
        $user->update();

        return redirect(route('user.edit', $user->id));
    }

}
