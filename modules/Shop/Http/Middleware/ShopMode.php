<?php

namespace Modules\Shop\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Modules\Shop\Models\ShopCartItem;

class ShopMode
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        if (! $request->cookie('cart_id')) {
            $cartId = ShopCartItem::ofUser($user)->first()?->id ?: str()->uuid();
            cookie()->queue(cookie()->forever('cart_id', $cartId));
        }
        if ($user && $user->hasRole('Super Admin')) {
            return $next($request);
        }

        $settings = get_settings('general');
        if (($settings['shop_mode'] ?? null) != 'maintenance' && $user) {
            return $next($request);
        }

        return match ($settings['shop_mode'] ?? null) {
            'private'     => redirect()->route('shop.private'),
            'maintenance' => redirect()->route('shop.maintenance'),
            default       => $next($request),
        };
    }
}
