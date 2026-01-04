<?php

namespace App\Providers;

use Exception;
use Carbon\Carbon;
use App\Tec\Events\AttachmentEvent;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use App\Tec\Listeners\AttachmentEventListener;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->extend(
            \Illuminate\Translation\Translator::class,
            fn ($translator) => new \App\Tec\Core\Translator($translator->getLoader(), $translator->getLocale())
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if (! env('APP_INSTALLED', false)) {
            redirect()->to('/install');
        } elseif (function_exists('get_settings')) {
            app()->useLangPath(base_path('lang'));

            Event::listen(
                AttachmentEvent::class,
                AttachmentEventListener::class,
            );

            try {
                $settings = get_settings(['mail', 'payment', 'barcode', 'timezone', 'default_locale', 'captcha_provider', 'captcha_site_key', 'captcha_secret_key', 'fiscal_service_driver']);

                if (($settings['captcha_provider'] ?? null) && ($settings['captcha_site_key'] ?? null) && ($settings['captcha_secret_key'] ?? null)) {
                    config(['captcha.sitekey' => $settings['captcha_site_key']]);
                    config(['captcha.secret' => $settings['captcha_secret_key']]);
                }

                config(['fiscal-services.default' => $settings['fiscal_service_driver'] ?? null]);

                $settings['timezone'] ??= 'UTC';
                config(['app.timezone' => $settings['timezone']]);
                Carbon::setLocale($settings['default_locale'] ?? 'en');

                $mail = (array) ($settings['mail']['mail'] ?? []);
                if (! empty($mail)) {
                    $mail = array_replace_recursive(config('mail'), $mail);
                    config(['mail' => $mail]);
                }

                $services = (array) ($settings['mail']['services'] ?? []);
                if (! empty($services)) {
                    $services = array_replace_recursive(config('services'), $services);
                    config(['services' => $services]);
                }

                $services = (array) ($settings['payment']['services'] ?? []);
                if (! empty($services)) {
                    $services = array_replace_recursive(config('services'), $services);
                    config(['services' => $services]);
                }
            } catch (Exception $e) {
                if (! app()->runningInConsole()) {
                    logger('Provider settings error: ' . $e->getMessage());
                }
            }

            Gate::before(function ($user, $ability) {
                return $user->hasRole('Super Admin') ? true : null;
            });
        }

        if (app()->environment('local', 'testing') || demo()) {
            $this->loadMigrationsFrom(database_path('migrations/dump'));
        }
    }
}
