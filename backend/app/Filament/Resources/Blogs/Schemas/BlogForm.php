<?php

namespace App\Filament\Resources\Blogs\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\BlogCategory;
use App\Models\User;

class BlogForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Information')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (string $operation, $state, $set) {
                                if ($operation === 'create') {
                                    $set('slug', Str::slug($state));
                                }
                            })
                            ->columnSpanFull(),

                        TextInput::make('slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true)
                            ->rules(['alpha_dash'])
                            ->helperText('URL-friendly version of the title')
                            ->columnSpanFull(),

                        Textarea::make('excerpt')
                            ->required()
                            ->maxLength(500)
                            ->rows(3)
                            ->helperText('Short summary that appears in blog listings')
                            ->columnSpanFull(),
                    ]),

                Section::make('Content')
                    ->schema([
                        RichEditor::make('content')
                            ->required()
                            ->columnSpanFull()
                            ->toolbarButtons([
                                'attachFiles',
                                'blockquote',
                                'bold',
                                'bulletList',
                                'codeBlock',
                                'h2',
                                'h3',
                                'italic',
                                'link',
                                'orderedList',
                                'redo',
                                'strike',
                                'underline',
                                'undo',
                            ]),
                    ]),

                Section::make('Media')
                    ->schema([
                        FileUpload::make('featured_image')
                            ->image()
                            ->disk('public')
                            ->directory('blog-images')
                            ->maxSize(2048)
                            ->helperText('Upload a featured image for this blog post (max 2MB)')
                            ->columnSpanFull(),
                    ]),

                Section::make('Classification')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                Select::make('category_id')
                                    ->label('Category')
                                    ->required()
                                    ->options(BlogCategory::pluck('name', 'id'))
                                    ->searchable()
                                    ->preload()
                                    ->native(false),

                                Select::make('author_id')
                                    ->label('Author')
                                    ->required()
                                    ->options(User::pluck('f_name', 'id'))
                                    ->searchable()
                                    ->default(fn () => Auth::id())
                                    ->preload()
                                    ->native(false),
                            ]),
                    ]),

                Section::make('Publishing')
                    ->schema([
                        Grid::make(3)
                            ->schema([
                                Select::make('status')
                                    ->required()
                                    ->options([
                                        'draft' => 'Draft',
                                        'published' => 'Published',
                                        'archived' => 'Archived',
                                    ])
                                    ->default('draft')
                                    ->native(false),

                                DateTimePicker::make('published_at')
                                    ->label('Publish Date')
                                    ->default(now())
                                    ->required()
                                    ->native(false),

                                TextInput::make('reading_time')
                                    ->label('Reading Time (minutes)')
                                    ->numeric()
                                    ->default(5)
                                    ->required()
                                    ->minValue(1)
                                    ->maxValue(60),
                            ]),
                    ]),
            ]);
    }
}
