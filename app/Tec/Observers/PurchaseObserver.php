<?php

namespace App\Tec\Observers;

use App\Tec\Events\PurchaseEvent;
use App\Models\Sma\Order\Purchase;

class PurchaseObserver
{
    /**
     * Handle the Purchase "deleting" event.
     */
    public function deleting(Purchase $purchase): void
    {
        if (! $purchase->isForceDeleting()) {
            event(new PurchaseEvent(new Purchase, $purchase));
        }
    }

    /**
     * Handle the Purchase "restored" event.
     */
    public function restored(Purchase $purchase): void
    {
        event(new PurchaseEvent($purchase));
    }
}
