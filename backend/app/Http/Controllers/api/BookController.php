<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->get('q');

        $query = DB::table('books')->select(
            'id',
            'title',
            'isbn',
            'price',
            'stock_quantity',
            'description',
            'cover_image',
            'author'
        );

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('title', 'like', "%{$q}%")
                    ->orWhere('isbn', 'like', "%{$q}%")
                    ->orWhere('author', 'like', "%{$q}%");
            });
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $books = $query->orderByDesc('id')->get();

        return response()->json([
            'data' => $books
        ]);
    }

    public function show($id)
    {
        $book = DB::table('books')->select(
            'id',
            'title',
            'isbn',
            'price',
            'stock_quantity',
            'description',
            'cover_image',
            'author'
        )->where('id', $id)->first();

        if (! $book) {
            return response()->json(['message' => 'Không tìm thấy sách'], 404);
        }

        return response()->json($book);
    }
}
