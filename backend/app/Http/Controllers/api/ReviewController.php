<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function index($bookId)
    {
        $reviews = DB::table('reviews')
            ->leftJoin('users', 'reviews.user_id', '=', 'users.id')
            ->select(
                'reviews.id',
                'reviews.rating',
                'reviews.comment',
                'reviews.created_at',
                'users.name as user_name'
            )
            ->where('reviews.book_id', $bookId)
            ->orderByDesc('reviews.id')
            ->get();

        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'book_id' => 'required|integer',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        DB::table('reviews')->insert([
            'user_id' => $request->user()->id,
            'book_id' => $data['book_id'],
            'rating' => $data['rating'],
            'comment' => $data['comment'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'message' => 'Đánh giá thành công'
        ]);
    }
}
