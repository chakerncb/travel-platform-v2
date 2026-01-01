<?php

namespace App\Filament\Resources\Tours\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TourForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                TextInput::make('title')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpan(1),
                                
                                Select::make('type')
                                    ->required()
                                    ->options([
                                        'pre_prepared' => 'Pre-Prepared',
                                        'custom' => 'Custom',
                                    ])
                                    ->default('pre_prepared')
                                    ->native(false)
                                    ->columnSpan(1),
                            ]),
                        
                        Textarea::make('short_description')
                            ->rows(3)
                            ->maxLength(500)
                            ->helperText('Brief summary for cards and previews')
                            ->columnSpanFull(),
                        
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
                            ])
                            ->helperText('Detailed description of the tour'),
                    ]),
                
                Section::make('Tour Details')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                TextInput::make('price')
                                    ->required()
                                    ->numeric()
                                    ->prefix('$')
                                    ->step(0.01)
                                    ->minValue(0),
                                
                                TextInput::make('duration_days')
                                    ->label('Duration (Days)')
                                    ->required()
                                    ->numeric()
                                    ->minValue(1)
                                    ->suffix('days'),
                                
                                TextInput::make('max_group_size')
                                    ->label('Max Group Size')
                                    ->numeric()
                                    ->minValue(1)
                                    ->helperText('Leave empty for unlimited'),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                Select::make('difficulty_level')
                                    ->label('Difficulty Level')
                                    ->required()
                                    ->options([
                                        'easy' => 'Easy',
                                        'moderate' => 'Moderate',
                                        'challenging' => 'Challenging',
                                        'difficult' => 'Difficult',
                                    ])
                                    ->default('moderate')
                                    ->native(false),
                                
                                Grid::make(2)
                                    ->schema([
                                        Toggle::make('is_active')
                                            ->label('Active')
                                            ->default(true),
                                        
                                        Toggle::make('is_eco_friendly')
                                            ->label('Eco Friendly')
                                            ->default(true),
                                    ]),
                            ]),
                        
                        Grid::make(2)
                            ->schema([
                                DatePicker::make('start_date')
                                    ->label('Start Date')
                                    ->native(false),
                                
                                DatePicker::make('end_date')
                                    ->label('End Date')
                                    ->native(false)
                                    ->after('start_date'),
                            ]),
                    ]),
                
                Section::make('Services')
                    ->schema([
                        TagsInput::make('included_services')
                            ->label('Included Services')
                            ->placeholder('Add service and press Enter')
                            ->helperText('Services included in the tour price')
                            ->suggestions([
                                'Accommodation',
                                'Meals',
                                'Transportation',
                                'Tour Guide',
                                'Entrance Fees',
                                'Travel Insurance',
                            ]),
                        
                        TagsInput::make('excluded_services')
                            ->label('Excluded Services')
                            ->placeholder('Add service and press Enter')
                            ->helperText('Services NOT included in the tour price')
                            ->suggestions([
                                'Personal Expenses',
                                'Tips',
                                'Optional Activities',
                                'International Flights',
                                'Visa Fees',
                            ]),
                    ])
                    ->collapsible(),
                
                Section::make('Destinations')
                    ->schema([
                        Repeater::make('tourDestinations')
                            ->relationship('tourDestinations')
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        Select::make('destination_id')
                                            ->label('Destination')
                                            ->relationship('destination', 'name')
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->columnSpan(2),
                                        
                                        TextInput::make('days_at_destination')
                                            ->label('Days')
                                            ->numeric()
                                            ->default(1)
                                            ->minValue(1)
                                            ->suffix('days')
                                            ->columnSpan(1),
                                        
                                        TextInput::make('order')
                                            ->label('Order')
                                            ->numeric()
                                            ->default(0)
                                            ->helperText('Sequence in itinerary')
                                            ->columnSpan(3),
                                    ]),
                            ])
                            ->orderColumn('order')
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn ($state): ?string => 
                                \App\Models\Destination::find($state['destination_id'] ?? null)?->name ?? 'Destination'
                            )
                            ->addActionLabel('Add Destination')
                            ->defaultItems(0),
                    ])
                    ->collapsible(),
                
                Section::make('Hotels')
                    ->schema([
                        Repeater::make('tourHotels')
                            ->relationship('tourHotels')
                            ->schema([
                                Grid::make(3)
                                    ->schema([
                                        Select::make('hotel_id')
                                            ->label('Hotel')
                                            ->relationship('hotel', 'name')
                                            ->required()
                                            ->searchable()
                                            ->preload()
                                            ->columnSpan(2),
                                        
                                        TextInput::make('nights')
                                            ->label('Nights')
                                            ->numeric()
                                            ->default(1)
                                            ->minValue(1)
                                            ->suffix('nights')
                                            ->columnSpan(1),
                                        
                                        TextInput::make('order')
                                            ->label('Order')
                                            ->numeric()
                                            ->default(0)
                                            ->helperText('Sequence in itinerary')
                                            ->columnSpan(3),
                                    ]),
                            ])
                            ->orderColumn('order')
                            ->reorderable()
                            ->collapsible()
                            ->itemLabel(fn ($state): ?string => 
                                \App\Models\Hotel::find($state['hotel_id'] ?? null)?->name ?? 'Hotel'
                            )
                            ->addActionLabel('Add Hotel')
                            ->defaultItems(0),
                    ])
                    ->collapsible(),
            ]);
    }
}
