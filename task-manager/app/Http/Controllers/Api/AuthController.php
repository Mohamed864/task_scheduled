<?php

namespace App\Http\Controllers\Api;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;


class AuthController extends Controller
{
    //user register
    public function register(RegisterRequest $request){

        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json(['user'=>$user], 201);

    }

    //user login
    public function login(LoginRequest $request){

        $credentials = $request->validated();

        $user = User::where('email', $credentials['email'])->first();

         if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        if(!$user->access_token){
            $token = $user->createToken('main')->plainTextToken;
        }



        return response()->json(['user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email], 'token' => $token], 201);
    }

    //get user for dashboard
    public function user(Request $request){
        return $request->user();
    }

    //logout
    public function logout(Request $request){

        $request->user()->currentAccessToken()->delete();
        return response()->json('Logged out successfully', 201);
    }
}
