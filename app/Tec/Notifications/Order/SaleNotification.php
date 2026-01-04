<?php

namespace App\Tec\Notifications\Order;

use App\Models\User;
use Illuminate\Bus\Queueable;
use App\Models\Sma\Order\Sale;
use Illuminate\Support\Facades\URL;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class SaleNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Sale $sale) {}

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
        $url = URL::signedRoute('sale.show', $this->sale->id);

        $message = (new MailMessage)
            ->subject('Sale from ' . $site_name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line(__('Please view your sale by clicking the link below.'))
            ->action(__('View {x}', ['x' => __('Sale')]), $url)
            ->line(__('Thank you very much!'))
            ->salutation(str(__('Regards') . ', ' . $site_name)->toHtmlString());

        if ($this->sale->shop) {
            $admins = User::role('Super Admin')->pluck('email');
            $message->cc($admins);
        }

        return $message;
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
