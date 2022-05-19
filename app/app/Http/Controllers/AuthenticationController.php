<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Laravel\Socialite\Facades\Socialite;

class AuthenticationController extends Controller
{
    public function login() {
        $carName = '';
        try {
            $carName = json_decode(Http::get(env('TESLA_SERVICE_URL').'/name')->body())->name;
        } catch (\Exception $exception) {

        }

        return view('login', compact('carName'));
    }

    public function google()
    {
        $googleUser = Socialite::driver('google')->stateless()->user();
        $user = User::updateOrCreate([
            'google_id' => $googleUser->getId()
        ], [
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'avatar' => $googleUser->getAvatar(),
            'api_token' => User::generateApiToken()
        ]);

        $user->roles->attach(1);

        //TODO REMOVE BEFORE LAUNCHING TO PROD
        if (env('APP_ENV', 'production') === 'local') {
            $user->roles->attach(2);
            $user->roles->attach(3);
            $user->roles->attach(4);
            $user->roles->attach(5);
        }

        Auth::login($user);

        return redirect('/dashboard');
    }

    public function facebook()
    {
        $facebookUser = Socialite::driver('facebook')->stateless()->user();
        $user = User::updateOrCreate([
            'facebook_id' => $facebookUser->id,
        ], [
            'name' => $facebookUser->name,
            'email' => $facebookUser->email,
            'avatar' => $facebookUser->getAvatar(). "&access_token={$facebookUser->token}",
            'api_token' => User::generateApiToken()
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    }

    public function logout()
    {
        Auth::logout();
        return redirect(route('login'));
    }
}
