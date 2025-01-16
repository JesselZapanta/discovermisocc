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
    
      //mayorPermit

    public function mayorPermitTempUpload(Request $request){
        $request->validate([
            'mayor_permit' => ['mimes:pdf']
        ]);
        
        $file = $request->mayor_permit;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('temp', $imageName, 'public');
        $name = explode('/', $imagePath);
        return $name[1];
    }

    public function removeMayorPermitUpload($fileName){

        // return $fileName;
        if (Storage::disk('public')->exists('temp/' . $fileName)) {
            Storage::disk('public')->delete('temp/' . $fileName);

            return response()->json([
                'status' => 'remove'
            ], 200);
        }
    }

    public function replaceMayorPermitUpload($id, $fileName){
        $data = Business::find($id);
        $oldMayorPermit = $data->mayor_permit;

        // return $oldMayorPermit;
        $data->mayor_permit = null;
        $data->save();

        if (Storage::disk('public')->exists('mayor_permit/' . $oldMayorPermit)) {
            Storage::disk('public')->delete('mayor_permit/' . $oldMayorPermit);

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


    //business_permit

    public function businessPermitTempUpload(Request $request){
        $request->validate([
            'business_permit' => ['mimes:pdf']
        ]);
        
        $file = $request->business_permit;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('temp', $imageName, 'public');
        $name = explode('/', $imagePath);
        return $name[1];
    }

    public function removeBusinessPermitUpload($fileName){

        // return $fileName;
        if (Storage::disk('public')->exists('temp/' . $fileName)) {
            Storage::disk('public')->delete('temp/' . $fileName);

            return response()->json([
                'status' => 'remove'
            ], 200);
        }
    }

    public function replaceBusinessPermitUpload($id, $fileName){
        $data = Business::find($id);
        $oldBusinessPermit = $data->business_permit;

        // return $oldBusinessPermit;
        $data->business_permit = null;
        $data->save();

        if (Storage::disk('public')->exists('business_permit/' . $oldBusinessPermit)) {
            Storage::disk('public')->delete('business_permit/' . $oldBusinessPermit);

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
