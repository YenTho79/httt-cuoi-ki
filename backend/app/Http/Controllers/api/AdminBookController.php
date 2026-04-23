<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminBookController extends Controller
{
    public function index()
    {
        $books = DB::table('books')
            ->leftJoin('categories', 'books.category_id', '=', 'categories.id')
            ->select('books.*', 'categories.name as category_name')
            ->orderByDesc('books.id')
            ->get();

        return response()->json($books);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'category_id' => 'required|integer',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $id = DB::table('books')->insertGetId([
            'title' => $data['title'],
            'author' => $data['author'],
            'isbn' => $data['isbn'] ?? null,
            'category_id' => $data['category_id'],
            'price' => $data['price'],
            'stock_quantity' => $data['stock_quantity'],
            'description' => $data['description'] ?? null,
            'image_url' => $data['image_url'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Thêm sách thành công',
            'id' => $id,
        ], 201);
    }

    public function show($id)
    {
        $book = DB::table('books')->where('id', $id)->first();

        if (!$book) {
            return response()->json(['message' => 'Không tìm thấy sách'], 404);
        }

        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $book = DB::table('books')->where('id', $id)->first();

        if (!$book) {
            return response()->json(['message' => 'Không tìm thấy sách'], 404);
        }

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'author' => 'required|string|max:255',
            'isbn' => 'nullable|string|max:255',
            'category_id' => 'required|integer',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        DB::table('books')->where('id', $id)->update([
            'title' => $data['title'],
            'author' => $data['author'],
            'isbn' => $data['isbn'] ?? null,
            'category_id' => $data['category_id'],
            'price' => $data['price'],
            'stock_quantity' => $data['stock_quantity'],
            'description' => $data['description'] ?? null,
            'image_url' => $data['image_url'] ?? null,
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Cập nhật sách thành công',
        ]);
    }

    public function destroy($id)
    {
        $book = DB::table('books')->where('id', $id)->first();

        if (!$book) {
            return response()->json(['message' => 'Không tìm thấy sách'], 404);
        }

        DB::table('books')->where('id', $id)->delete();

        return response()->json([
            'message' => 'Xóa sách thành công',
        ]);
    }

    public function stats()
    {
        $books = DB::table('books')->count();
        $users = DB::table('users')->count();
        $orders = DB::table('orders')->count();
        $totalRevenue = DB::table('orders')->where('status', 'completed')->sum('total_amount');

        return response()->json([
            'books' => $books,
            'users' => $users,
            'orders' => $orders,
            'total_revenue' => $totalRevenue,
        ]);
    }

    public function revenue()
    {
        $data = DB::table('orders')
            ->selectRaw('DATE_FORMAT(created_at, "%Y-%m") as month, SUM(total_amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json($data);
    }

    public function inventoryStats()
    {
        $totalBooks = DB::table('books')->count();
        $totalStock = DB::table('books')->sum('stock_quantity');
        $lowStock = DB::table('books')->where('stock_quantity', '<=', 5)->where('stock_quantity', '>', 0)->count();
        $outOfStock = DB::table('books')->where('stock_quantity', '=', 0)->count();

        return response()->json([
            'total_books' => $totalBooks,
            'total_stock' => $totalStock,
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
        ]);
    }

    public function inventoryList()
    {
        $books = DB::table('books')
            ->select('id', 'title', 'isbn', 'price', 'stock_quantity')
            ->orderBy('stock_quantity', 'asc')
            ->get();

        return response()->json($books);
    }

    public function updateStock(Request $request, $id)
    {
        $data = $request->validate([
            'stock_quantity' => 'required|integer|min:0',
        ]);

        DB::table('books')->where('id', $id)->update([
            'stock_quantity' => $data['stock_quantity'],
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Cập nhật tồn kho thành công']);
    }
}
