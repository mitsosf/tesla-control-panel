<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * @property string $facebook_id
 * @property string $google_id
 */
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
        return $this->belongsToMany('App\Models\Role')->withPivot('expires_at', 'created_at');
    }

    public function hasRole($role = null)
    {
        return !$this->roles->filter(function ($item) use ($role) {
            return $item->name == $role && Carbon::now() < $item->pivot->expires_at;
        })->isEmpty();
    }

    public function addRole($role = null, $indefinite = false)
    {
        // FIXME: When I remove a role and then re-add it immediately, this is triggered somehow
        if ($this->hasRole($role)) {
            return false;
        }

        $this->roles()->attach(Role::where('name', $role)->first(), [
            'expires_at' => $indefinite || $this->hasRole('admin') ?
                Carbon::now()->addCenturies(1) :
                Carbon::now()->addDays(7),
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

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

    public function grantIndefiniteRole($role = null)
    {
        if ($this->hasRole($role)) {
            $old_created_at = Carbon::now();
            foreach ($this->roles as $roleObj) {
                if ($roleObj->name === $role)
                    $old_created_at = $roleObj->pivot->created_at;
            }
            $this->roles()->detach(Role::where('name', $role)->first());
            $this->roles()->attach(Role::where('name', $role)->first(), [
                'expires_at' => Carbon::now()->addCentury(),
                'created_at' => $old_created_at,
                'updated_at' => Carbon::now()
            ]);
            return true;
        }

        return false;
    }

    static function findByToken($token) {
        return User::where('api_token', $token)->first();
    }

    public function provider() {
        if ($this->google_id) {
            return 'google';
        }

        if ($this->facebook_id) {
            return 'facebook';
        }

        return 'uknown';
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
