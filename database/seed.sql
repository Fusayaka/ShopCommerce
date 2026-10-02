-- ==============================================================================
-- 1. CLEAR OLD DATA
-- ==============================================================================
TRUNCATE TABLE order_items, orders, comments, products, users RESTART IDENTITY CASCADE;

-- ==============================================================================
-- 2. SEED USERS (10 Users, ids 1000-1009)
-- ==============================================================================
INSERT INTO users (id, name, email, avatar, description) VALUES
(1000, 'Minh Nguyen', 'minh@example.com', 'https://i.pravatar.cc/150?img=11', 'Streetwear enthusiast and weekend sneakerhead.'),
(1001, 'Lan Pham', 'lan@example.com', 'https://i.pravatar.cc/150?img=5', 'Loves minimal basics and soft cotton tees.'),
(1002, 'Hoang Tran', 'hoang@example.com', 'https://i.pravatar.cc/150?img=15', 'Shops for comfy everyday fits.'),
(1003, 'Trang Le', 'trang@example.com', 'https://i.pravatar.cc/150?img=20', 'Into oversized styles and neutral tones.'),
(1004, 'Khoa Vu', 'khoa@example.com', 'https://i.pravatar.cc/150?img=33', 'Casual dresser who values good fabric.'),
(1005, 'Linh Bui', 'linh@example.com', 'https://i.pravatar.cc/150?img=44', 'Fan of bold colors and premium cotton.'),
(1006, 'Tuan Do', 'tuan@example.com', 'https://i.pravatar.cc/150?img=55', 'Collects classic tees in every color.'),
(1007, 'Ngoc Dang', 'ngoc@example.com', 'https://i.pravatar.cc/150?img=66', 'Prefers relaxed fits for daily wear.'),
(1008, 'Dat Ngo', 'dat@example.com', 'https://i.pravatar.cc/150?img=36', 'Always hunting for a good promo.'),
(1009, 'Huyen Ly', 'huyen@example.com', 'https://i.pravatar.cc/150?img=38', 'Likes clean, simple designs.');

-- ==============================================================================
-- 3. SEED PRODUCTS (30 Products)
-- ==============================================================================
INSERT INTO products (id, title, original_price, promotion_price, rating, num_reviews, image) VALUES
(1, 'Owen Blue T-Shirt', 126, 120, 4.5, 214, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(2, 'Lyn White T-Shirt', 169, 144, 3.5, 98, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(3, 'AC White T-Shirt', 200, 180, 4.3, 176, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(4, 'SC Black T-Shirt', 148, 136, 3.0, 54, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(5, 'Proclub White T-Shirt', 222, 200, 4.0, 132, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(6, 'Classic Black T-Shirt', 150, NULL, 4.2, 143, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(7, 'Essential Gray T-Shirt', 135, NULL, 4.0, 87, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(8, 'Urban Green T-Shirt', 183, 165, 4.4, 165, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(9, 'Relaxed Beige T-Shirt', 206, 175, 4.6, 231, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(10, 'Minimal Gray T-Shirt', 190, NULL, 4.1, 76, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(11, 'Classic Navy T-Shirt', 140, 125, 4.2, 119, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(12, 'Oversized White T-Shirt', 180, 155, 4.5, 188, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(13, 'Essential Black T-Shirt', 130, NULL, 3.8, 63, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(14, 'Vintage Blue T-Shirt', 190, 165, 4.3, 147, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(15, 'Soft Cotton White T-Shirt', 145, NULL, 4.1, 102, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(16, 'Street Black T-Shirt', 200, 175, 4.4, 159, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(17, 'Relax Fit Gray T-Shirt', 160, NULL, 4.0, 91, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(18, 'Premium Blue T-Shirt', 250, 220, 4.7, 276, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(19, 'Daily White T-Shirt', 110, NULL, 3.9, 48, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(20, 'Modern Green T-Shirt', 210, 185, 4.5, 203, 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(21, 'Heavy Cotton Black T-Shirt', 220, 195, 4.6, 221, 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(22, 'Basic Cream T-Shirt', 125, NULL, 4.0, 72, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(23, 'Sporty Blue T-Shirt', 175, 155, 4.2, 134, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(24, 'Loose Fit White T-Shirt', 195, 170, 4.3, 151, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(25, 'Simple Black T-Shirt', 140, NULL, 3.7, 39, 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(26, 'Classic Olive T-Shirt', 205, 180, 4.4, 168, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(27, 'Premium Gray T-Shirt', 240, 210, 4.8, 312, 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(28, 'Everyday Beige T-Shirt', 135, NULL, 4.1, 84, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(29, 'Urban Navy T-Shirt', 185, 165, 4.5, 192, 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(30, 'Comfort Fit White T-Shirt', 175, 150, 4.2, 127, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80');


-- ==============================================================================
-- 4. SEED COMMENTS (60 Comments)
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
-- 5. SEED ORDERS (20 Orders)
-- ==============================================================================
INSERT INTO orders (id, user_id, status, subtotal, discount, delivery_fee, promo_code) VALUES
('11111111-0000-0000-0000-000000000001', 1000, 'completed', 240, 20, 15, 'SALE20'),
('11111111-0000-0000-0000-000000000002', 1000, 'completed', 144, 0, 15, NULL),
('11111111-0000-0000-0000-000000000003', 1000, 'completed', 200, 0, 0, 'FREESHIP'),
('11111111-0000-0000-0000-000000000004', 1000, 'checkout', 375, 30, 15, 'VIP30'),
('11111111-0000-0000-0000-000000000005', 1000, 'cart', 140, 0, 15, NULL),
('11111111-0000-0000-0000-000000000006', 1001, 'completed', 316, 50, 15, 'HALFOFF'),
('11111111-0000-0000-0000-000000000007', 1001, 'completed', 270, 0, 15, NULL),
('11111111-0000-0000-0000-000000000008', 1001, 'checkout', 175, 0, 15, NULL),
('11111111-0000-0000-0000-000000000009', 1001, 'cart', 185, 10, 15, 'NEW10'),
('11111111-0000-0000-0000-000000000010', 1002, 'completed', 300, 0, 0, NULL),
('11111111-0000-0000-0000-000000000011', 1002, 'completed', 220, 0, 15, NULL),
('11111111-0000-0000-0000-000000000012', 1002, 'cart', 180, 0, 15, NULL),
('11111111-0000-0000-0000-000000000013', 1003, 'completed', 145, 0, 15, NULL),
('11111111-0000-0000-0000-000000000014', 1003, 'completed', 310, 30, 0, 'SAVE30'),
('11111111-0000-0000-0000-000000000015', 1003, 'cart', 200, 0, 15, NULL),
('11111111-0000-0000-0000-000000000016', 1004, 'completed', 145, 0, 15, NULL),
('11111111-0000-0000-0000-000000000017', 1004, 'cart', 220, 0, 15, NULL),
('11111111-0000-0000-0000-000000000018', 1005, 'completed', 195, 0, 15, NULL),
('11111111-0000-0000-0000-000000000019', 1006, 'cart', 330, 30, 0, 'BULK30'),
('11111111-0000-0000-0000-000000000020', 1007, 'completed', 185, 0, 15, NULL);

-- ==============================================================================
-- 6. SEED ORDER ITEMS (21 Order Items)
-- ==============================================================================
INSERT INTO order_items (order_id, product_id, size, color, quantity, unit_price) VALUES
('11111111-0000-0000-0000-000000000001', 1, 'L', 'Blue', 2, 120),
('11111111-0000-0000-0000-000000000002', 2, 'M', 'White', 1, 144),
('11111111-0000-0000-0000-000000000003', 5, 'L', 'White', 1, 200),
('11111111-0000-0000-0000-000000000004', 11, 'XL', 'Blue', 3, 125),
('11111111-0000-0000-0000-000000000005', 25, 'M', 'Black', 1, 140),
('11111111-0000-0000-0000-000000000006', 3, 'S', 'White', 1, 180),
('11111111-0000-0000-0000-000000000006', 4, 'S', 'Black', 1, 136),
('11111111-0000-0000-0000-000000000007', 7, 'M', 'Grey', 2, 135),
('11111111-0000-0000-0000-000000000008', 16, 'M', 'Black', 1, 175),
('11111111-0000-0000-0000-000000000009', 20, 'L', 'Green', 1, 185),
('11111111-0000-0000-0000-000000000010', 30, 'XL', 'White', 2, 150),
('11111111-0000-0000-0000-000000000011', 18, 'L', 'White', 1, 220),
('11111111-0000-0000-0000-000000000012', 26, 'XL', 'White', 1, 180),
('11111111-0000-0000-0000-000000000013', 15, 'S', 'White', 1, 145),
('11111111-0000-0000-0000-000000000014', 23, 'S', 'Red', 2, 155),
('11111111-0000-0000-0000-000000000015', 5, 'M', 'Black', 1, 200),
('11111111-0000-0000-0000-000000000016', 15, 'L', 'White', 1, 145),
('11111111-0000-0000-0000-000000000017', 18, 'M', 'Blue', 1, 220),
('11111111-0000-0000-0000-000000000018', 21, 'S', 'Black', 1, 195),
('11111111-0000-0000-0000-000000000019', 8, 'XXL', 'Blue', 2, 165),
('11111111-0000-0000-0000-000000000020', 20, 'L', 'Grey', 1, 185);
