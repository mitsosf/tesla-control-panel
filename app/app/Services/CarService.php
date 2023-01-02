<?php

namespace App\Services;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class CarService {
    private string $teslaService;

    public function __construct() {
        $this->teslaService = env('TESLA_SERVICE_URL');
    }
    public function wakeUp(): Response
    {
        $response = Http::post($this->teslaService . '/wakeup');

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
}
