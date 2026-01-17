<?php

namespace App\Filament\Resources\Blogs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class BlogCommentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Comment Information')
                    ->schema([
                        TextInput::make('name')
                            ->required()
                            ->maxLength(255)
                            ->disabled(),

                        TextInput::make('email')
                            ->required()
                            ->email()
                            ->maxLength(255)
                            ->disabled(),

                        Textarea::make('comment')
                            ->required()
                            ->rows(4)
                            ->disabled(),
                    ]),

                Section::make('Status')
                    ->schema([
                        Select::make('status')
                            ->required()
                            ->options([
                                'pending' => 'Pending',
                                'approved' => 'Approved',
                                'rejected' => 'Rejected',
                            ])
                            ->default('pending')
                            ->native(false),
                    ]),
            ]);
    }
}
