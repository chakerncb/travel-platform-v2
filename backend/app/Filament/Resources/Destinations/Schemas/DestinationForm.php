<?php

namespace App\Filament\Resources\Destinations\Schemas;

use App\Filament\Forms\Components\UnsplashPicker;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class DestinationForm
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
                    ]),
                
                Section::make('Description')
                    ->schema([
                        Textarea::make('short_description')
                            ->rows(3)
                            ->maxLength(500)
                            ->helperText('Brief summary for cards and previews'),
                        
                        RichEditor::make('description')
                            ->required()
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
                            ->helperText('Detailed description of the destination'),
                    ]),
                
                Section::make('Images')
                    ->schema([
                           UnsplashPicker::make('unsplash_picker')
                            ->label(''),
                        
                        Repeater::make('images')
                            ->relationship('images')
                            ->schema([
                                Grid::make(2)
                                    ->schema([
                                        FileUpload::make('image_path')
                                            ->label('Image')
                                            ->image()
                                            ->disk('public')
                                            ->directory('destinations')
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

