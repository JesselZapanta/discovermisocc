<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            [
                'code' => '104201000',
                'name' => 'Aloran',
                'description' => null,
            ],
            [
                'code' => '104202000',
                'name' => 'Baliangao',
                'description' => null,
            ],
            [
                'code' => '104203000',
                'name' => 'Bonifacio',
                'description' => null,
            ],
            [
                'code' => '104204000',
                'name' => 'Calamba',
                'description' => null,
            ],
            [
                'code' => '104205000',
                'name' => 'Clarin',
                'description' => null,
            ],
            [
                'code' => '104206000',
                'name' => 'Concepcion',
                'description' => null,
            ],
            [
                'code' => '104207000',
                'name' => 'Jimenez',
                'description' => null,
            ],
            [
                'code' => '104208000',
                'name' => 'Lopez Jaena',
                'description' => null,
            ],
            [
                'code' => '104209000',
                'name' => 'City of Oroquieta',
                'description' => 'Capital city',
            ],
            [
                'code' => '104210000',
                'name' => 'City of Ozamiz',
                'description' => null,
            ],
            [
                'code' => '104211000',
                'name' => 'Panaon',
                'description' => null,
            ],
            [
                'code' => '104212000',
                'name' => 'Plaridel',
                'description' => null,
            ],
            [
                'code' => '104213000',
                'name' => 'Sapang Dalaga',
                'description' => null,
            ],
            [
                'code' => '104214000',
                'name' => 'Sinacaban',
                'description' => null,
            ],
            [
                'code' => '104215000',
                'name' => 'City of Tangub',
                'description' => null,
            ],
            [
                'code' => '104216000',
                'name' => 'Tudela',
                'description' => null,
            ],
            [
                'code' => '104217000',
                'name' => 'Don Victoriano Chiongbian',
                'description' => 'Formerly Don Mariano Marcos',
            ],
        ];

        City::insertOrIgnore($cities);
    }
}
