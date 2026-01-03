<?php

namespace App\Filament\Resources\Bookings\Widgets;

use App\Models\Booking;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class BookingStatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $totalBookings = Booking::count();
        $pendingBookings = Booking::where('status', 'pending')->count();
        $confirmedBookings = Booking::where('status', 'confirmed')->count();
        $cancelledBookings = Booking::where('status', 'cancelled')->count();
        
        $totalRevenue = Booking::where('payment_status', 'paid')->sum('amount_paid');
        $pendingRevenue = Booking::where('payment_status', 'pending')
            ->where('status', '!=', 'cancelled')
            ->sum('total_price');
        
        $thisMonthBookings = Booking::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        
        $lastMonthBookings = Booking::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        
        $monthlyGrowth = $lastMonthBookings > 0 
            ? (($thisMonthBookings - $lastMonthBookings) / $lastMonthBookings) * 100 
            : 0;

        return [
            Stat::make('Total Bookings', $totalBookings)
                ->description(sprintf('%d this month', $thisMonthBookings))
                ->descriptionIcon($monthlyGrowth >= 0 ? 'heroicon-m-arrow-trending-up' : 'heroicon-m-arrow-trending-down')
                ->color($monthlyGrowth >= 0 ? 'success' : 'danger')
                ->chart([7, 8, 6, 10, 12, 9, 15]),

            Stat::make('Pending Bookings', $pendingBookings)
                ->description('Awaiting confirmation')
                ->descriptionIcon('heroicon-o-clock')
                ->color('warning')
                ->url(route('filament.admin.resources.bookings.index', [
                    'tableFilters[status][values][0]' => 'pending'
                ])),

            Stat::make('Confirmed Bookings', $confirmedBookings)
                ->description('Active bookings')
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success'),

            Stat::make('Total Revenue', '$' . number_format($totalRevenue, 2))
                ->description('Paid bookings')
                ->descriptionIcon('heroicon-o-currency-dollar')
                ->color('success')
                ->chart([100, 150, 200, 180, 220, 250, 300]),

            Stat::make('Pending Revenue', '$' . number_format($pendingRevenue, 2))
                ->description('Awaiting payment')
                ->descriptionIcon('heroicon-o-clock')
                ->color('warning'),

            Stat::make('Cancelled Bookings', $cancelledBookings)
                ->description('Total cancellations')
                ->descriptionIcon('heroicon-o-x-circle')
                ->color('danger'),
        ];
    }
}
