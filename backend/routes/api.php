<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AdminBookController;
use App\Http\Controllers\Api\ReviewController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/reviews/{bookId}', [ReviewController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'store']);

    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::post('/reviews', [ReviewController::class, 'store']);

    Route::get('/me', function (Request $request) {
        return $request->user();
    });
});

Route::middleware(['auth:sanctum', 'is_admin'])->prefix('admin')->group(function () {
    Route::get('/books', [AdminBookController::class, 'index']);
    Route::post('/books', [AdminBookController::class, 'store']);
    Route::get('/books/{id}', [AdminBookController::class, 'show']);
    Route::put('/books/{id}', [AdminBookController::class, 'update']);
    Route::delete('/books/{id}', [AdminBookController::class, 'destroy']);

    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::get('/orders/{id}', [OrderController::class, 'adminShow']);
    Route::put('/orders/{id}', [OrderController::class, 'adminUpdate']);

    Route::get('/stats', [AdminBookController::class, 'stats']);
    Route::get('/revenue', [AdminBookController::class, 'revenue']);

    Route::get('/inventory/stats', [AdminBookController::class, 'inventoryStats']);
    Route::get('/inventory/list', [AdminBookController::class, 'inventoryList']);
    Route::put('/inventory/{id}', [AdminBookController::class, 'updateStock']);
});
