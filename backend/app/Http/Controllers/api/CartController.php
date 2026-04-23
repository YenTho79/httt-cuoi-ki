<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $cart = DB::table('carts')->where('user_id', $user->id)->first();

        if (! $cart) {
            return response()->json([
                'items' => []
            ]);
        }

        $items = DB::table('cart_items')
            ->leftJoin('books', 'cart_items.book_id', '=', 'books.id')
            ->select(
                'cart_items.id',
                'cart_items.quantity',
                'cart_items.unit_price',
                'books.id as book_id',
                'books.title'
            )
            ->where('cart_items.cart_id', $cart->id)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'book' => [
                        'id' => $item->book_id,
                        'title' => $item->title,
                    ]
                ];
            });

        return response()->json([
            'id' => $cart->id,
            'items' => $items
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
        ]);

        $user = $request->user();

        $cart = DB::table('carts')->where('user_id', $user->id)->first();

        if (! $cart) {
            $cartId = DB::table('carts')->insertGetId([
                'user_id' => $user->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $cartId = $cart->id;
        }

        $book = DB::table('books')->where('id', $data['book_id'])->first();

        if (! $book) {
            return response()->json(['message' => 'Không tìm thấy sách'], 404);
        }

        $existing = DB::table('cart_items')
            ->where('cart_id', $cartId)
            ->where('book_id', $data['book_id'])
            ->first();

        if ($existing) {
            DB::table('cart_items')
                ->where('id', $existing->id)
                ->update([
                    'quantity' => $existing->quantity + $data['quantity'],
                    'updated_at' => now(),
                ]);
        } else {
            DB::table('cart_items')->insert([
                'cart_id' => $cartId,
                'book_id' => $data['book_id'],
                'quantity' => $data['quantity'],
                'unit_price' => $book->price,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json(['message' => 'Đã thêm vào giỏ hàng']);
    }
}
