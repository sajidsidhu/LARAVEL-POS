<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Smalot\PdfParser\Parser;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductsFromPdfExport;

class ExtractProductsFromPdf extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'extract:products {file} {--output=products.xlsx} {--debug}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Extract products from PDF and export to Excel';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $file = $this->argument('file');
        $output = $this->option('output');
        $debug = $this->option('debug');

        if (!file_exists($file)) {
            $this->error("File not found: $file");
            return 1;
        }

        $this->info("Parsing PDF: $file");

        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file);
            $text = $pdf->getText();

            if ($debug) {
                file_put_contents(storage_path('logs/pdf_debug.txt'), $text);
                $this->info("Debug mode: Raw text dumped to storage/logs/pdf_debug.txt");
            }

            $lines = explode("\n", $text);
            $data = [];
            
            $currentCategoryId = '';
            $currentCategoryName = '';

            // Regex to match product lines ending with 5 numerical columns
            // Group 1: Everything before numbers (Code + Description)
            // Group 2: On Hand
            // Group 3: Cost
            // Group 4: Sale
            // Group 5: Cost Total
            // Group 6: Sale Total
            $productPattern = '/^(.*?)\s+([-]?[\d,]+\.\d{2})\s+([-]?[\d,]+\.\d{2})\s+([-]?[\d,]+\.\d{2})\s+([-]?[\d,]+\.\d{2})\s+([-]?[\d,]+\.\d{2})$/';

            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line)) continue;

                // 1. Skip Known Headers
                if (str_contains($line, 'UNITED CORPORATION') || 
                    str_contains($line, 'PRESENT STOCK POSITION') ||
                    str_contains($line, 'Item Code') ||
                    str_contains($line, 'Page ') ||
                    preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $line) || // Date only
                    preg_match('/^\d{1,2}:\d{2}:\d{2}[AP]M$/', $line) // Time only
                   ) {
                    continue;
                }

                // 2. Try to match Product Line
                if (preg_match($productPattern, $line, $matches)) {
                    $codeAndDesc = trim($matches[1]);
                    
                    // If CodeAndDesc is empty, it's likely a summary row with just numbers -> Skip
                    if (empty($codeAndDesc)) {
                        continue;
                    }

                    // Extract Item Code (first word) and Description (rest)
                    // Ensure we handle cases where description might be missing
                    $parts = preg_split('/\s+/', $codeAndDesc, 2);
                    $itemCode = $parts[0] ?? '';
                    $description = $parts[1] ?? '';

                    // If Description is empty or contains "Total" keywords, it might be a summary row
                    // But user said "item code and description is empty" for summary.
                    // However, sometimes summary rows have "Grand Total" in description.
                    // User requirement: "where item code and description is empty, we dont need them".
                    // My logic above checks `empty($codeAndDesc)`.
                    
                    // Also check if it's a "Total" line disguised as a product
                    if (stripos($codeAndDesc, 'Total') !== false) {
                         // Decide if we should skip totals. User said "summary rows where item code and description is empty".
                         // If it says "Sub Total", we should probably skip it too based on context "we dont need them".
                         // But strictly following "empty" rule for now.
                    }

                    $onHand = $this->parseNumber($matches[2]);
                    $cost = $this->parseNumber($matches[3]);
                    $sale = $this->parseNumber($matches[4]);
                    $costTotal = $this->parseNumber($matches[5]);
                    $saleTotal = $this->parseNumber($matches[6]);

                    $data[] = [
                        $currentCategoryId,
                        $currentCategoryName,
                        $itemCode,
                        $description,
                        $onHand,
                        $cost,
                        $sale,
                        $costTotal,
                        $saleTotal
                    ];
                } 
                // 3. If not a product and not a header, assume it's a Category
                else {
                    // Category pattern: "ID Name"
                    // Example: "01 PAINTS"
                    // Check if it looks like a category (Start with non-whitespace, then space, then text)
                    if (preg_match('/^(\S+)\s+(.+)$/', $line, $catMatches)) {
                        $currentCategoryId = $catMatches[1];
                        $currentCategoryName = $catMatches[2];
                    }
                }
            }

            $this->info("Extracted " . count($data) . " lines.");
            $this->info("Exporting to $output...");

            Excel::store(new ProductsFromPdfExport($data), $output);

            $path = storage_path('app/' . $output);
            $this->info("File exported successfully to: $path");

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }

        return 0;
    }

    private function parseNumber($number)
    {
        // Remove commas and convert to float
        return floatval(str_replace(',', '', $number));
    }
}
