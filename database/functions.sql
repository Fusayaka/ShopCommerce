
CREATE OR REPLACE FUNCTION update_updated_at_col()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS trigger AS $$
DECLARE
    v_product_id INT;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        v_product_id := OLD.product_id;
    ELSE
        v_product_id := NEW.product_id;
    END IF;

    UPDATE products
    SET
        rating = COALESCE((
            SELECT ROUND(AVG(rating)::numeric, 1)
            FROM comments
            WHERE product_id = v_product_id
        ), 0),
        num_reviews = (
            SELECT COUNT(*)
            FROM comments
            WHERE product_id = v_product_id
        )
    WHERE id = v_product_id;

    IF (TG_OP = 'DELETE') THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_order_status()
RETURNS trigger AS $$
BEGIN
    IF NEW.status = OLD.status THEN
        RETURN NEW;
    END IF;

    --      Allowed transitions:
    --   pending                  -> processing | cancelled
    --   processing               -> shipping | cancelled
    --   shipping                 -> delivered | cancelled
    --   delivered, cancelled     -> Terminal states
    IF NOT (
        (OLD.status = 'pending'    AND NEW.status IN ('processing', 'cancelled')) OR
        (OLD.status = 'processing' AND NEW.status IN ('shipping', 'cancelled'))   OR
        (OLD.status = 'shipping'   AND NEW.status IN ('delivered', 'cancelled'))
    ) THEN
        RAISE EXCEPTION 'Invalid order status transition: % -> %', OLD.status, NEW.status
            USING ERRCODE = 'check_violation';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION clamp_cart_items_to_stock()
RETURNS trigger AS $$
DECLARE
    affected INT;
BEGIN
    IF NEW.stock >= OLD.stock THEN
        RETURN NULL;
    END IF;

    IF NEW.stock <= 0 THEN
        DELETE FROM cart_items WHERE stock_id = NEW.id;
    ELSE
        UPDATE cart_items
        SET quantity = NEW.stock
        WHERE stock_id = NEW.id
          AND quantity > NEW.stock;
    END IF;

    GET DIAGNOSTICS affected = ROW_COUNT;
    IF affected > 0 THEN
        RAISE NOTICE 'product_stock % dropped to %: adjusted % cart item(s).',
            NEW.id, NEW.stock, affected;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_product_price()
RETURNS trigger AS $$
DECLARE
    v_product_id INT;
BEGIN
    v_product_id := COALESCE(NEW.product_id, OLD.product_id);

    UPDATE products
    SET price = COALESCE(
        (SELECT MIN(promotion_price) FROM product_stocks WHERE product_id = v_product_id),
        (SELECT MIN(original_price)  FROM product_stocks WHERE product_id = v_product_id),
        0
    )
    WHERE id = v_product_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;