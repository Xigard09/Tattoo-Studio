<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Registro de clientes
    public function registro(Request $request)
    {
        $datos = $request->validate([
            'nombre' => 'required|string|max:100',
            'telefono' => 'nullable|string|max:30',
            'correo' => 'required|email|max:100|unique:cliente,correo',
            'password' => 'required|string|min:8|max:72|confirmed'
        ]);

        $cliente = Cliente::create([
            'nombre' => $datos['nombre'],
            'telefono' => $datos['telefono'] ?? null,
            'correo' => $datos['correo'],
            'password' => $datos['password'],
            'fecha_registro' => now()->toDateString()
        ]);

        return response()->json([
            'mensaje' => 'Cliente registrado correctamente',
            'cliente' => $cliente
        ], 201);
        
    }
    // Cierre de sesion
public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();

    return response()->json([
        'mensaje' => 'Sesion cerrada correctamente'
    ], 200);
}
    // Inicio de sesion
    public function login(Request $request)
    {
        $datos = $request->validate([
            'correo' => 'required|email|max:100',
            'password' => 'required|string|max:72'
        ]);

        $cliente = Cliente::where(
            'correo', $datos['correo']
        )->first();

        if (!$cliente || !$cliente->password ||
            !Hash::check($datos['password'], $cliente->password)) {

            return response()->json([
                'mensaje' => 'Correo o contraseña incorrectos'
            ], 401);
        }

        $token = $cliente->createToken(
            'tattoo-studio-token'
        )->plainTextToken;

        return response()->json([
            'mensaje' => 'Inicio de sesión exitoso',
            'cliente' => $cliente,
            'token' => $token,
            'tipo_token' => 'Bearer'
        ], 200);
    }
}