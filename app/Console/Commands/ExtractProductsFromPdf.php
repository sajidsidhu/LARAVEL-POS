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
    protected $signature = 'extract:products {file} {--output=products.xlsx}';

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

        if (!file_exists($file)) {
            $this->error("File not found: $file");
            return 1;
        }

        $this->info("Parsing PDF: $file");

        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file);
            $text = $pdf->getText();

            $lines = explode("\n", $text);
            $data = [];

            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line)) {
                    continue;
                }

                // Try to split by multiple spaces (tab simulation)
                $columns = preg_split('/\s{2,}/', $line);
                
                // Filter out empty columns
                $columns = array_values(array_filter($columns, function($value) {
                    return trim($value) !== '';
                }));

                if (!empty($columns)) {
                    $data[] = $columns;
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
}
