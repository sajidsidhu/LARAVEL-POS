<?php

namespace App\Http\Controllers\Sma\People;

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Tec\Actions\SaveUser;
use App\Models\Sma\Setting\Store;
use App\Http\Resources\Collection;
use App\Http\Controllers\Controller;
use App\Models\Sma\Setting\CustomField;
use App\Http\Requests\Sma\People\UserRequest;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->input('filters');

        return Inertia::render('Sma/People/User/Index', [
            'roles'         => Role::get(),
            'custom_fields' => CustomField::ofModel('user')->get(),
            'stores'        => Store::active()->get(['id as value', 'name as label']),

            'pagination' => new Collection(User::with([
                'settings', 'roles:id,name', 'store:id,name', 'stores:id,name',
            ])->filter($filters)->latest()->orderBy('name')->paginate()->withQueryString()),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        $user = (new SaveUser)->execute($request->validated());

        return redirect()->route('users.index')
            ->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('User'),
                'action' => __('created'),
            ]));
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $user;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserRequest $request, User $user)
    {
        $user = (new SaveUser)->execute($request->validated(), $user);

        return redirect()->route('users.index')
            ->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('User'),
                'action' => __('updated'),
            ]));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->{$user->deleted_at ? 'forceDelete' : 'delete'}()) {
            return back()->with('message', __('{model} has been successfully {action}.', [
                'model'  => __('User'),
                'action' => __('deleted'),
            ]));
        }

        return back()->with('error', __('{model} cannot be {action}.', [
            'model'  => __('User'),
            'action' => __('deleted'),
        ]));
    }

    public function destroyMany(Request $request)
    {
        $count = 0;
        $failed = count($request->selection);
        foreach (User::whereIn('id', $request->selection)->get() as $record) {
            $record->{$request->force ? 'forceDelete' : 'delete'}() ? $count++ : '';
        }

        return back()->with('message', __('The task has completed, {count} deleted and {failed} failed.', ['count' => $count, 'failed' => $failed - $count]));
    }

    public function destroyPermanently(User $user)
    {
        if ($user->forceDelete()) {
            return to_route('users.index')->with('message', __('{record} has been {action}.', ['record' => 'User', 'action' => 'permanently deleted']));
        }

        return back()->with('error', __('The record can not be deleted.'));
    }
}
