<?php

declare(strict_types=1);

namespace Plugins\Payments;

use InvalidArgumentException;
use Plugins\Payments\Contracts\PaymentInterface;
use Plugins\Payments\Gateways\ExamplePaymentMethod;
use Plugins\Payments\Gateways\AuthorizeNetPaymentMethod;

final class PaymentMethods
{
    /**
     * @var array<class-string<PaymentInterface>, class-string<PaymentInterface>>
     */
    private static array $registry = [
        // ExamplePaymentMethod::class      => ExamplePaymentMethod::class,
        AuthorizeNetPaymentMethod::class => AuthorizeNetPaymentMethod::class,
    ];

    /**
     * @return array<class-string<PaymentInterface>>
     */
    public static function all(): array
    {
        return array_values(self::$registry);
    }

    /**
     * @return array<PaymentInterface>
     */
    public static function resolved(): array
    {
        return array_map(static fn (string $paymentClass): PaymentInterface => app($paymentClass), self::all());
    }

    /**
     * @param  class-string<PaymentInterface>  $paymentClass
     */
    public static function register(string $paymentClass): void
    {
        if (! is_subclass_of($paymentClass, PaymentInterface::class)) {
            throw new InvalidArgumentException(sprintf('Payment method [%s] must implement %s.', $paymentClass, PaymentInterface::class));
        }

        self::$registry[$paymentClass] = $paymentClass;
    }

    /**
     * @param  class-string<PaymentInterface>  $paymentClass
     */
    public static function unregister(string $paymentClass): void
    {
        unset(self::$registry[$paymentClass]);
    }

    public static function find(string $key): ?PaymentInterface
    {
        foreach (self::resolved() as $method) {
            if ($method->key() === $key) {
                return $method;
            }
        }

        return null;
    }

    public static function settingsFields(): array
    {
        $fields = [];

        foreach (self::resolved() as $method) {
            $fields[$method->key()] = [
                'key'    => $method::key(),
                'name'   => $method->displayName(),
                'fields' => $method->settingFields(),
            ];
        }

        return $fields;
    }
}
