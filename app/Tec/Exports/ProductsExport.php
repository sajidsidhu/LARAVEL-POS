<?php

namespace App\Tec\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ProductsExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        return [
            new ProductExport,
            new ProductTaxExport,
            new ProductVariationExport,
            new ComboProductExport,
        ];
    }
}
