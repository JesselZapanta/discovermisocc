<?php

namespace App\Http\Controllers\Entrepreneur;

use App\Http\Controllers\Controller;
use App\Http\Requests\Entrepreneur\EntrepreneurStoreBusinessRequest;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class EntrepreneurBusinessController extends Controller
{
    public function index()
    {
        return inertia('Entrepreneur/Business/Index');
    }

    public function getdata(Request $request)
    {
        return Business::where('user_id',  Auth::user()->id)
                    ->where(function($query) use ($request) {
                        $query->where('name', 'like', "{$request->search}%")
                                ->orWhere('email', 'like', "{$request->search}%");
                    })
                    ->orderBy($request->sortField, $request->sortOrder)
                    ->paginate(10);
    }

    public function create ()
    {
        return inertia('Entrepreneur/Business/Create');

    }

    public function edit ($id)
    {
        $business = Business::findOrFail($id);
        // return $business;
        return inertia('Entrepreneur/Business/Create', [
            'business'  => $business,
        ]);
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

    //bir

    public function birTempUpload(Request $request){
        $request->validate([
            'bir_clearance' => ['mimes:pdf']
        ]);
        
        $file = $request->bir_clearance;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('temp', $imageName, 'public');
        $name = explode('/', $imagePath);
        return $name[1];
    }

    public function removeBirUpload($fileName){

        // return $fileName;
        if (Storage::disk('public')->exists('temp/' . $fileName)) {
            Storage::disk('public')->delete('temp/' . $fileName);

            return response()->json([
                'status' => 'remove'
            ], 200);
        }
    }

    public function replaceBirUpload($id, $fileName){
        $data = Business::find($id);
        $oldBirClearance = $data->bir_clearance;

        // return $oldBirClearance;
        $data->bir_clearance = null;
        $data->save();

        if (Storage::disk('public')->exists('bir_clearance/' . $oldBirClearance)) {
            Storage::disk('public')->delete('bir_clearance/' . $oldBirClearance);

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



    public function store(EntrepreneurStoreBusinessRequest $request)
    {
        $data = $request->validated();

        //logo
        if(!empty($data['logo']) && isset($request->logo[0]['response'])){
            $imgFilename = $request->logo[0]['response'];
            $data['logo'] = $imgFilename;

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'logos/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        //mayor_permit
        if(!empty($data['mayor_permit']) && isset($request->mayor_permit[0]['response'])){
            $imgFilename = $request->mayor_permit[0]['response'];
            $data['mayor_permit'] = $imgFilename;

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'mayor_permit/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        //business_permit
        if(!empty($data['business_permit']) && isset($request->business_permit[0]['response'])){
            $imgFilename = $request->business_permit[0]['response'];
            $data['business_permit'] = $imgFilename;

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'business_permit/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        //bir_clearance
        if(!empty($data['bir_clearance']) && isset($request->bir_clearance[0]['response'])){
            $imgFilename = $request->bir_clearance[0]['response'];
            $data['bir_clearance'] = $imgFilename;

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'bir_clearance/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        $data['user_id'] = Auth::user()->id;

        Business::create($data);

        return response()->json([
            'status' => 'created'
        ], 200);
    }
}
