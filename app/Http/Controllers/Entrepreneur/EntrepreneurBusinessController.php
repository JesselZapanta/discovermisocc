<?php

namespace App\Http\Controllers\Entrepreneur;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EntrepreneurBusinessController extends Controller
{
    public function index()
    {
        return inertia('Entrepreneur/Business/Index');
    }

    public function create ()
    {
        return inertia('Entrepreneur/Business/Create');

    }

    //Uplaods

    //logo

    public function logoTempUpload(Request $request){
        $request->validate([
            'logo' => ['mimes:jpg,jpeg,png']
        ]);
        
        $file = $request->logo;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('temp', $imageName, 'public');
        $name = explode('/', $imagePath);
        return $name[1];
    }

    public function removeLogoUpload($fileName){

        // return $fileName;
        if (Storage::disk('public')->exists('temp/' . $fileName)) {
            Storage::disk('public')->delete('temp/' . $fileName);

            return response()->json([
                'status' => 'remove'
            ], 200);
        }
    }

    public function replaceLogoUpload($id, $fileName){
        $data = Business::find($id);
        $oldLogo = $data->logo;

        // return $oldLogo;
        $data->logo = null;
        $data->save();

        if (Storage::disk('public')->exists('logos/' . $oldLogo)) {
            Storage::disk('public')->delete('logos/' . $oldLogo);

            if (Storage::disk('public')->exists('temp/' . $fileName)) {
                Storage::disk('public')->delete('temp/' . $fileName);
            }

            return response()->json([
                'status' => 'replace'
            ], 200);
        }

        return response()->json([
            'status' => 'error'
        ], 200);
    }
    


    public function store(Request $request)
    {
        return $request;
    }
}
