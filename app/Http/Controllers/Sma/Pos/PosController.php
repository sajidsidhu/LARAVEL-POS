<?php

namespace App\Http\Controllers\Sma\Pos;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sma\Pos\Order;
use App\Models\Sma\Order\Sale;
use App\Models\Sma\Setting\Tax;
use Nnjeim\World\Models\Country;
use App\Models\Sma\People\Customer;
use App\Models\Sma\Product\Product;
use App\Http\Controllers\Controller;
use App\Models\Sma\Product\Category;
use Illuminate\Support\Facades\Hash;
use App\Models\Sma\Setting\CustomField;

class PosController extends Controller
{
    /**
     * Display a POS screen.
     */
    public function index(Request $request)
    {
        if (! $request->session()->get('selected_store_id', false)) {
            $request->session()->flash('select_store', true);
            $request->session()->put('select_store_from', $request->fullUrl());
            $request->session()->flash('error', __('Please select a store first!'));

            return back();
        }
        $sale = null;
        $order = null;
        $default_category = get_settings('default_category');
        $customer = $request->customer_id ? Customer::find($request->input('customer_id')) : null;
        if ($request->sale) {
            $sale = Sale::withCount('returnOrders')->with([
                'attachments', 'items.variations', 'items.product',
                'store', 'customer', 'payments:id,date,amount,method,reference',
                'items.unit:id,code,name', 'user:id,name',
            ])->find($request->input('sale'));
        }
        if ($request->order) {
            $order = Order::find($request->input('order'));
        }

        $design = get_settings('pos_design') ?? 'Modern';

        return Inertia::render('Sma/Pos/' . ($design == 'Modern' ? 'Modern' : 'Simple'), [
            'sale'            => $sale,
            'order'           => $order,
            'customer'        => $customer,
            'taxes'           => Tax::all(),
            'custom_fields'   => CustomField::ofModel('sale')->get(),
            'customer_fields' => CustomField::ofModel('customer')->get(),
            'countries'       => Country::with('states:id,name,country_id')->get(),
            'categories'      => Category::select(['id', 'name', 'photo'])->withCount('products')->onlyParent()->with(['children' => fn ($q) => $q->select(['id', 'name', 'photo', 'category_id'])->has('childProducts')->withCount('childProducts')])->orderBy('order')->get(),
            'products'        => Product::with('storeStock')->whereRelation('category', 'id', $default_category)->get(),
        ]);
    }

    public function customerView(Request $request)
    {
        // $design = get_settings('pos_design') ?? 'Modern';

        return Inertia::render('Sma/Pos/CustomerView', [
            'pos_settings' => [
                'customer_view_heading' => get_settings('customer_view_heading'),
                'customer_view_message' => __(get_settings('customer_view_message') ?? '', [
                    'company' => get_settings('name'),
                    'user'    => '<span class="font-bold">' . $request->user()?->name . '</span>',
                ]),
            ],
        ]);
    }

    /**
     * Get user's POS orders.
     */
    public function orders(Request $request)
    {
        return response()->json($request->user()->orders()->ofStore()->oldest()->paginate());
    }

    public function products($category)
    {
        return response()->json(Product::where('category_id', $category)->orWhere('subcategory_id', $category)->get());
    }

    public function product(Product $product)
    {
        return response()->json($product->load('selectedStore'));
    }

    public function verifyPinCode(Request $request)
    {
        $pin = get_settings('pin_code');
        if (! $pin || ! $request->pin_code || ! Hash::check($request->pin_code, $pin)) {
            return response()->json(['success' => false, 'message' => __('Invalid PIN code!')], 422);
        }

        return response()->json(['success' => true, 'message' => __('PIN code verified successfully!')]);
    }
}
