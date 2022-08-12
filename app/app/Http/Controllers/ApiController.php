<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    private string $teslaService;

    public function __construct() {
        $this->teslaService = env('TESLA_SERVICE_URL');
    }

    public function wakeUp(): Response
    {
        $response = Http::post($this->teslaService . '/wakeup');

        return new Response($response->body(), $response->status());
    }

    public function track(Request $request): Response
    {
        $response = Http::post($this->teslaService . '/media/track', [
            'step' => $request->post('step')
        ]);

        return new Response($response->body(), $response->status());
    }

    public function togglePlayback(): Response
    {
        $response = Http::post($this->teslaService . '/media/playback');

        return new Response($response->body(), $response->status());
    }

    public function volume(Request $request): Response
    {
        $response = Http::post($this->teslaService . '/media/volume', [
            'step' => $request->post('step')
        ]);

        return new Response($response->body(), $response->status());
    }

    public function lock(): Response
    {
        $response = Http::post($this->teslaService . '/lock');

        return new Response($response->body(), $response->status());
    }

    public function unlock(): Response
    {
        $response = Http::post($this->teslaService . '/unlock');

        return new Response($response->body(), $response->status());
    }

    public function start(): Response
    {
        $response = Http::post($this->teslaService . '/start');

        return new Response($response->body(), $response->status());
    }

    public function vehicleClimate(): Response
    {
        $response = Http::post($this->teslaService . '/vehicle/climate/info');
        return new Response($response->body(), $response->status());
    }

    public function climateTemperature(Request $request): Response
    {
        $response = Http::post($this->teslaService . '/climate/temperature', [
            'driver' => $request->post('driver'),
            'passenger' => $request->post('passenger'),
        ]);
        return new Response($response->body(), $response->status());
    }

    public function climateOff(): Response
    {
        $response = Http::post($this->teslaService . '/climate/off');
        return new Response($response->body(), $response->status());
    }

    public function climateSeat(Request $request): Response
    {
        $response = Http::post($this->teslaService . '/climate/seat', [
            'heater' => $request->post('heater'),
            'level' => $request->post('level'),
        ]);
        return new Response($response->body(), $response->status());
    }
}
