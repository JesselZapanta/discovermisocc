<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminStoreFacilatatorRequest;
use App\Http\Requests\Admin\AdminStoreUserRequest;
use App\Http\Requests\Admin\AdminUpdateFacilatatorRequest;
use App\Http\Requests\Admin\AdminUpdateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;


class AdminFacilatatorController extends Controller
{
        public function index()
    {
        return inertia('Admin/Facilatator/Index');
    }

    public function getdata(Request $request)
    {
        return User::where('id', '!=', Auth::user()->id)
                    ->whereIn('role', [0, 2])
                    ->where(function($query) use ($request) {
                        $query->where('name', 'like', "{$request->search}%")
                                ->orWhere('email', 'like', "{$request->search}%");
                    })
                    ->orderBy($request->sortField, $request->sortOrder)
                    ->paginate(10);
    }

    public function tempUpload(Request $request){
        $request->validate([
            'avatar' => ['mimes:jpg,jpeg,png']
        ]);
        
        $file = $request->avatar;
        $fileGenerated = md5($file->getClientOriginalName() . time());
        $imageName = $fileGenerated . '.' . $file->getClientOriginalExtension();
        $imagePath = $file->storeAs('temp', $imageName, 'public');
        $name = explode('/', $imagePath);
        return $name[1];
    }

    public function removeUpload($fileName){

        // return $fileName;
        if (Storage::disk('public')->exists('temp/' . $fileName)) {
            Storage::disk('public')->delete('temp/' . $fileName);

            return response()->json([
                'status' => 'remove'
            ], 200);
        }
    }

    public function replaceUpload($id, $fileName){
        $data = User::find($id);
        $oldAvatar = $data->avatar;

        // return $oldAvatar;
        $data->avatar = null;
        $data->save();

        if (Storage::disk('public')->exists('avatars/' . $oldAvatar)) {
            Storage::disk('public')->delete('avatars/' . $oldAvatar);

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
    

    public function store(AdminStoreFacilatatorRequest $request)
    {
        $data = $request->validated();

        if(!empty($data['avatar']) && isset($request->avatar[0]['response'])){
            $imgFilename = $request->avatar[0]['response'];
            $data['avatar'] = $imgFilename;

            $data['password'] = bcrypt($data['password']);

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'avatars/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        //default

        $data['type'] = 0;
        $data['country'] = 138;
        $data['region'] = 100000000;
        $data['province'] = 104200000;

        User::create($data);
        
        return response()->json([
            'status' => 'created'
        ], 200);
    }

    public function update(AdminUpdateFacilatatorRequest $request, $id)
    {
        $data = $request->validated();

        $user = User::findOrFail($id);

        // Handle password
        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        // Handle avatar
        if (!empty($data['avatar']) && isset($request->avatar[0]['response'])) {
            $imgFilename = $request->avatar[0]['response'];
            $data['avatar'] = $imgFilename;

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'avatars/' . $imgFilename);
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        } else {
            unset($data['avatar']); // Do not modify the avatar if none is provided
        }

        $user->update($data);

        return response()->json([
            'status' => 'updated'
        ], 200);
    }


    public function destroy(string $id)
    {
        $user = User::findOrFail($id);

        if (!empty($user->avatar)) {
            if (Storage::disk('public')->exists('avatars/' . $user->avatar)) {
                Storage::disk('public')->delete('avatars/' . $user->avatar);
            }
        }

        $user->delete();

        return response()->json([
            'status' => 'deleted'
        ], 200);
    }
}
