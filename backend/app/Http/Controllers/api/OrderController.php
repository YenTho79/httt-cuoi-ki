<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = DB::table('orders')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('id')
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'shipping_address' => 'required|string|max:255',
        ]);

        $user = $request->user();

        $cart = DB::table('carts')->where('user_id', $user->id)->first();

        if (! $cart) {
            return response()->json(['message' => 'Giỏ hàng trống'], 422);
        }

        $items = DB::table('cart_items')->where('cart_id', $cart->id)->get();

        if ($items->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng trống'], 422);
        }

        $total = $items->sum(function ($item) {
            return $item->quantity * $item->unit_price;
        });

        $orderId = DB::table('orders')->insertGetId([
            'user_id' => $user->id,
            'total_amount' => $total,
            'status' => 'processing',
            'payment_status' => 'paid',
            'shipping_address' => $data['shipping_address'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($items as $item) {
            DB::table('order_items')->insert([
                'order_id' => $orderId,
                'book_id' => $item->book_id,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->quantity * $item->unit_price,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table('cart_items')->where('cart_id', $cart->id)->delete();

        return response()->json([
            'message' => 'Thanh toán giả lập thành công',
            'order_id' => $orderId,
            'payment_status' => 'paid',
        ]);
    }

    public function adminIndex()
    {
        $orders = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'orders.id',
                'orders.user_id',
                'orders.total_amount',
                'orders.status',
                'orders.payment_status',
                'orders.shipping_address',
                'orders.created_at',
                'users.name as user_name',
                'users.email as user_email'
            )
            ->orderByDesc('orders.id')
            ->get();

        return response()->json($orders);
    }

    public function adminUpdate(Request $request, $id)
    {
        $data = $request->validate([
            'status' => 'required|string|max:50',
            'payment_status' => 'required|string|max:50',
        ]);

        $order = DB::table('orders')->where('id', $id)->first();

        if (! $order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng'], 404);
        }

        DB::table('orders')->where('id', $id)->update([
            'status' => $data['status'],
            'payment_status' => $data['payment_status'],
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Cập nhật đơn hàng thành công',
        ]);
    }

    public function adminShow($id)
    {
        $order = DB::table('orders')
            ->leftJoin('users', 'orders.user_id', '=', 'users.id')
            ->select(
                'orders.*',
                'users.name as user_name',
                'users.email as user_email'
            )
            ->where('orders.id', $id)
            ->first();

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn'], 404);
        }

        $items = DB::table('order_items')
            ->leftJoin('books', 'order_items.book_id', '=', 'books.id')
            ->select(
                'books.title',
                'order_items.quantity',
                'order_items.unit_price'
            )
            ->where('order_items.order_id', $id)
            ->get();

        return response()->json([
            'order' => $order,
            'items' => $items
        ]);
    }
}
