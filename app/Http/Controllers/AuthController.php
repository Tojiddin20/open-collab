<?php

namespace App\Http\Controllers;

use App\Constants\ExternalAuthenticationSystems;
use App\Constants\UserTypes;
use App\Models\ExternalAuthentication;
use App\Models\ExternalAuthenticationSystem;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller {
    /**
     * @param Request $request
     * @return void
     */
    public function registration(Request $request): void {
        $request->validate([
            'name' => 'required|string',
            'type' => 'required|string|in:' . UserTypes::CREATOR . ',' . UserTypes::CONTRIBUTOR,
            'email' => 'required|email',
            'password' => 'required',
        ]);

        User::query()->create([
            'name' => $request->get('name'),
            'type' => $request->get('type'),
            'email' => $request->get('email'),
            'password' => Hash::make($request->get('name')),
        ]);
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function login(Request $request): RedirectResponse {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            return response()->json(['message' => 'Successfully logged in!']);
        }

        return response()->json(['message' => 'Something went wrong...']);
    }

    /**
     * @param Request $request
     * @return RedirectResponse
     */
    public function logout(Request $request): RedirectResponse {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->json(['message' => 'Successfully logged out!']);
    }

    /**
     * @param class-string<ExternalAuthenticationSystems> $system
     * @return RedirectResponse|string
     * @throws Exception
     */
    public function externalLoginRedirectLogic(string $system): RedirectResponse|string {
        DB::beginTransaction();
        try {
            $googleUser = Socialite::driver($system)->stateless()->user();

            $externalAuthentication = ExternalAuthentication::query()
                ->where('authentication_id', '=', $googleUser->getId())
                ->first();

            if (!$externalAuthentication) {
                $externalAuthenticationSystem = ExternalAuthenticationSystem::query()
                    ->where('name', '=', $system)
                    ->first();

                $externalAuthenticationId = ExternalAuthentication::query()->create([
                    'system_id' => $externalAuthenticationSystem->id,
                    'authentication_id' => $googleUser->getId(),
                ])->id;

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

            return redirect('/');
        } catch (Throwable $exception) {
            DB::rollBack();
            return "Something went wrong: {$exception->getMessage()}";
        }
    }

    /**
     * @return RedirectResponse
     */
    public function google(): RedirectResponse {
        return Socialite::driver(ExternalAuthenticationSystems::GOOGLE)->redirect();
    }

    /**
     * @return string|RedirectResponse
     * @throws Exception
     */
    public function googleRedirect(): string|RedirectResponse {
        return $this->externalLoginRedirectLogic(ExternalAuthenticationSystems::GOOGLE);
    }

    /**
     * @return RedirectResponse
     */
    public function github(): RedirectResponse {
        return Socialite::driver(ExternalAuthenticationSystems::GITHUB)->redirect();
    }

    /**
     * @return string|RedirectResponse
     * @throws Exception
     */
    public function githubRedirect(): string|RedirectResponse {
        return $this->externalLoginRedirectLogic(ExternalAuthenticationSystems::GITHUB);
    }

    /**
     * @return RedirectResponse
     */
    public function facebook(): RedirectResponse {
        return Socialite::driver(ExternalAuthenticationSystems::FACEBOOK)->redirect();
    }

    /**
     * @return string|RedirectResponse
     * @throws Exception
     */
    public function facebookRedirect(): string|RedirectResponse {
        return $this->externalLoginRedirectLogic(ExternalAuthenticationSystems::FACEBOOK);
    }
}
