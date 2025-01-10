<?php

namespace App\Http\Controllers;

use App\Http\Requests\Admin\AdminCityUpdateRequest;
use App\Models\City;
use Illuminate\Http\Request;

class AdminCityController extends Controller
{
    public function index()
    {
        return inertia('Admin/City/Index');
    }

    public function getdata(Request $request)
    {
        return City::where(function($query) use ($request) {
                        $query->where('code', 'like', "{$request->search}%")
                                ->orWhere('name', 'like', "{$request->search}%");
                    })
                    ->orderBy($request->sortField, $request->sortOrder)
                    ->paginate(10);
    }

    public function update(AdminCityUpdateRequest $request, $id)
    {
        $data= $request->validated();


        $city = City::findOrFail($id);

        $city->update($data);
        
        return response()->json([
            'status' => 'updated'
        ], 200);
    }
}
