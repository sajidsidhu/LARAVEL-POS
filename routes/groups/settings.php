<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Sma\Setting\TaxController;
use App\Http\Controllers\Sma\Setting\MailController;
use App\Http\Controllers\Sma\Setting\StoreController;
use App\Http\Controllers\Sma\Setting\AccountController;
use App\Http\Controllers\Sma\Setting\PaymentController;
use App\Http\Controllers\Sma\Setting\SettingController;
use App\Http\Controllers\Sma\Setting\CustomFieldController;
use App\Http\Controllers\Sma\Setting\ScaleBarcodeController;

Route::get('/', [SettingController::class, 'index'])->name('settings.index');
Route::post('/', [SettingController::class, 'store'])->name('settings.store');
Route::put('/support', [SettingController::class, 'supportLinks'])->name('settings.support_links');

Route::get('/mail', [MailController::class, 'index'])->name('settings.mail');
Route::post('/mail', [MailController::class, 'store'])->name('settings.mail.store');

Route::get('/payment', [PaymentController::class, 'index'])->name('settings.payment');
Route::post('/payment', [PaymentController::class, 'store'])->name('settings.payment.store');

Route::get('/barcode', [ScaleBarcodeController::class, 'index'])->name('settings.barcode');
Route::post('/barcode', [ScaleBarcodeController::class, 'store'])->name('settings.barcode.store');

Route::get('accounts/{account}/statement', [AccountController::class, 'statement'])->name('accounts.statement');

Route::resources([
    'taxes'         => TaxController::class,
    'stores'        => StoreController::class,
    'accounts'      => AccountController::class,
    'custom_fields' => CustomFieldController::class,
]);
