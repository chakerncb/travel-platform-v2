<?php

namespace App\Filament\Resources\Newsletters\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class NewsletterForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Newsletter Details')
                    ->schema([
                        TextInput::make('subject')
                            ->required()
                            ->maxLength(255)
                            ->label('Subject')
                            ->columnSpanFull(),
                        
                        Textarea::make('content')
                            ->required()
                            ->rows(10)
                            ->label('Content')
                            ->helperText('Write your newsletter content here.')
                            ->columnSpanFull(),
                        
                        Grid::make(2)
                            ->schema([
                                Select::make('status')
                                    ->options([
                                        'draft' => 'Draft',
                                        'scheduled' => 'Scheduled',
                                        'sent' => 'Sent',
                                    ])
                                    ->default('draft')
                                    ->required()
                                    ->native(false)
                                    ->label('Status'),
                                
                                DateTimePicker::make('scheduled_at')
                                    ->label('Schedule For')
                                    ->helperText('Set a date and time to schedule this newsletter')
                                    ->nullable()
                                    ->native(false),
                            ]),
                    ]),

                Section::make('Statistics')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('recipients_count')
                                    ->numeric()
                                    ->default(0)
                                    ->disabled()
                                    ->label('Recipients'),
                                
                                TextInput::make('sent_count')
                                    ->numeric()
                                    ->default(0)
                                    ->disabled()
                                    ->label('Sent'),
                                
                                TextInput::make('failed_count')
                                    ->numeric()
                                    ->default(0)
                                    ->disabled()
                                    ->label('Failed'),
                            ]),
                        
                        DateTimePicker::make('sent_at')
                            ->disabled()
                            ->label('Sent At')
                            ->native(false),
                    ])
                    ->hidden(fn ($record) => !$record),
            ]);
    }
}
