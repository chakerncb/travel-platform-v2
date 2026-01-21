<?php

namespace App\Filament\Resources\Blogs;

use App\Filament\Resources\Blogs\Pages;
use App\Filament\Resources\Blogs\Schemas\BlogCommentForm;
use App\Filament\Resources\Blogs\Tables\BlogCommentsTable;
use App\Models\BlogComment;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class BlogCommentResource extends Resource
{
    protected static ?string $model = BlogComment::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedChatBubbleLeftRight;
    protected static string | UnitEnum | null $navigationGroup = 'Blogs';

    protected static ?string $navigationLabel = 'Blog Comments';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return BlogCommentForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BlogCommentsTable::configure($table);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlogComments::route('/'),
            'edit' => Pages\EditBlogComment::route('/{record}/edit'),
        ];
    }
}
