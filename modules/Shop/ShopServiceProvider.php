<?php

namespace Modules\Shop;

use Livewire\Livewire;
use Modules\Shop\Tec\ShopComposer;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Modules\Shop\Http\Middleware\ShopMode;
use Modules\Shop\Console\Commands\ShopDbSeed;
use Modules\Shop\Http\Middleware\PageShortCode;

class ShopServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void {}

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if (get_module('shop')) {
            $this->registerViews();
            $this->registerRoutes();
            $this->registerCommands();
            $this->registerMiddleware();
            $this->registerLivewireComponents();

            require_once __DIR__ . '/Tec/functions.php';
            // $this->loadJsonTranslationsFrom(__DIR__ . '/lang');
            $this->loadMigrationsFrom(__DIR__ . '/Database/migrations');

            if (app()->environment('local', 'testing') || demo()) {
                $this->loadMigrationsFrom(__DIR__ . '/Database/migrations/dump');
            }
        }
    }

    private function registerViews(): void
    {
        View::composer('*', ShopComposer::class);
        View::addNamespace('shop', __DIR__ . '/resources');
        Blade::anonymousComponentPath(__DIR__ . '/resources/components');
        Blade::componentNamespace('Modules\\Shop\\Http\\Components', 'shop');
    }

    private function registerLivewireComponents(): void
    {
        config([
            'livewire.class_namespace' => 'Modules\\Shop\\Http\\Livewire',
            'livewire.layout'          => 'shop::components.layouts.shop',
            'livewire.view_path'       => base_path('modules/Shop/resources'),
        ]);

        Livewire::setUpdateRoute(function ($handle) {
            return Route::post('/shop/livewire/update', $handle)
                ->middleware(['web']);
        });

        foreach (glob(base_path('modules/Shop/Http/Jet/*.php')) as $path) {
            $filename = str(basename($path))->before('.php');
            $name = 'shop.jet.' . str($filename)->kebab();
            $class = 'Modules\\Shop\\Http\\Jet\\' . $filename;

            Livewire::component($name, $class);
        }
    }

    private function registerCommands(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                ShopDbSeed::class,
            ]);
        }
    }

    private function registerMiddleware(): void
    {
        $router = app('router');
        $router->aliasMiddleware('shopmode', ShopMode::class);
        $router->aliasMiddleware('shortcode', PageShortCode::class);
    }

    private function registerRoutes(): void
    {
        if (get_module('shop')) {
            Route::group([
                'namespace'  => '\\Modules\\Shop\\Http',
                'middleware' => ['installed', 'web'],
            ], function () {
                $this->loadRoutesFrom(__DIR__ . '/routes/web.php');
            });
        }
    }
}
