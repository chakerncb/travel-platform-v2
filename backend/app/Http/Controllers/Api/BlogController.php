<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterEmail;
use App\Models\Blog;
use App\Models\BlogComment;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class BlogController extends Controller
{
    /**
     * Get all blogs with pagination
     */
    public function index(Request $request)
    {
        $blogs = Blog::with(['author', 'category'])
            ->where('status', 'published')
            ->when($request->has('category'), function ($query) use ($request) {
                return $query->where('category_id', $request->category);
            })
            ->orderBy('published_at', 'desc')
            ->paginate($request->get('per_page', 8));

        return response()->json([
            'status' => true,
            'blogs' => $blogs,
        ]);
    }

    /**
     * Get single blog by slug
     */
    public function show($slug)
    {
        $blog = Blog::with(['author', 'category', 'comments' => function ($query) {
            $query->where('status', 'approved')
                  ->whereNull('parent_id')
                  ->with('replies')
                  ->orderBy('created_at', 'desc');
        }])
        ->where('slug', $slug)
        ->where('status', 'published')
        ->firstOrFail();

        // Increment views
        $blog->increment('views');

        return response()->json([
            'status' => true,
            'blog' => $blog,
        ]);
    }

    /**
     * Add comment to blog
     */
    public function addComment(Request $request, $slug)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'comment' => 'required|string',
            'parent_id' => 'nullable|exists:blog_comments,id',
        ]);

        $blog = Blog::where('slug', $slug)->firstOrFail();

        $comment = $blog->comments()->create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'comment' => $validated['comment'],
            'parent_id' => $validated['parent_id'] ?? null,
            'status' => 'pending', // Admin approval required
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Comment submitted successfully. It will appear after approval.',
            'comment' => $comment,
        ]);
    }

    /**
     * Get blog categories
     */
    public function getCategories()
    {
        $categories = \App\Models\BlogCategory::withCount('blogs')->get();

        return response()->json([
            'status' => true,
            'categories' => $categories,
        ]);
    }
}
