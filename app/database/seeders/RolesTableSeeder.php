<?php

namespace Database\Seeders;

use App\Models\Role;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //User
        $role = new Role();
        $role->name = 'user';
        $role->description = 'Basic user';
        $role->created_at = Carbon::now();
        $role->save();

        //Media
        $role = new Role();
        $role->name = 'media';
        $role->description = 'Media user';
        $role->created_at = Carbon::now();
        $role->save();

        //Climate
        $role = new Role();
        $role->name = 'climate';
        $role->description = 'Climate user';
        $role->created_at = Carbon::now();
        $role->save();

        //Locker
        $role = new Role();
        $role->name = 'locker';
        $role->description = 'Lock user';
        $role->created_at = Carbon::now();
        $role->save();

        //Admin
        $role = new Role();
        $role->name = 'admin';
        $role->description = 'Admin';
        $role->created_at = Carbon::now();
        $role->save();
    }
}
