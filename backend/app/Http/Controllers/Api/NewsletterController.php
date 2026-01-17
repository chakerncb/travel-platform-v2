<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\NewsletterEmail;
use App\Models\Newsletter;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NewsletterController extends Controller
{
    /**
     * Subscribe to newsletter
     */
    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'nullable|string|max:255',
        ]);

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            [
                'name' => $validated['name'] ?? null,
                'is_subscribed' => true,
                'subscribed_at' => now(),
            ]
        );

        if (!$subscriber->is_subscribed) {
            $subscriber->subscribe();
            $message = 'You have been re-subscribed to our newsletter!';
        } else {
            $message = 'You are already subscribed to our newsletter.';
        }

        return response()->json([
            'status' => true,
            'message' => $message,
        ]);
    }

    /**
     * Unsubscribe from newsletter
     */
    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        if (!$subscriber) {
            return response()->json([
                'status' => false,
                'message' => 'Email not found in our subscriber list.',
            ], 404);
        }

        if (!$subscriber->is_subscribed) {
            return response()->json([
                'status' => true,
                'message' => 'You are already unsubscribed.',
            ]);
        }

        $subscriber->unsubscribe();

        return response()->json([
            'status' => true,
            'message' => 'You have been successfully unsubscribed from our newsletter.',
        ]);
    }

    /**
     * Get all subscribers (admin only)
     */
    public function getSubscribers(Request $request)
    {
        $subscribers = NewsletterSubscriber::query()
            ->when($request->has('subscribed_only'), function ($query) {
                return $query->subscribed();
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 20));

        return response()->json([
            'status' => true,
            'subscribers' => $subscribers,
        ]);
    }

    /**
     * Send newsletter (admin only)
     */
    public function sendNewsletter(Request $request, $id)
    {
        $newsletter = Newsletter::findOrFail($id);

        if ($newsletter->isSent()) {
            return response()->json([
                'status' => false,
                'message' => 'This newsletter has already been sent.',
            ], 422);
        }

        // Get all subscribed users
        $subscribers = NewsletterSubscriber::subscribed()->get();

        if ($subscribers->isEmpty()) {
            return response()->json([
                'status' => false,
                'message' => 'No subscribers found.',
            ], 422);
        }

        $newsletter->update([
            'recipients_count' => $subscribers->count(),
        ]);

        $sentCount = 0;
        $failedCount = 0;

        // Send email to each subscriber
        foreach ($subscribers as $subscriber) {
            try {
                Mail::to($subscriber->email)->send(new NewsletterEmail($newsletter, $subscriber->email));
                $sentCount++;
            } catch (\Exception $e) {
                $failedCount++;
                Log::error('Failed to send newsletter to ' . $subscriber->email . ': ' . $e->getMessage());
            }
        }

        // Update newsletter stats
        $newsletter->update([
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
        ]);

        $newsletter->markAsSent();

        return response()->json([
            'status' => true,
            'message' => "Newsletter sent successfully to {$sentCount} subscribers. {$failedCount} failed.",
            'newsletter' => $newsletter,
        ]);
    }
}
