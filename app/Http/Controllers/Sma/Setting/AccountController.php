<?php

namespace App\Http\Controllers\Sma\Setting;

use Inertia\Inertia;
use App\Http\Resources\Collection;
use App\Models\Sma\Setting\Account;
use App\Http\Controllers\Controller;
use App\Http\Requests\Sma\Setting\AccountRequest;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Sma/Setting/Account/Index', [
            'types' => Account::$types,

            'pagination' => new Collection(
                Account::latest()->orderBy('title')->paginate()->withQueryString()
            ),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AccountRequest $request)
    {
        $account = Account::create($request->validated());

        return redirect()->route('accounts.index')
            ->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('Account'),
                'action' => __('created'),
            ]));
    }

    /**
     * Display the specified resource.
     */
    public function show(Account $account)
    {
        return $account;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AccountRequest $request, Account $account)
    {
        $account->update($request->validated());

        return redirect()->route('accounts.index')
            ->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('Account'),
                'action' => __('updated'),
            ]));
    }

    /**
     * Display a usage statement of the resource.
     */
    public function statement(Account $account)
    {
        return Inertia::render('Sma/Setting/Account/Statement', [
            'account'    => $account,
            'pagination' => new Collection(
                $account->tracks()->orderByDesc('id')->paginate()->withQueryString()
            ),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Account $account)
    {
        if ($account->{$account->deleted_at ? 'forceDelete' : 'delete'}()) {
            return back()->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('Account'),
                'action' => __('deleted'),
            ]));
        }

        return back()->with('error', __('{model} cannot be {action}.', [
            'model'  => __('Account'),
            'action' => __('deleted'),
        ]));
    }
}
