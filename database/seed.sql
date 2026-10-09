-- ==============================================================================
-- 1. CLEAR OLD DATA
-- ==============================================================================
TRUNCATE TABLE order_items, orders, cart_items, carts, comments, product_stocks, products, authen, users RESTART IDENTITY CASCADE;

-- ==============================================================================
-- 2. SEED USERS (10 Users, ids 1000-1009)
-- ==============================================================================
INSERT INTO users (id, name, email, avatar, contact, address, description) VALUES
(1000, 'Minh Nguyen', 'minh@example.com', 'https://i.pravatar.cc/150?img=11', '+84 901 000 001', '12 Le Loi, District 1, Ho Chi Minh City', 'Streetwear enthusiast and weekend sneakerhead.'),
(1001, 'Lan Pham', 'lan@example.com', 'https://i.pravatar.cc/150?img=5', '+84 901 000 002', '45 Nguyen Hue, District 1, Ho Chi Minh City', 'Loves minimal basics and soft cotton tees.'),
(1002, 'Hoang Tran', 'hoang@example.com', 'https://i.pravatar.cc/150?img=15', '+84 901 000 003', '78 Tran Hung Dao, District 5, Ho Chi Minh City', 'Shops for comfy everyday fits.'),
(1003, 'Trang Le', 'trang@example.com', 'https://i.pravatar.cc/150?img=20', '+84 901 000 004', '23 Hai Ba Trung, District 3, Ho Chi Minh City', 'Into oversized styles and neutral tones.'),
(1004, 'Khoa Vu', 'khoa@example.com', 'https://i.pravatar.cc/150?img=33', '+84 901 000 005', '9 Pham Ngu Lao, District 1, Ho Chi Minh City', 'Casual dresser who values good fabric.'),
(1005, 'Linh Bui', 'linh@example.com', 'https://i.pravatar.cc/150?img=44', '+84 901 000 006', '67 Vo Van Tan, District 3, Ho Chi Minh City', 'Fan of bold colors and premium cotton.'),
(1006, 'Tuan Do', 'tuan@example.com', 'https://i.pravatar.cc/150?img=55', '+84 901 000 007', '34 Dien Bien Phu, Binh Thanh, Ho Chi Minh City', 'Collects classic tees in every color.'),
(1007, 'Ngoc Dang', 'ngoc@example.com', 'https://i.pravatar.cc/150?img=66', '+84 901 000 008', '101 Cach Mang Thang 8, District 10, Ho Chi Minh City', 'Prefers relaxed fits for daily wear.'),
(1008, 'Dat Ngo', 'dat@example.com', 'https://i.pravatar.cc/150?img=36', '+84 901 000 009', '56 Ly Thuong Kiet, District 11, Ho Chi Minh City', 'Always hunting for a good promo.'),
(1009, 'Huyen Ly', 'huyen@example.com', 'https://i.pravatar.cc/150?img=38', '+84 901 000 010', '88 Nguyen Trai, District 5, Ho Chi Minh City', 'Likes clean, simple designs.');

-- ==============================================================================
-- 3. SEED AUTHEN (one credential row per user, password is a bcrypt placeholder)
-- ==============================================================================
INSERT INTO authen (user_id, username, email, password)
SELECT id, split_part(email, '@', 1), email,
       '$2b$10$abcdefghijklmnopqrstuvQ8Z0m9rN0m9rN0m9rN0m9rN0m9rN0m9'
FROM users;

-- ==============================================================================
-- 4. SEED PRODUCTS (30 Products)
-- ==============================================================================
INSERT INTO products (id, title, rating, num_reviews, image) VALUES
(1, 'Owen Blue T-Shirt', 4.0, 214, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(2, 'Lyn White T-Shirt', 4.7, 98, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(3, 'AC White T-Shirt', 2.8, 176, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(4, 'SC Black T-Shirt', 5.0, 54, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(5, 'Proclub White T-Shirt', 3.8, 132, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(6, 'Classic Black T-Shirt', 4.4, 143, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(7, 'Essential Gray T-Shirt', 4.8, 87, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(8, 'Urban Green T-Shirt', 3.4, 165, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(9, 'Relaxed Beige T-Shirt', 1.6, 231, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(10, 'Minimal Gray T-Shirt', 4.5, 76, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(11, 'Classic Navy T-Shirt', 4.1, 119, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(12, 'Oversized White T-Shirt', 3.1, 188, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(13, 'Essential Black T-Shirt', 4.9, 63, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(14, 'Vintage Blue T-Shirt', 3.6, 147, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(15, 'Soft Cotton White T-Shirt', 4.3, 102, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(16, 'Street Black T-Shirt', 2.4, 159, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(17, 'Relax Fit Gray T-Shirt', 4.6, 91, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(18, 'Premium Blue T-Shirt', 1.0, 276, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(19, 'Daily White T-Shirt', 4.5, 48, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(20, 'Modern Green T-Shirt', 2.1, 203, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(21, 'Heavy Cotton Black T-Shirt', 1.9, 221, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(22, 'Basic Cream T-Shirt', 4.2, 72, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(23, 'Sporty Blue T-Shirt', 3.7, 134, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(24, 'Loose Fit White T-Shirt', 3.3, 151, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(25, 'Simple Black T-Shirt', 4.0, 39, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(26, 'Classic Olive T-Shirt', 2.6, 168, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(27, 'Premium Gray T-Shirt', 1.3, 312, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(28, 'Everyday Beige T-Shirt', 3.9, 84, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(29, 'Urban Navy T-Shirt', 3.0, 192, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(30, 'Comfort Fit White T-Shirt', 3.5, 127, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80');

-- ==============================================================================
-- 5. SEED PRODUCT STOCKS (variants)
-- ==============================================================================
INSERT INTO product_stocks (product_id, size, color, original_price, promotion_price, stock)
SELECT pp.product_id,
       s.size::item_size,
       c.color::color,
       pp.original_price,
       pp.promotion_price,
       (10 + (pp.product_id * 7 + length(s.size) + length(c.color)) % 40) AS stock
FROM (VALUES
    (1, 126, 120),
    (2, 169, 144),
    (3, 200, 180),
    (4, 148, 136),
    (5, 222, 200),
    (6, 150, NULL),
    (7, 135, NULL),
    (8, 183, 165),
    (9, 206, 175),
    (10, 190, NULL),
    (11, 140, 125),
    (12, 180, 155),
    (13, 130, NULL),
    (14, 190, 165),
    (15, 145, NULL),
    (16, 200, 175),
    (17, 160, NULL),
    (18, 250, 220),
    (19, 110, NULL),
    (20, 210, 185),
    (21, 220, 195),
    (22, 125, NULL),
    (23, 175, 155),
    (24, 195, 170),
    (25, 140, NULL),
    (26, 205, 180),
    (27, 240, 210),
    (28, 135, NULL),
    (29, 185, 165),
    (30, 175, 150)
) AS pp(product_id, original_price, promotion_price)
CROSS JOIN (VALUES ('S'), ('M'), ('L'), ('XL'), ('XXL')) AS s(size)
CROSS JOIN (VALUES ('Red'), ('Green'), ('Blue')) AS c(color);

-- ==============================================================================
-- 6. SEED COMMENTS (60 Comments)
-- ==============================================================================
INSERT INTO comments (product_id, user_id, content, rating) VALUES
(1, 1001, 'The shirt is comfortable and the fabric feels good', 5),
(1, 1002, 'Simple design but looks really nice.', 4),
(2, 1003, 'Good quality for the price.', 5),
(2, 1004, 'The color looks exactly like the picture.', 4),
(3, 1005, 'Very comfortable for everyday wear.', 5),
(3, 1006, 'The material feels soft and lightweight.', 4),
(4, 1007, 'I really like the simple black design.', 5),
(4, 1008, 'Fits well and is easy to match with other clothes.', 4),
(5, 1009, 'Nice shirt with a comfortable fit.', 5),
(5, 1000, 'The fabric is quite soft.', 4),
(6, 1001, 'Classic design and good quality.', 4),
(6, 1002, 'I would buy this shirt again.', 5),
(7, 1003, 'The gray color looks great.', 5),
(7, 1004, 'Comfortable and suitable for daily wear.', 4),
(8, 1005, 'The green color is very nice.', 5),
(8, 1006, 'Good fit and comfortable material.', 4),
(9, 1007, 'The beige color is easy to match.', 4),
(9, 1008, 'Very comfortable for casual outfits.', 5),
(10, 1009, 'Clean and simple design.', 4),
(10, 1000, 'The shirt feels comfortable all day.', 5),
(11, 1001, 'Nice navy color and good quality.', 5),
(11, 1002, 'Fits nicely and looks clean.', 4),
(12, 1003, 'The oversized fit is really comfortable.', 5),
(12, 1004, 'Great for a casual outfit.', 4),
(13, 1005, 'Simple black shirt that goes with everything.', 5),
(13, 1006, 'Good quality and comfortable fabric.', 4),
(14, 1007, 'The blue color looks really good.', 5),
(14, 1008, 'Nice casual style.', 4),
(15, 1009, 'Very light and comfortable.', 5),
(15, 1000, 'Good cotton material.', 4),
(16, 1001, 'Looks great with jeans.', 5),
(16, 1002, 'Comfortable oversized style.', 4),
(17, 1003, 'The gray color is nice and neutral.', 4),
(17, 1004, 'Very comfortable for everyday use.', 5),
(18, 1005, 'The quality feels better than expected.', 5),
(18, 1006, 'Premium looking shirt.', 4),
(19, 1007, 'Simple and comfortable.', 4),
(19, 1008, 'Good basic shirt for everyday wear.', 5),
(20, 1009, 'The green color is beautiful.', 5),
(20, 1000, 'Comfortable and stylish.', 4),
(21, 1001, 'The fabric feels thick and durable.', 5),
(21, 1002, 'Good heavyweight shirt.', 4),
(22, 1003, 'The cream color looks great.', 5),
(22, 1004, 'Very easy to match with other clothes.', 4),
(23, 1005, 'Nice shirt for casual activities.', 4),
(23, 1006, 'Comfortable and lightweight.', 5),
(24, 1007, 'The loose fit is very comfortable.', 5),
(24, 1008, 'Great casual shirt.', 4),
(25, 1009, 'Simple black design that I really like.', 5),
(25, 1000, 'Good fit and comfortable.', 4),
(26, 1001, 'The olive color looks unique.', 5),
(26, 1002, 'Nice everyday shirt.', 4),
(27, 1003, 'The material feels premium.', 5),
(27, 1004, 'Very comfortable and well made.', 4),
(28, 1005, 'Nice beige color.', 4),
(28, 1006, 'Simple and comfortable.', 5),
(29, 1007, 'The navy color looks modern.', 5),
(29, 1008, 'Good shirt for casual outfits.', 4),
(30, 1009, 'Very comfortable white shirt.', 5),
(30, 1000, 'Simple design and good quality.', 4);

-- ==============================================================================
-- 7. SEED CARTS
-- ==============================================================================
INSERT INTO carts (id, user_id) VALUES
(1, 1000),
(2, 1001),
(3, 1002),
(4, 1003),
(5, 1004),
(6, 1006);

INSERT INTO cart_items (cart_id, stock_id, quantity)
SELECT v.cart_id, ps.id, v.quantity
FROM (VALUES
    (1, 25, 'M', 'Blue', 1),
    (2, 20, 'L', 'Green', 1),
    (3, 26, 'XL', 'Red', 1),
    (4, 5, 'M', 'Blue', 1),
    (5, 18, 'M', 'Blue', 1),
    (6, 8, 'XXL', 'Blue', 2)
) AS v(cart_id, product_id, size, color, quantity)
JOIN product_stocks ps
  ON ps.product_id = v.product_id
 AND ps.size = v.size::item_size
 AND ps.color = v.color::color;

-- ==============================================================================
-- 8. SEED ORDERS (placed orders only: checkout / completed)
-- ==============================================================================
INSERT INTO orders (id, user_id, status, subtotal, discount, delivery_fee, promo_code) VALUES
(1, 1000, 'completed', 240, 20, 15, 'SALE20'),
(2, 1000, 'completed', 144, 0, 15, NULL),
(3, 1000, 'completed', 200, 0, 0, 'FREESHIP'),
(4, 1000, 'checkout', 375, 30, 15, 'VIP30'),
(5, 1001, 'completed', 316, 50, 15, 'HALFOFF'),
(6, 1001, 'completed', 270, 0, 15, NULL),
(7, 1001, 'checkout', 175, 0, 15, NULL),
(8, 1002, 'completed', 300, 0, 0, NULL),
(9, 1002, 'completed', 220, 0, 15, NULL),
(10, 1003, 'completed', 145, 0, 15, NULL),
(11, 1003, 'completed', 310, 30, 0, 'SAVE30'),
(12, 1004, 'completed', 145, 0, 15, NULL),
(13, 1005, 'completed', 195, 0, 15, NULL),
(14, 1007, 'completed', 185, 0, 15, NULL);

-- ==============================================================================
-- 9. SEED ORDER ITEMS
-- ==============================================================================
INSERT INTO order_items (order_id, stock_id, title, image, quantity, price_at_purchase)
SELECT v.order_id, ps.id, p.title, p.image, v.quantity, v.price_at_purchase
FROM (VALUES
    (1, 1, 'L', 'Blue', 2, 120),
    (2, 2, 'M', 'Green', 1, 144),
    (3, 5, 'L', 'Green', 1, 200),
    (4, 11, 'XL', 'Blue', 3, 125),
    (5, 3, 'S', 'Green', 1, 180),
    (5, 4, 'S', 'Blue', 1, 136),
    (6, 7, 'M', 'Red', 2, 135),
    (7, 16, 'M', 'Blue', 1, 175),
    (8, 30, 'XL', 'Green', 2, 150),
    (9, 18, 'L', 'Green', 1, 220),
    (10, 15, 'S', 'Green', 1, 145),
    (11, 23, 'S', 'Red', 2, 155),
    (12, 15, 'L', 'Green', 1, 145),
    (13, 21, 'S', 'Blue', 1, 195),
    (14, 20, 'L', 'Red', 1, 185)
) AS v(order_id, product_id, size, color, quantity, price_at_purchase)
JOIN product_stocks ps
  ON ps.product_id = v.product_id
 AND ps.size = v.size::item_size
 AND ps.color = v.color::color
JOIN products p ON p.id = v.product_id;

-- ==============================================================================
-- 10. RESYNC IDENTITY SEQUENCES
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('carts', 'id'), (SELECT MAX(id) FROM carts));
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT MAX(id) FROM orders));
