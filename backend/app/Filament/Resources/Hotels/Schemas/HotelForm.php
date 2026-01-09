<?php

namespace App\Filament\Resources\Hotels\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class HotelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255),
                                
                                Toggle::make('is_active')
                                    ->label('Active')
                                    ->default(true),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                TextInput::make('city')
                                    ->required()
                                    ->maxLength(255),
                                
                                TextInput::make('country')
                                    ->required()
                                    ->maxLength(255),
                            ]),
                        
                        RichEditor::make('description')
                            ->required()
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'underline',
                                'bulletList',
                                'orderedList',
                                'link',
                                'h2',
                                'h3',
                            ]),
                    ]),
                
                Section::make('Location')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('latitude')
                                    ->required()
                                    ->numeric()
                                    ->step(0.00000001)
                                    ->minValue(-90)
                                    ->maxValue(90)
                                    ->helperText('Enter latitude between -90 and 90'),
                                
                                TextInput::make('longitude')
                                    ->required()
                                    ->numeric()
                                    ->step(0.00000001)
                                    ->minValue(-180)
                                    ->maxValue(180)
                                    ->helperText('Enter longitude between -180 and 180'),
                            ]),
                        
                        Textarea::make('address')
                            ->rows(2)
                            ->maxLength(500)
                            ->columnSpanFull(),
                    ]),
                
                Section::make('Contact & Pricing')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('phone')
                                    ->tel()
                                    ->maxLength(255),
                                
                                TextInput::make('email')
                                    ->email()
                                    ->maxLength(255),
                                
                                TextInput::make('website')
                                    ->url()
                                    ->maxLength(255),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                Select::make('star_rating')
                                    ->label('Star Rating')
                                    ->options([
                                        1 => '1 Star',
                                        2 => '2 Stars',
                                        3 => '3 Stars',
                                        4 => '4 Stars',
                                        5 => '5 Stars',
                                    ])
                                    ->native(false),
                                
                                TextInput::make('price_per_night')
                                    ->label('Price per Night')
                                    ->numeric()
                                    ->prefix('$')
                                    ->step(0.01)
                                    ->minValue(0),
                            ]),
                    ]),
                
                Section::make('Specifications')
                    ->schema([
                        Grid::make(4)
                            ->schema([
                                Toggle::make('specifications.has_wifi')
                                    ->label('WiFi'),
                                
                                Toggle::make('specifications.has_parking')
                                    ->label('Parking'),
                                
                                Toggle::make('specifications.has_pool')
                                    ->label('Pool'),
                                
                                Toggle::make('specifications.has_gym')
                                    ->label('Gym'),
                                
                                Toggle::make('specifications.has_spa')
                                    ->label('Spa'),
                                
                                Toggle::make('specifications.has_restaurant')
                                    ->label('Restaurant'),
                                
                                Toggle::make('specifications.has_bar')
                                    ->label('Bar'),
                                
                                Toggle::make('specifications.has_room_service')
                                    ->label('Room Service'),
                                
                                Toggle::make('specifications.has_airport_shuttle')
                                    ->label('Airport Shuttle'),
                                
                                Toggle::make('specifications.has_pet_friendly')
                                    ->label('Pet Friendly'),
                                
                                Toggle::make('specifications.has_air_conditioning')
                                    ->label('Air Conditioning'),
                                
                                Toggle::make('specifications.has_laundry')
                                    ->label('Laundry'),
                                
                                Toggle::make('specifications.has_conference_room')
                                    ->label('Conference Room'),
                            ]),
                        
                        Grid::make(3)
                            ->schema([
                                TextInput::make('specifications.check_in_time')
                                    ->label('Check-in Time')
                                    ->placeholder('14:00')
                                    ->maxLength(255),
                                
                                TextInput::make('specifications.check_out_time')
                                    ->label('Check-out Time')
                                    ->placeholder('11:00')
                                    ->maxLength(255),
                                
                                TextInput::make('specifications.total_rooms')
                                    ->label('Total Rooms')
                                    ->numeric()
                                    ->minValue(1),
                            ]),
                    ])
                    ->relationship('specifications')
                    ->collapsible(),
                
                Section::make('Images')
                    ->schema([
                        Repeater::make('images')
                            ->relationship('images')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        FileUpload::make('image_path')
                                            ->label('Image')
                                            ->image()
                                            ->disk('public')
                                            ->directory('hotels')
                                            ->required()
                                            ->maxSize(5120)
                                            ->imageEditor()
                                            ->columnSpan(1),
                                        
                                        Grid::make(1)
                                            ->schema([
                                                TextInput::make('alt_text')
                                                    ->label('Alt Text')
                                                    ->maxLength(255)
                                                    ->helperText('Description for accessibility'),
                                                
                                                Toggle::make('is_primary')
                                                    ->label('Set as Primary Image')
                                                    ->default(false)
                                                    ->helperText('Only one image should be primary'),
                                                
                                                TextInput::make('order')
                                                    ->label('Display Order')
                                                    ->numeric()
                                                    ->default(0)
                                                    ->helperText('Lower numbers appear first'),
                                            ])
                                            ->columnSpan(1),
                                    ]),
                            ])
                            ->orderColumn('order')
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['alt_text'] ?? 'Image')
                            ->addActionLabel('Add Image')
                            ->defaultItems(0),
                    ])
                    ->collapsible(),
            ]);
    }
}

