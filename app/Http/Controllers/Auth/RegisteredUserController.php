<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UserStoreRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    //for avatar

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

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(UserStoreRequest $request)
    {
        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
        //     'password' => ['required', 'confirmed', Rules\Password::defaults()],
        // ]);

        // $user = User::create([
        //     'name' => $request->name,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        // ]);

        $data = $request->validated();

        if(!empty($data['avatar']) && isset($request->avatar[0]['response'])){
            $imgFilename = $request->avatar[0]['response'];
            $data['avatar'] = $imgFilename;

            $data['password'] = bcrypt(value: $data['password']);

            if (Storage::disk('public')->exists('temp/' . $imgFilename)) {
                // Move the file
                Storage::disk('public')->move('temp/' . $imgFilename, 'avatars/' . $imgFilename); 
                Storage::disk('public')->delete('temp/' . $imgFilename);
            }
        }

        if($data['type'] === 1){
            $data['region'] = null;
            $data['province'] = null;
            $data['city'] = null;
            $data['barangay'] = null;
        }else{
            $data['country'] = 138;
        }
        

        $user = User::create($data);

        event(new Registered($user));

        Auth::login($user);

        return response()->json([
            'status' => 'register'
        ], 200);

        //old
        // return redirect(route('dashboard', absolute: false));
    }
}
