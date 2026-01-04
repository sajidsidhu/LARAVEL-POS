<?php

namespace App\Tec\Notifications\Order;

use Illuminate\Bus\Queueable;
use App\Models\Sma\Order\Payment;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Payment $payment) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $site_name = get_settings('site_name') ?? config('app.name');
        $url = URL::signedRoute('payment.show', $this->payment->id);

        return (new MailMessage)
            ->subject('Payment ' . ($this->payment->received ? 'Receipt' : 'Request') . ' from ' . $site_name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line(__('Please view the payment by clicking the link below.'))
            ->action(__('View {x}', ['x' => __('Payment')]), $url)
            ->line(__('Thank you very much!'))
            ->salutation(str(__('Regards') . ', ' . $site_name)->toHtmlString());
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
