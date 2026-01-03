<?php

namespace App\Filament\Resources\Bookings\Pages;

use App\Filament\Resources\Bookings\BookingResource;
use App\Mail\BookingConfirmed;
use App\Services\ChargilyPaymentService;
use Filament\Actions;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class EditBooking extends EditRecord
{
    protected static string $resource = BookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\Action::make('confirm')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->visible(fn () => $this->record->status === 'pending')
                ->action(function () {
                    $chargilyService = app(ChargilyPaymentService::class);
                    
                    // Confirm the booking
                    $this->record->confirm();

                    // Create payment checkout
                    $paymentResult = $chargilyService->createCheckout(
                        bookingReference: $this->record->booking_reference,
                        amount: floatval($this->record->total_price),
                        customerEmail: $this->record->contact_email,
                        customerName: $this->record->contact_first_name . ' ' . $this->record->contact_last_name,
                        metadata: [
                            'booking_id' => $this->record->id,
                            'tour_id' => $this->record->tour_id,
                            'tour_name' => $this->record->tour->title,
                        ]
                    );

                    if (!$paymentResult['success']) {
                        Notification::make()
                            ->danger()
                            ->title('Payment link creation failed')
                            ->body('Booking confirmed but failed to create payment link.')
                            ->send();
                        return;
                    }

                    // Store checkout ID and URL
                    $this->record->update([
                        'payment_transaction_id' => $paymentResult['checkout_id'],
                        'payment_checkout_url' => $paymentResult['checkout_url']
                    ]);

                    // Send email with payment link
                    try {
                        Mail::to($this->record->contact_email)->send(
                            new BookingConfirmed($this->record, $paymentResult['checkout_url'])
                        );
                        
                        Notification::make()
                            ->success()
                            ->title('Booking confirmed successfully')
                            ->body('Payment link sent to customer email.')
                            ->send();
                    } catch (\Exception $e) {
                        Log::error('Failed to send booking confirmed email: ' . $e->getMessage());
                        
                        Notification::make()
                            ->warning()
                            ->title('Email sending failed')
                            ->body('Booking confirmed but failed to send email. Payment URL: ' . $paymentResult['checkout_url'])
                            ->send();
                    }

                    $this->refreshFormData(['status', 'payment_transaction_id']);
                }),
            
            Actions\Action::make('cancel')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->form([
                    TextInput::make('reason')
                        ->label('Cancellation Reason')
                        ->required(),
                ])
                ->visible(fn () => $this->record->status !== 'cancelled')
                ->action(function (array $data) {
                    $this->record->cancel($data['reason']);
                    
                    Notification::make()
                        ->success()
                        ->title('Booking cancelled successfully')
                        ->send();
                        
                    $this->refreshFormData(['status', 'cancelled_at', 'cancellation_reason']);
                }),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }

    protected function getSavedNotificationTitle(): ?string
    {
        return 'Booking updated successfully';
    }
}
