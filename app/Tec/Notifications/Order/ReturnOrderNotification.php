<?php

namespace App\Tec\Notifications\Order;

use Illuminate\Bus\Queueable;
use Illuminate\Support\Facades\URL;
use App\Models\Sma\Order\ReturnOrder;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class ReturnOrderNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public ReturnOrder $return_order) {}

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
        $url = URL::signedRoute('return_order.show', $this->return_order->id);

        return (new MailMessage)
            ->subject('Return Order from ' . $site_name)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line(__('Please view the return order by clicking the link below.'))
            ->action(__('View {x}', ['x' => __('Return Order')]), $url)
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
