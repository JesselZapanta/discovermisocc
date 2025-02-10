<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //0 = admin, 1 = tourist, 2 = facilator, 3 entrepreneur
        
        $users = [
            [
                'name' => 'admin',
                'email' => 'admin@gmail.com',
                'email_verified_at' => now('Asia/Manila'),
                'password' => bcrypt('admin'),
                'role' => 0,
                'status' => 1,
                'country' => 138,
                'type' => 0,
                'avatar' => null,
            ],
            [
                'name' => 'tourist 1',
                'email' => 'tourist1@gmail.com',
                'email_verified_at' => now('Asia/Manila'),
                'password' => bcrypt('tourist'),
                'role' => 1,
                'status' => 1,
                'country' => 138,
                'type' => 0,
                'avatar' => null,
            ],
            [
                'name' => 'facilator 1',
                'email' => 'facilator1@gmail.com',
                'email_verified_at' => now('Asia/Manila'),
                'password' => bcrypt('facilator'),
                'role' => 2,
                'status' => 1,
                'country' => 138,
                'type' => 0,
                'avatar' => null,
            ],
            [
                'name' => 'entrepreneur 1',
                'email' => 'entrepreneur1@gmail.com',
                'email_verified_at' => now('Asia/Manila'),
                'password' => bcrypt('entrepreneur'),
                'role' => 3,
                'status' => 1,
                'country' => 138,
                'type' => 0,
                'avatar' => null,
            ],
        ];

        User::insert($users);
    }
}
