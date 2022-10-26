<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
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

        /**@var User $user*/
        $user = User::updateOrCreate([
            'google_id' => $googleUser->getId()
        ], [
            'name' => $googleUser->name,
            'email' => $googleUser->email,
            'avatar' => $googleUser->getAvatar(),
            'api_token' => User::generateApiToken()
        ]);

        $this->attachRolesToAdmin($user);

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

        $this->attachRolesToAdmin($user);

        Auth::login($user);

        return redirect('/dashboard');
    }

    public function demo()
    {
        $user = User::updateOrCreate([
            'google_id' => Str::random(10),
        ], [
            'name' => 'New user',
            'email' => 'test@test.com',
            'avatar' => '',
            'api_token' => User::generateApiToken()
        ]);

        $this->attachRolesToDemo($user);

        Auth::login($user);

        return redirect('/dashboard');
    }

    private function attachRolesToAdmin(User $user) {

        if ($user->email === 'dimitris@frangiadakis.com') {
            $user->addRole('user', true);
            $user->addRole('media', true);
            $user->addRole('lock', true);
            $user->addRole('climate', true);
            $user->addRole('driver', true);
            $user->addRole('admin', true);
        }
    }

    private function attachRolesToDemo(User $user) {
        $user->addRole('user');
        $user->addRole('media');
        $user->addRole('lock');
        $user->addRole('climate');
        $user->addRole('driver');

    }

    public function logout()
    {
        Auth::logout();
        return redirect(route('login'));
    }
}
