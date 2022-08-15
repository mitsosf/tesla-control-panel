<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DriverApiMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('token');
        if ($token){
            $user = User::findByToken($token);
            if (!empty($user)){
                if ($user->hasRole('driver')){
                    return $next($request);
                }
            }
        }
        return new Response('Unauthorised', 401);
    }
}
