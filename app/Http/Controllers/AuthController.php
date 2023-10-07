<?php

namespace App\Http\Controllers;

use App\Constants\ExternalAuthenticationSystems;
use App\Models\ExternalAuthentication;
use App\Models\ExternalAuthenticationSystem;
use App\Models\User;
use Exception;
use Illuminate\Contracts\View\View;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller {
    /**
     * @return View
     */
    public function login(): View {
        return view('login');
    }

    /**
     * @return RedirectResponse
     */
    public function logout(): RedirectResponse {
        Auth::logout();
        return redirect('/');
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

            return redirect('/');
        } catch (Throwable $exception) {
            DB::rollBack();
            ddd($exception);
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
