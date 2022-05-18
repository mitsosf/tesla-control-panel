<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'facebook_id',
        'avatar',
        'api_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function roles(){
        return $this->belongsToMany('App\Role');
    }

    public function hasRole($role = null)
    {
        return !$this->roles->filter(function ($item) use ($role) {
            return $item->name == $role;
        })->isEmpty();
    }

    public function addRole($role = null)
    {
        if ($this->hasRole($role)) {
            return false;
        }

        $this->roles()->attach(Role::where('name', $role)->first(), ['created_at' => Carbon::now(), 'updated_at' => Carbon::now()]);
        return true;
    }

    public function removeRole($role = null)
    {
        if ($this->hasRole($role)) {
            $this->roles()->detach(Role::where('name', $role)->first());
            return true;
        }

        return false;
    }

    static function findByToken($token){
        return User::where('api_token', $token)->first();
    }

    public static function generateApiToken(): string
    {
        $characters = '0123456789abcdef';
        $charactersLength = strlen($characters);
        $api_token = '';
        for ($i = 0; $i < 50; $i++) {
            try {
                $api_token .= $characters[random_int(0, $charactersLength - 1)];
            } catch (\Exception $e) {
                return $e->getMessage();
            }
        }

        return $api_token;
    }
}
