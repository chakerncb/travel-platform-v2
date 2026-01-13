<?php

namespace App\Filament\Resources\CustomTourBookings\Pages;

use App\Filament\Resources\CustomTourBookings\CustomTourBookingResource;
use App\Mail\CustomTourAdminProposal;
use App\Services\ChargilyPaymentService;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Mail;

class EditCustomTourBooking extends EditRecord
{
    protected static string $resource = CustomTourBookingResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('confirmAndSendPayment')
                ->label('Confirm & Send Payment Link')
                ->icon('heroicon-o-check-circle')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Confirm Custom Tour Booking')
                ->modalDescription('This will generate a payment link and send a confirmation email to the customer.')
                ->visible(fn ($record) => in_array($record->status, ['pending', 'under_review']))
                ->action(function ($record) {
                    try {
                        // Validate that admin price is set
                        if (!$record->admin_price || $record->admin_price <= 0) {
                            Notification::make()
                                ->title('Admin Price Required')
                                ->body('Please set the admin price before confirming the booking.')
                                ->danger()
                                ->send();
                            return;
                        }

                        // Create Chargily payment checkout
                        $chargilyService = app(ChargilyPaymentService::class);
                        $paymentResult = $chargilyService->createCheckout(
                            bookingReference: $record->booking_reference,
                            amount: floatval($record->admin_price),
                            customerEmail: $record->user_email,
                            customerName: $record->user_name,
                            metadata: [
                                'custom_tour_booking_id' => $record->id,
                                'number_of_persons' => $record->number_of_persons,
                                'start_date' => $record->start_date?->format('Y-m-d'),
                                'end_date' => $record->end_date?->format('Y-m-d'),
                            ]
                        );

                        if (!$paymentResult['success']) {
                            Notification::make()
                                ->title('Payment Link Generation Failed')
                                ->body('Failed to create payment link: ' . ($paymentResult['error'] ?? 'Unknown error'))
                                ->danger()
                                ->send();
                            return;
                        }

                        // Update booking with payment URL and status
                        $record->update([
                            'payment_url' => $paymentResult['checkout_url'],
                            'final_price' => $record->admin_price,
                            'status' => 'admin_proposed',
                            'admin_reviewed_at' => now(),
                        ]);

                        // Send email with payment link
                        Mail::to($record->user_email)->send(new CustomTourAdminProposal($record->fresh()));

                        Notification::make()
                            ->title('Confirmation Sent!')
                            ->body('Payment link has been generated and email sent to ' . $record->user_email)
                            ->success()
                            ->send();

                    } catch (\Exception $e) {
                        \Log::error('Failed to confirm custom tour booking', [
                            'error' => $e->getMessage(),
                            'booking_id' => $record->id,
                        ]);

                        Notification::make()
                            ->title('Error')
                            ->body('Failed to process confirmation: ' . $e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
