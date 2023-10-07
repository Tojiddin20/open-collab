<?php

namespace App\Http\Controllers;

use App\Constants\ExternalAuthenticationSystems;
use App\Models\ExternalAuthentication;
use App\Models\ExternalAuthenticationSystem;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller {
    /**
     * @return RedirectResponse
     */
    public function googleRedirect(): RedirectResponse {
        return Socialite::driver(ExternalAuthenticationSystems::GOOGLE)->redirect();
    }

    /**
     * @return RedirectResponse|null
     */
    public function googleCallback(): RedirectResponse|null {
        DB::beginTransaction();
        try {
            $googleUser = Socialite::driver('google')->user();

            $externalAuthentication = ExternalAuthentication::query()
                ->where('authentication_id', '=', $googleUser->getId())
                ->first();

            if (!$externalAuthentication) {
                $externalAuthenticationSystem = ExternalAuthenticationSystem::query()
                    ->where('name', '=', ExternalAuthenticationSystems::GOOGLE)
                    ->first();

                $externalAuthenticationId = Str::uuid()->toString();
                ExternalAuthentication::query()->create([
                    'id' => $externalAuthenticationId,
                    'system_id' => $externalAuthenticationSystem->id,
                    'authentication_id' => $googleUser->getId(),
                ]);

                $user = User::query()->create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'external_authentication_id' => $externalAuthenticationId,
                ]);
            } else {
                $user = User::query()
                    ->where('external_authentication_id', '=', $externalAuthentication->id)
                    ->first();
            }

            Auth::login($user);

            DB::commit();

            return redirect()->intended('/dashboard');
        } catch (Throwable $exception) {
            DB::rollBack();
            dd($exception->getMessage());
            return null;
        }
    }

    /**
     * @return RedirectResponse
     */
    public function logout(): RedirectResponse {
        Auth::logout();
        return redirect('/login');
    }
}
