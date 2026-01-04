<?php

use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'installed'])->group(function () {
    Route::get('/home', function () {
        return get_module('shop')
            ? to_route('shop.home')
            : redirect('/admin');
    })->name('home');

    Route::redirect('/dashboard', '/admin/dashboard');
    Route::prefix('admin')->group(base_path('routes/groups/sma.php'));
    Route::prefix('views')->group(base_path('routes/groups/public.php'));
    // Route::prefix('commands')->group(base_path('routes/groups/commands.php'));

    if (get_module('pos')) {
        Route::prefix('pos')->group(base_path('routes/groups/pos.php'));
    }
    if (! get_module('shop')) {
        Route::redirect('/', '/admin');
    }
});
