<?php

namespace App\Http\Controllers\Sma\Report;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Sma\Setting\Store;
use App\Http\Resources\Collection;
use App\Models\Sma\Product\Product;
use App\Http\Controllers\Controller;
use App\Models\Sma\Product\Category;

class CategoryController extends Controller
{
    public function __invoke(Request $request)
    {
        $filters = $request->input('filters') ?? [];
        // $filters = $request->all('categories', 'store_id', 'start', 'end');

        if (! ($filters['store_id'] ?? null) && session('selected_store_id', null)) {
            $filters['store_id'] = session('selected_store_id');
        }

        // $products = Product::query()
        //     ->select(['products.category_id', 'categories.name'])
        //     ->join('categories', 'categories.id', '=', 'products.category_id')
        //     ->leftJoin('sale_items', 'sale_items.product_id', '=', 'products.id')
        //     ->leftJoin('purchase_items', 'purchase_items.product_id', '=', 'products.id')
        //     ->selectRaw('SUM(purchase_items.quantity) as total_purchased, SUM(purchase_items.total) as total_purchased_amount, SUM(sale_items.quantity) as total_sold, SUM(sale_items.total) as total_sale_amount, SUM(IFNULL(sale_items.cost, 0)*sale_items.quantity) as total_cost')
        //     ->groupBy('products.category_id');
        // // ->having('total_purchased', '>', 0)->orHaving('total_sold', '>', 0);

        $products = Category::query()->select(['id', 'name'])
            ->withSum(['saleItems' => fn ($q) => $q->filter($filters)], 'total')
            ->withSum(['saleItems' => fn ($q) => $q->filter($filters)], 'quantity')
            ->withSum(['purchaseItems' => fn ($q) => $q->filter($filters)], 'total')
            ->withSum(['purchaseItems' => fn ($q) => $q->filter($filters)], 'quantity');

        if ($filters['categories'] ?? null) {
            $products->whereIn('products.category_id', $filters['categories']);
        }

        if ($filters['sort'] ?? null) {
            $products->orderByRaw(str($filters['sort'])->replace(':', ' '));
        }

        // logger(get_sql_query($products));

        return Inertia::render('Sma/Report/Category', [
            'stores'     => Store::all(['id as value', 'name as label']),
            'categories' => Category::onlyParent()->get(['id as value', 'name as label']),
            'pagination' => new Collection(
                $products->orderBy('name')->paginate()->withQueryString()
            ),
        ]);
    }
}
