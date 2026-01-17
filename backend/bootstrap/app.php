<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function () {
            // Register broadcasting routes with token authentication only (no session/CSRF)
            Illuminate\Support\Facades\Broadcast::routes(['middleware' => ['auth:sanctum']]);
        }
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
        $middleware->alias([
            'check.admin' => \App\Http\Middleware\AdminCheck::class,
            'check.owner' => \App\Http\Middleware\OwnerCheck::class,
        ]);

        // Add Sanctum to broadcasting auth
        // $middleware->prependToGroup('web', \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
