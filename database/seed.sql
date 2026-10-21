-- ==============================================================================
-- 1. CLEAR OLD DATA
-- ==============================================================================
TRUNCATE TABLE order_items, orders, cart_items, carts, comments, product_stocks, products, users RESTART IDENTITY CASCADE;

-- ==============================================================================
-- 2. SEED USERS (10 Users, ids 1000-1009)
-- ==============================================================================
-- password is a bcrypt hash of "admin123" (same for every user).
INSERT INTO users (id, name, email, password, avatar, contact, address, description) VALUES
(1000, 'Minh Nguyen', 'minh@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=11', '+84 901 000 001', '12 Le Loi, District 1, Ho Chi Minh City', 'Streetwear enthusiast and weekend sneakerhead.'),
(1001, 'Lan Pham', 'lan@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=5', '+84 901 000 002', '45 Nguyen Hue, District 1, Ho Chi Minh City', 'Loves minimal basics and soft cotton tees.'),
(1002, 'Hoang Tran', 'hoang@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=15', '+84 901 000 003', '78 Tran Hung Dao, District 5, Ho Chi Minh City', 'Shops for comfy everyday fits.'),
(1003, 'Trang Le', 'trang@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=20', '+84 901 000 004', '23 Hai Ba Trung, District 3, Ho Chi Minh City', 'Into oversized styles and neutral tones.'),
(1004, 'Khoa Vu', 'khoa@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=33', '+84 901 000 005', '9 Pham Ngu Lao, District 1, Ho Chi Minh City', 'Casual dresser who values good fabric.'),
(1005, 'Linh Bui', 'linh@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=44', '+84 901 000 006', '67 Vo Van Tan, District 3, Ho Chi Minh City', 'Fan of bold colors and premium cotton.'),
(1006, 'Tuan Do', 'tuan@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=55', '+84 901 000 007', '34 Dien Bien Phu, Binh Thanh, Ho Chi Minh City', 'Collects classic tees in every color.'),
(1007, 'Ngoc Dang', 'ngoc@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=66', '+84 901 000 008', '101 Cach Mang Thang 8, District 10, Ho Chi Minh City', 'Prefers relaxed fits for daily wear.'),
(1008, 'Dat Ngo', 'dat@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=36', '+84 901 000 009', '56 Ly Thuong Kiet, District 11, Ho Chi Minh City', 'Always hunting for a good promo.'),
(1009, 'Huyen Ly', 'huyen@example.com', '$2b$10$5i3xf9.RLDnSUb.kUKKtLOHPHFWcY9LfJvdtqjeDfFXsfMJDQwBvK', 'https://i.pravatar.cc/150?img=38', '+84 901 000 010', '88 Nguyen Trai, District 5, Ho Chi Minh City', 'Likes clean, simple designs.');

-- Roles: everyone defaults to 'customer'; promote a couple for testing.
UPDATE users SET role = 'admin'   WHERE id = 1000;
UPDATE users SET role = 'manager' WHERE id = 1001;

-- ==============================================================================
-- 3. SEED PRODUCTS (30 Products)
-- ==============================================================================
INSERT INTO products (id, title, image) VALUES
(1, 'Owen Blue T-Shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(2, 'Lyn White T-Shirt', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(3, 'AC White T-Shirt', 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(4, 'SC Black T-Shirt', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(5, 'Proclub White T-Shirt', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(6, 'Classic Black T-Shirt', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(7, 'Essential Gray T-Shirt', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(8, 'Urban Green T-Shirt', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(9, 'Relaxed Beige T-Shirt', 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(10, 'Minimal Gray T-Shirt', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(11, 'Classic Navy T-Shirt', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(12, 'Oversized White T-Shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(13, 'Essential Black T-Shirt', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(14, 'Vintage Blue T-Shirt', 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(15, 'Soft Cotton White T-Shirt', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(16, 'Street Black T-Shirt', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(17, 'Relax Fit Gray T-Shirt', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(18, 'Premium Blue T-Shirt', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(19, 'Daily White T-Shirt', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80'),
(20, 'Modern Green T-Shirt', 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=600&q=80'),
(21, 'Heavy Cotton Black T-Shirt', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'),
(22, 'Basic Cream T-Shirt', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80'),
(23, 'Sporty Blue T-Shirt', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'),
(24, 'Loose Fit White T-Shirt', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80'),
(25, 'Simple Black T-Shirt', 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=600&q=80'),
(26, 'Classic Olive T-Shirt', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'),
(27, 'Premium Gray T-Shirt', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'),
(28, 'Everyday Beige T-Shirt', 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80'),
(29, 'Urban Navy T-Shirt', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80'),
(30, 'Comfort Fit White T-Shirt', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80');

-- ==============================================================================
-- 4. SEED PRODUCT STOCKS (variants)
-- ==============================================================================
WITH protected(product_id, size, color) AS (
    VALUES
        -- cart items
        (25, 'M', 'Blue'), (20, 'L', 'Green'), (26, 'XL', 'Red'),
        (5, 'M', 'Blue'), (18, 'M', 'Blue'), (8, 'XXL', 'Blue'),
        -- order items
        (1, 'L', 'Blue'), (2, 'M', 'Green'), (5, 'L', 'Green'), (11, 'XL', 'Blue'),
        (3, 'S', 'Green'), (4, 'S', 'Blue'), (7, 'M', 'Red'), (16, 'M', 'Blue'),
        (30, 'XL', 'Green'), (18, 'L', 'Green'), (15, 'S', 'Green'), (23, 'S', 'Red'),
        (15, 'L', 'Green'), (21, 'S', 'Blue'), (20, 'L', 'Red')
),
base(product_id, original_price, promotion_price) AS (
    VALUES
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
),
variants AS (
    SELECT b.product_id,
           s.size,
           c.color,
           b.original_price,
           b.promotion_price,
           CASE s.size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 ELSE 5 END AS size_rank,
           CASE c.color WHEN 'Red' THEN 1 WHEN 'Green' THEN 2 ELSE 3 END AS color_rank,
           CASE s.size WHEN 'XL' THEN 15 WHEN 'XXL' THEN 30 ELSE 0 END AS surcharge
    FROM base b
    CROSS JOIN (VALUES ('S'), ('M'), ('L'), ('XL'), ('XXL')) AS s(size)
    CROSS JOIN (VALUES ('Red'), ('Green'), ('Blue')) AS c(color)
)
INSERT INTO product_stocks (product_id, size, color, original_price, promotion_price, stock)
SELECT v.product_id,
       v.size::item_size,
       v.color::color,
       v.original_price + v.surcharge,
       CASE WHEN v.promotion_price IS NULL THEN NULL ELSE v.promotion_price + v.surcharge END,
       CASE WHEN (v.product_id * 5 + v.size_rank + v.color_rank) % 9 = 0
            THEN 0
            ELSE 10 + (v.product_id * 7 + v.size_rank + v.color_rank) % 40
       END AS stock
FROM variants v
WHERE EXISTS (
          SELECT 1 FROM protected pr
          WHERE pr.product_id = v.product_id AND pr.size = v.size AND pr.color = v.color
      )
   OR (
          NOT (v.size = 'XXL' AND v.product_id % 3 = 0)
      AND NOT (v.size = 'XL'  AND v.product_id % 5 = 0)
      AND NOT (v.color = 'Red'  AND v.product_id % 4 = 0)
      AND NOT (v.color = 'Blue' AND v.product_id % 7 = 0)
      );

-- ==============================================================================
-- 4b. DERIVE products.price (lowest display price) from the seeded variants.
--     Same logic as the update_product_price trigger, so it is correct whether
--     or not that trigger is installed at seed time.
-- ==============================================================================
UPDATE products p
SET price = COALESCE(
    (SELECT MIN(promotion_price) FROM product_stocks s WHERE s.product_id = p.id),
    (SELECT MIN(original_price)  FROM product_stocks s WHERE s.product_id = p.id),
    0
);

-- ==============================================================================
-- 5. SEED COMMENTS (varied so ratings differ widely)
--    Distribution (products.rating / num_reviews are derived from this below):
--      * no reviews  : 4, 17, 22, 30                       -> rating 0 ("New")
--      * many + high : 1, 2, 7, 13                         -> ~4.6-4.7
--      * many + low  : 18, 21, 27                          -> ~1.3-1.8
--      * mixed/medium: 3, 5, 8, 16, 20, 28, 29             -> ~2.3-3.5
--      * few / single: 6, 9, 10, 11, 12, 14, 15, 19, 23, 24, 25, 26
-- ==============================================================================
INSERT INTO comments (product_id, user_id, content, rating) VALUES
-- Product 1: many reviews, high rating
(1, 1001, 'Super comfortable and the fabric feels premium.', 5),
(1, 1002, 'Fits true to size and the color is great.', 5),
(1, 1003, 'Really nice shirt, would buy again.', 4),
(1, 1004, 'Best basic tee I own right now.', 5),
(1, 1005, 'Soft, breathable and well made.', 4),
(1, 1006, 'Love it, washes well with no shrinking.', 5),
(1, 1007, 'Great value, looks more expensive than it is.', 5),
-- Product 2: many reviews, high rating
(2, 1008, 'Excellent quality cotton, very soft.', 5),
(2, 1009, 'Clean white, exactly like the photo.', 4),
(2, 1000, 'Fits perfectly and feels durable.', 5),
(2, 1001, 'Comfortable for all-day wear.', 4),
(2, 1002, 'Great shirt, highly recommend.', 5),
-- Product 3: low-medium
(3, 1003, 'Thinner than expected for the price.', 2),
(3, 1004, 'It is okay, nothing special.', 3),
(3, 1005, 'Fabric felt a bit rough after washing.', 2),
-- Product 5: medium
(5, 1006, 'Decent shirt but the fit is a little boxy.', 3),
(5, 1007, 'Comfortable enough for everyday use.', 4),
(5, 1008, 'Average quality, does the job.', 3),
(5, 1009, 'Nice and soft, happy with it.', 4),
-- Product 6: single review
(6, 1000, 'Classic fit and good quality.', 4),
-- Product 7: many reviews, high rating
(7, 1001, 'The gray is a perfect neutral, love it.', 5),
(7, 1002, 'Top notch fabric and stitching.', 5),
(7, 1003, 'Very comfortable, slightly long but fine.', 4),
(7, 1004, 'My new favorite everyday tee.', 5),
(7, 1005, 'Great quality for the price.', 5),
(7, 1006, 'Good shirt, fits as expected.', 4),
-- Product 8: medium
(8, 1007, 'The green is nice but the fabric is thin.', 3),
(8, 1008, 'Comfortable and good color.', 4),
(8, 1009, 'Fits well, decent material.', 4),
(8, 1000, 'Okay for the price, nothing amazing.', 3),
-- Product 9: two reviews
(9, 1007, 'The beige color is easy to match.', 4),
(9, 1008, 'Comfortable for casual outfits.', 4),
-- Product 10: two reviews
(10, 1001, 'Clean, minimal and very comfortable.', 5),
(10, 1002, 'Good gray tee, soft fabric.', 4),
-- Product 11: three reviews, high rating
(11, 1001, 'Nice navy color and great quality.', 5),
(11, 1002, 'Fits nicely and looks clean.', 4),
(11, 1003, 'Really solid everyday shirt.', 5),
-- Product 12: single review
(12, 1003, 'Oversized fit is fine but runs very large.', 3),
-- Product 13: many reviews, high rating
(13, 1004, 'Perfect black tee, goes with everything.', 5),
(13, 1005, 'Great fabric, holds its shape well.', 4),
(13, 1006, 'Excellent quality, very comfortable.', 5),
(13, 1007, 'Love the fit and the material.', 5),
(13, 1008, 'Solid basic, would rebuy.', 4),
(13, 1009, 'Best black shirt I have bought.', 5),
-- Product 14: two reviews
(14, 1007, 'The blue is nice but a bit thin.', 3),
(14, 1008, 'Decent casual style.', 4),
-- Product 15: two reviews
(15, 1000, 'Soft cotton and light, very nice.', 4),
(15, 1001, 'Super comfortable, great for summer.', 5),
-- Product 16: medium-low
(16, 1002, 'Color faded a bit after one wash.', 2),
(16, 1003, 'It is alright, the fit is a bit off.', 3),
(16, 1004, 'Not as thick as I hoped.', 2),
-- Product 18: many reviews, low rating
(18, 1005, 'Overpriced for the quality.', 1),
(18, 1006, 'Fabric feels cheap, disappointed.', 2),
(18, 1007, 'Shrunk after the first wash.', 1),
(18, 1008, 'Not worth the premium price.', 2),
(18, 1009, 'Would not buy again.', 1),
-- Product 19: single review
(19, 1007, 'Simple, clean and comfortable.', 4),
-- Product 20: medium
(20, 1000, 'The green is duller than the photo.', 2),
(20, 1001, 'Okay shirt, average fit.', 3),
(20, 1002, 'Comfortable but a bit thin.', 3),
-- Product 21: low rating
(21, 1003, 'Heavy fabric but the stitching came loose.', 2),
(21, 1004, 'Fell apart too quickly.', 1),
(21, 1005, 'Not as durable as advertised.', 2),
(21, 1006, 'Disappointed with the quality.', 2),
-- Product 23: two reviews
(23, 1007, 'Nice sporty fit, good for workouts.', 4),
(23, 1008, 'Decent but a little stiff at first.', 3),
-- Product 24: two reviews
(24, 1009, 'Relaxed fit is really comfortable.', 4),
(24, 1000, 'Good casual shirt, fits well.', 4),
-- Product 25: single review
(25, 1001, 'Simple and perfect, exactly what I wanted.', 5),
-- Product 26: low rating
(26, 1002, 'The olive looks washed out.', 2),
(26, 1003, 'Material is thinner than expected.', 2),
-- Product 27: many reviews, low rating
(27, 1004, 'Way overpriced for what you get.', 1),
(27, 1005, 'Poor quality, felt cheap.', 1),
(27, 1006, 'Not premium at all.', 2),
(27, 1007, 'Disappointed, returned it.', 1),
(27, 1008, 'Fabric pilled after one wear.', 2),
(27, 1009, 'Would not recommend.', 1),
-- Product 28: mixed, low-medium
(28, 1005, 'The beige looks a little dull.', 2),
(28, 1006, 'Okay shirt, average quality.', 3),
-- Product 29: two reviews
(29, 1000, 'The navy is nice but the fit is average.', 3),
(29, 1001, 'Okay shirt for the price.', 3);

-- ==============================================================================
-- 5b. DERIVE products.rating / num_reviews from the seeded comments.
--     Same logic as the update_product_rating trigger, so the aggregates are
--     correct whether or not that trigger is installed at seed time.
--     Products with no comments stay at 0 / 0.
-- ==============================================================================
UPDATE products p
SET rating = COALESCE((
        SELECT ROUND(AVG(c.rating)::numeric, 1)
        FROM comments c
        WHERE c.product_id = p.id
    ), 0),
    num_reviews = (
        SELECT COUNT(*)
        FROM comments c
        WHERE c.product_id = p.id
    );

-- ==============================================================================
-- 6. SEED CARTS
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
-- 7. SEED ORDERS (placed orders only: checkout / completed)
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
-- 8. SEED ORDER ITEMS
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
-- 9. RESYNC IDENTITY SEQUENCES
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('products', 'id'), (SELECT MAX(id) FROM products));
SELECT setval(pg_get_serial_sequence('carts', 'id'), (SELECT MAX(id) FROM carts));
SELECT setval(pg_get_serial_sequence('orders', 'id'), (SELECT MAX(id) FROM orders));
