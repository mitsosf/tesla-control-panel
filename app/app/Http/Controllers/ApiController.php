<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    private string $teslaService;

    public function __construct() {
        $this->teslaService = env('TESLA_SERVICE_URL');
    }

    public function moveBackwards(Request $request): Response
    {
//        $token = $request->header('token');
//        /**@var User $user */
//        $user = User::findByToken($token);
//        if (!$user->hasRole('media')) {
//            return new Response('Unauthorized', 401);
//        }

        $response = Http::post($this->teslaService . '/media/track', [
            'step' => -1
        ]);

        return new Response($response->body(), $response->status());

    }
}
