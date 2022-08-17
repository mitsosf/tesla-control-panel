<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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

    public function climateOn(): Response
    {
        $response = Http::post($this->teslaService . '/climate/on');
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

    public function editRoles(Request $request): Response
    {
        Log::debug('Beginning.');
        /**@var User $user */
        $user = User::where('id',$request->post('user_id'))->with('roles')->first();
        $current_roles = [];

        foreach ($user->roles as $role) {
            $current_roles[] = $role->name;
        }

        $updated_roles = $request->post('updated_roles');

        $result = array_diff($current_roles, $updated_roles);

        if (!empty($result) && count($result) === 1) {
            //Role has been removed

            //Remove index
            $result = reset($result);
            $role = Role::where('name', $result)->first();
            $user->removeRole($role->name);

            return new Response(['name' => $role->description, 'status' => 'removed'], 200);
        }

        $result = array_diff($updated_roles, $current_roles);


        if (!empty($result) && count($result) === 1) {
            //Role has been added

            //Remove index
            $result = reset($result);

            $role = Role::where('name', $result)->first();
            $user->addRole($role->name);

            return new Response(['name' => $role->description, 'status' => 'added'], 200);
        }

        return new Response('Sync error, refresh the page and try again', 599);
    }
}
