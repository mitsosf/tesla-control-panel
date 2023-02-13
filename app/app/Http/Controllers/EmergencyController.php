<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class EmergencyController extends Controller
{
    private string $teslaService;

    public function __construct() {
        $this->middleware('throttle:emergency');
        $this->teslaService = env('TESLA_SERVICE_URL');
    }

    public function emergencyUnlock(Request $request): Response
    {
        $password = $request->get('pass');
        if ($password != env('EMERGENCY_PASSWORD')) {
            return new Response('Wrong password', 403);
        }

        Http::post($this->teslaService . '/wakeup');
        sleep(30);
        $response = Http::post($this->teslaService . '/unlock');

        return new Response($response->body(), $response->status());
    }

    public function emergencyLock(Request $request): Response
    {
        $password = $request->get('pass');
        if ($password != env('EMERGENCY_PASSWORD')) {
            return new Response('Wrong password', 403);
        }

        Http::post($this->teslaService . '/wakeup');
        sleep(30);
        $response = Http::post($this->teslaService . '/lock');

        return new Response($response->body(), $response->status());
    }
}
