<?php

namespace App\Tec\Observers;

use App\Models\Sma\Order\Expense;
use App\Models\Sma\People\Supplier;

class ExpenseObserver
{
    /**
     * Handle the Expense "saved" event.
     */
    public function saved(Expense $expense): void
    {
        if ($expense->supplier_id && ($expense->wasRecentlyCreated || $expense->isDirty(['supplier_id', 'amount']))) {
            $expense->supplier->increaseBalance($expense->amount, [
                'reference'   => $expense,
                'description' => __('Sync balance for {expense}', ['expense' => '<a class="link" href="' . route('expenses.index', ['id' => $expense->id], false) . '">' . (__('Expense') . ' #' . $expense->id) . '</a>']),
            ]);
        }
    }

    /**
     * Handle the Expense "updated" event.
     */
    public function updating(Expense $expense): void
    {
        if ($expense->getOriginal('supplier_id') && $expense->isDirty(['supplier_id', 'amount'])) {
            $supplier = Supplier::find($expense->getOriginal('supplier_id'));
            $supplier->decreaseBalance($expense->getOriginal('amount'), [
                'reference'   => $expense,
                'description' => __('Reset balance for {expense}', ['expense' => '<a class="link" href="' . route('expenses.index', ['id' => $expense->id], false) . '">' . (__('Expense') . ' #' . $expense->id) . '</a>']),
            ]);
        }
    }

    /**
     * Handle the Expense "deleted" event.
     */
    public function deleted(Expense $expense): void
    {
        if (! $expense->isForceDeleting() && $expense->supplier_id) {
            $expense->supplier->decreaseBalance($expense->amount, [
                'reference'   => $expense,
                'description' => __('Sync balance for {expense}', ['expense' => '<a class="link" href="' . route('expenses.index', ['id' => $expense->id], false) . '">' . (__('Expense') . ' #' . $expense->id) . '</a>']),
            ]);
        }
    }

    /**
     * Handle the Expense "restored" event.
     */
    public function restored(Expense $expense): void
    {
        if ($expense->supplier_id) {
            $expense->supplier->increaseBalance($expense->amount, [
                'reference'   => $expense,
                'description' => __('Sync balance for {expense}', ['expense' => '<a class="link" href="' . route('expenses.index', ['id' => $expense->id], false) . '">' . (__('Expense') . ' #' . $expense->id) . '</a>']),
            ]);
        }
    }
}
