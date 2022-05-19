<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;

class ApiController extends Controller
{
    private string $teslaService;

    public function __construct() {
        $this->teslaService = env('TESLA_SERVICE_URL');
    }

    public function moveBackwards(): Response
    {
        $response = Http::post($this->teslaService . '/media/track', [
            'step' => -1
        ]);

        return new Response($response->body(), $response->status());

    }
}
