<?php

namespace App\Http\Controllers\Sma;

use Inertia\Inertia;
use App\Tec\Scopes\OfStore;
use Illuminate\Http\Request;
use App\Models\Sma\Order\Sale;
use App\Models\Sma\Order\Expense;
use App\Models\Sma\Order\Payment;
use App\Models\Sma\Order\Purchase;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Concurrency;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Sma/Dashboard');
    }

    public function chart(Request $request)
    {
        // $startTime = microtime(true);

        $data = [];
        $user = $request->user();
        $year = $request->year ?? now()->year;
        $month = now()->parse($year . '-01-01');

        if ($request->type == 'monthly') {
            $month = $month->setMonth($request->month ?? now()->month);

            $start_date = $month->startOfMonth()->startOfDay();
            $end_date = $month->copy()->endOfMonth()->endOfDay();
        } else {
            $start_date = $month->startOfDay();
            $end_date = now()->parse($year . '-12-31')->endOfDay();
        }

        if ($request->type == 'monthly') {
            return $this->monthChart($start_date, $end_date);
        }

        if (! session('selected_store_id', null) && ($user->hasRole('Super Admin') || $user->can('read-all'))) {
            [$sales, $purchases, $payments, $expenses] = Concurrency::run([
                fn () => Sale::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Payment::withoutGlobalScope(OfStore::class)
                    ->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END) as amount, MONTH(date) as month")
                    ->received()->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
            ]);
        } elseif ($user->hasRole('Super Admin') || $user->can('read-all')) {
            [$sales, $purchases, $payments, $expenses] = Concurrency::driver('sync')->run([
                fn () => Sale::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Payment::withoutGlobalScope(OfStore::class)
                    ->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END) as amount, MONTH(date) as month")
                    ->received()->whereBetween('date', [$start_date, $end_date])->ofStore()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
            ]);
        } else {
            [$sales, $purchases, $payments, $expenses] = Concurrency::driver('sync')->run([
                fn () => Sale::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()->ofUser()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()->ofUser()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Payment::withoutGlobalScope(OfStore::class)
                    ->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END) as amount, MONTH(date) as month")
                    ->received()->whereBetween('date', [$start_date, $end_date])->ofStore()->ofUser()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
                fn () => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount) as amount, MONTH(date) as month')
                    ->whereBetween('date', [$start_date, $end_date])->ofStore()->ofUser()
                    ->groupBy('month')->orderBy('month')->get()->pluck('amount', 'month')->toArray(),
            ]);
        }

        for ($i = 1; $i <= 12; $i++) {
            $n = $month->copy()->addMonths($i)->format('n');
            $sales[$n] ??= 0;
            $expenses[$n] ??= 0;
            $payments[$n] ??= 0;
            $purchases[$n] ??= 0;
        }

        ksort($sales);
        ksort($expenses);
        ksort($payments);
        ksort($purchases);
        $data['sales'] = $sales; // ->sortBy('date')->values();
        $data['expenses'] = $expenses; // ->sortBy('date')->values();
        $data['payments'] = $payments; // ->sortBy('date')->values();
        $data['purchases'] = $purchases; // ->sortBy('date')->values();

        $months = [];
        for ($i = 0; $i < 12; $i++) {
            $months[] = now()->startOfYear()->addMonths($i)->format('F');
        }
        $data['categories'] = $months;

        // $endTime = microtime(true);
        // $data['e'] = $endTime - $startTime;

        return $data;
    }

    public function data(Request $request)
    {
        $spark = false;
        $end_date = now()->endOfDay();
        $start_date = now()->parse('2020-01-01')->startOfDay();

        if ($request->days) {
            $spark = true;
            $start_date = now()->subDays($request->days - 1)->startOfDay();
        }

        $user = $request->user();
        if (! session('selected_store_id', null) && ($user->hasRole('Super Admin') || $user->can('read-all'))) {
            $data = Sale::withoutGlobalScope(OfStore::class)
                ->selectRaw('SUM(grand_total) as sales, SUM(paid) as paid')
                ->addSelect(['payments' => Payment::withoutGlobalScope(OfStore::class)
                    ->received()->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END)")->whereBetween('date', [$start_date, $end_date]),
                ])
                ->addSelect(['expenses' => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount)')->whereBetween('date', [$start_date, $end_date]),
                ])
                ->addSelect(['purchases' => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total)')->whereBetween('date', [$start_date, $end_date]),
                ])
                ->whereBetween('date', [$start_date, $end_date])->first();
        } elseif ($user->hasRole('Super Admin') || $user->can('read-all')) {
            $data = Sale::withoutGlobalScope(OfStore::class)
                ->selectRaw('SUM(grand_total) as sales, SUM(paid) as paid')
                ->addSelect(['payments' => Payment::withoutGlobalScope(OfStore::class)
                    ->received()->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END)")->whereBetween('date', [$start_date, $end_date])->ofStore(),
                ])
                ->addSelect(['expenses' => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount)')->whereBetween('date', [$start_date, $end_date])->ofStore(),
                ])
                ->addSelect(['purchases' => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total)')->whereBetween('date', [$start_date, $end_date])->ofStore(),
                ])
                ->whereBetween('date', [$start_date, $end_date])->ofStore()->first();
        } else {
            $data = Sale::selectRaw('SUM(grand_total) as sales, SUM(paid) as paid')
                ->addSelect(['payments' => Payment::received()
                    ->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount ELSE -amount END)")
                    ->whereBetween('date', [$start_date, $end_date]),
                ])
                ->addSelect(['expenses' => Expense::selectRaw('SUM(amount)')
                    ->whereBetween('date', [$start_date, $end_date]),
                ])
                ->addSelect(['purchases' => Purchase::selectRaw('SUM(grand_total)')
                    ->whereBetween('date', [$start_date, $end_date]),
                ])
                ->whereBetween('date', [$start_date, $end_date])->first();
        }

        return response()->json([
            'data'  => $data,
            'spark' => $spark ? $this->spark($user, $start_date, $end_date) : [],
        ]);
    }

    public function spark($user, $start_date, $end_date)
    {
        // dd($user->hasRole('Super Admin'), $user->can('read-all'));
        // $startTime = microtime(true);
        $data = [];
        if (! session('selected_store_id', null) && ($user->hasRole('Super Admin') || $user->can('read-all'))) {
            [$sales, $purchases, $payments, $expenses] = Concurrency::run([
                fn () => Sale::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, date as day')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                fn () => Purchase::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(grand_total) as amount, date as day')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                fn () => Payment::withoutGlobalScope(OfStore::class)
                    ->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END) as amount, date as day")
                    ->received()->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                fn () => Expense::withoutGlobalScope(OfStore::class)
                    ->selectRaw('SUM(amount) as amount, date as day')
                    ->whereBetween('date', [$start_date, $end_date])
                    ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
            ]);
        } else {
            // [$sales, $purchases, $payments, $expenses] = Concurrency::run([
            //     fn () => Sale::selectRaw('SUM(grand_total) as amount, DATE(date) as day')
            //         ->whereBetween('date', [$start_date, $end_date])
            //         ->groupBy('date')->orderBy('date')->get()->pluck('amount', 'day')->toArray(),
            //     fn () => Purchase::selectRaw('SUM(grand_total) as amount, DATE(date) as day')
            //         ->whereBetween('date', [$start_date, $end_date])
            //         ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
            //     fn () => Payment::selectRaw('SUM(amount) as amount, DATE(date) as day')
            //         ->received()->whereBetween('date', [$start_date, $end_date])
            //         ->groupBy('date')->orderBy('date')->get()->pluck('amount', 'day')->toArray(),
            //     fn () => Expense::selectRaw('SUM(amount) as amount, DATE(date) as day')
            //         ->whereBetween('date', [$start_date, $end_date])
            //         ->groupBy('date')->orderBy('date')->get()->pluck('amount', 'day')->toArray(),
            // ]);
            $sales = Sale::selectRaw('SUM(grand_total) as amount, date as day')
                ->whereBetween('date', [$start_date, $end_date])
                ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray();
            $purchases = Purchase::selectRaw('SUM(grand_total) as amount, date as day')
                ->whereBetween('date', [$start_date, $end_date])
                ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray();
            $payments = Payment::selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount
                    ELSE -amount END) as amount, date as day")
                ->received()->whereBetween('date', [$start_date, $end_date])
                ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray();
            $expenses = Expense::selectRaw('SUM(amount) as amount, date as day')
                ->whereBetween('date', [$start_date, $end_date])
                ->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray();
        }

        $days = $end_date->diffInDays($start_date);
        for ($i = 0; $i <= $days; $i++) {
            $date = $start_date->copy()->addDays($i)->format('Y-m-d');
            $sales[$date] ??= 0;
            $expenses[$date] ??= 0;
            $payments[$date] ??= 0;
            $purchases[$date] ??= 0;

            // $sales->where('date', $date)->first() ?? $sales->push(['date' => $date, 'amount' => 0]);
        }

        ksort($sales);
        ksort($expenses);
        ksort($payments);
        ksort($purchases);
        $data['sales'] = $sales; // ->sortBy('date')->values();
        $data['expenses'] = $expenses; // ->sortBy('date')->values();
        $data['payments'] = $payments; // ->sortBy('date')->values();
        $data['purchases'] = $purchases; // ->sortBy('date')->values();

        // $endTime = microtime(true);
        // $data['e'] = $endTime - $startTime;

        return $data;
    }

    private function monthChart($start_date, $end_date): array
    {
        $data = [];

        if (! session('selected_store_id', null)) {
            $data = [
                'sales'    => Sale::withoutGlobalScope('of_store')->selectRaw('SUM(grand_total) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'payments' => Payment::withoutGlobalScope('of_store')->selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount ELSE -amount END) as amount, date as day")->received()->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                // 'due'       => Sale::withoutGlobalScope('of_store')->selectRaw('SUM(grand_total-paid) as amount, date as day')->whereColumn('paid', '<', 'grand_total')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'purchases' => Purchase::withoutGlobalScope('of_store')->selectRaw('SUM(grand_total) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'expenses'  => Expense::withoutGlobalScope('of_store')->selectRaw('SUM(amount) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
            ];
        } else {
            $data = [
                'sales'    => Sale::selectRaw('SUM(grand_total) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'payments' => Payment::selectRaw("SUM(CASE WHEN payment_for = 'Customer' THEN amount ELSE -amount END) as amount, date as day")->received()->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                // 'due'       => Sale::selectRaw('SUM(grand_total-paid) as amount, date as day')->whereColumn('paid', '<', 'grand_total')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'purchases' => Purchase::selectRaw('SUM(grand_total) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
                'expenses'  => Expense::selectRaw('SUM(amount) as amount, date as day')->whereBetween('date', [$start_date, $end_date])->groupBy('day')->orderBy('day')->get()->pluck('amount', 'day')->toArray(),
            ];
        }

        $days = (int) ceil($start_date->diffInDays($end_date));
        for ($i = 0; $i < $days; $i++) {
            $date = $start_date->copy()->addDays($i)->format('Y-m-d');
            $data['sales'][$date] = ($data['sales'][$date] ??= 0) + 0;
            $data['payments'][$date] = ($data['payments'][$date] ??= 0) + 0;
            // $data['due'][$date] = ($data['due'][$date] ??= 0) + 0;
            $data['purchases'][$date] = ($data['purchases'][$date] ??= 0) + 0;
            $data['expenses'][$date] = ($data['expenses'][$date] ??= 0) + 0;
        }

        ksort($data['sales']);
        ksort($data['payments']);
        // ksort($data['due']);
        ksort($data['purchases']);
        ksort($data['expenses']);

        $labels = [];
        for ($i = 0; $i < $days; $i++) {
            $labels[] = $start_date->copy()->addDays($i)->isoFormat('ll');
        }
        $data['categories'] = $labels;

        return $data;
    }
}
