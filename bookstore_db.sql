-- --------------------------------------------------------
-- Hệ thống Quản lý Nhà sách trực tuyến
-- File SQL/MySQL import nhanh
-- Database: bookstore_db
-- Tương thích MySQL 8+
-- --------------------------------------------------------

CREATE DATABASE IF NOT EXISTS `bookstore_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `bookstore_db`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `personal_access_tokens`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `cart_items`;
DROP TABLE IF EXISTS `carts`;
DROP TABLE IF EXISTS `books`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'customer',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `books` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `isbn` varchar(50) NOT NULL,
  `author` varchar(255) NOT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `stock_quantity` int unsigned NOT NULL DEFAULT 0,
  `description` text DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `category_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `books_isbn_unique` (`isbn`),
  KEY `books_category_id_foreign` (`category_id`),
  CONSTRAINT `books_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `book_id` bigint unsigned NOT NULL,
  `quantity` int unsigned NOT NULL DEFAULT 1,
  `unit_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_book_unique` (`cart_id`, `book_id`),
  KEY `cart_items_book_id_foreign` (`book_id`),
  CONSTRAINT `cart_items_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `total_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','processing','shipping','completed','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','paid','failed') NOT NULL DEFAULT 'unpaid',
  `shipping_address` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `book_id` bigint unsigned NOT NULL,
  `quantity` int unsigned NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_book_id_foreign` (`book_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `reviews` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `book_id` bigint unsigned NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_user_id_foreign` (`user_id`),
  KEY `reviews_book_id_foreign` (`book_id`),
  CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_book_id_foreign` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`) VALUES
(1, 'Admin BookStore', 'admin@bookstore.com', '$2y$12$YsFBfzSzBra5MDo2jtUpH.DZyhlsFLXlhJuUU5AqI9uG2HgaE8FFq', 'admin'),
(2, 'Nguyen Van A', 'customer1@bookstore.com', '$2y$12$YsFBfzSzBra5MDo2jtUpH.DZyhlsFLXlhJuUU5AqI9uG2HgaE8FFq', 'customer'),
(3, 'Tran Thi B', 'customer2@bookstore.com', '$2y$12$YsFBfzSzBra5MDo2jtUpH.DZyhlsFLXlhJuUU5AqI9uG2HgaE8FFq', 'customer');

INSERT INTO `categories` (`id`, `name`, `slug`, `description`) VALUES
(1, 'Văn học', 'van-hoc', 'Sách văn học Việt Nam và nước ngoài'),
(2, 'Kỹ năng sống', 'ky-nang-song', 'Sách phát triển bản thân và kỹ năng'),
(3, 'Công nghệ', 'cong-nghe', 'Sách CNTT, lập trình, phần mềm'),
(4, 'Kinh tế', 'kinh-te', 'Sách quản trị, marketing, tài chính'),
(5, 'Thiếu nhi', 'thieu-nhi', 'Sách dành cho trẻ em và thanh thiếu niên');

INSERT INTO `books` (`id`, `title`, `isbn`, `author`, `price`, `stock_quantity`, `description`, `cover_image`, `category_id`) VALUES
(1, 'Mắt Biếc', '9786041234501', 'Nguyễn Nhật Ánh', 95000.00, 50, 'Tiểu thuyết nổi tiếng về tuổi học trò, tình yêu và ký ức.', 'https://example.com/images/mat-biec.jpg', 1),
(2, 'Tuổi Trẻ Đáng Giá Bao Nhiêu', '9786041234502', 'Rosie Nguyễn', 88000.00, 40, 'Cuốn sách truyền cảm hứng cho người trẻ về học tập và trải nghiệm.', 'https://example.com/images/tuoi-tre-dang-gia-bao-nhieu.jpg', 2),
(3, 'Clean Code', '9786041234503', 'Robert C. Martin', 210000.00, 25, 'Sách kinh điển dành cho lập trình viên về viết mã sạch.', 'https://example.com/images/clean-code.jpg', 3),
(4, 'Cha Giàu Cha Nghèo', '9786041234504', 'Robert T. Kiyosaki', 120000.00, 60, 'Kiến thức nền tảng về tư duy tài chính cá nhân.', 'https://example.com/images/cha-giau-cha-ngheo.jpg', 4),
(5, 'Dế Mèn Phiêu Lưu Ký', '9786041234505', 'Tô Hoài', 76000.00, 80, 'Tác phẩm thiếu nhi kinh điển của văn học Việt Nam.', 'https://example.com/images/de-men-phieu-luu-ky.jpg', 5),
(6, 'Harry Potter và Hòn Đá Phù Thủy', '9786041234506', 'J.K. Rowling', 185000.00, 35, 'Phần mở đầu của thế giới phù thủy Harry Potter.', 'https://example.com/images/harry-potter-1.jpg', 5),
(7, 'Đắc Nhân Tâm', '9786041234507', 'Dale Carnegie', 110000.00, 45, 'Cuốn sách nổi tiếng về nghệ thuật giao tiếp và ứng xử.', 'https://example.com/images/dac-nhan-tam.jpg', 2),
(8, 'Lập Trình Web Với Laravel', '9786041234508', 'Nhiều tác giả', 165000.00, 30, 'Tài liệu thực hành Laravel, RESTful API và ORM.', 'https://example.com/images/laravel-book.jpg', 3);

INSERT INTO `carts` (`id`, `user_id`) VALUES
(1, 2),
(2, 3);

INSERT INTO `cart_items` (`id`, `cart_id`, `book_id`, `quantity`, `unit_price`) VALUES
(1, 1, 2, 1, 88000.00),
(2, 1, 3, 1, 210000.00),
(3, 2, 5, 2, 76000.00);

INSERT INTO `orders` (`id`, `user_id`, `total_amount`, `status`, `payment_status`, `shipping_address`) VALUES
(1, 2, 171000.00, 'completed', 'paid', '12 Nguyen Van Cu, Thu Dau Mot, Binh Duong'),
(2, 3, 152000.00, 'processing', 'unpaid', '45 Le Hong Phong, Di An, Binh Duong');

INSERT INTO `order_items` (`id`, `order_id`, `book_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1, 1, 1, 95000.00, 95000.00),
(2, 1, 5, 1, 76000.00, 76000.00),
(3, 2, 5, 2, 76000.00, 152000.00);

INSERT INTO `reviews` (`id`, `user_id`, `book_id`, `rating`, `comment`) VALUES
(1, 2, 1, 5, 'Sách rất hay, nội dung cảm động và gần gũi.'),
(2, 3, 3, 5, 'Rất phù hợp cho sinh viên CNTT muốn cải thiện chất lượng code.'),
(3, 2, 2, 4, 'Nội dung truyền cảm hứng, dễ đọc.');

SET FOREIGN_KEY_CHECKS = 1;
