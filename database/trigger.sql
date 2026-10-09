DO $$
DECLARE
    t text;
BEGIN
    FOREACH t IN ARRAY ARRAY[
        'users', 'products', 'product_stocks', 'comments', 'carts', 'cart_items', 'orders'
    ]
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_update_updated_at ON %I', t);
        EXECUTE format(
            'CREATE TRIGGER trigger_update_updated_at
                 BEFORE UPDATE ON %I
                 FOR EACH ROW EXECUTE FUNCTION update_updated_at_col()', t);
    END LOOP;
END $$;


DROP TRIGGER IF EXISTS trigger_update_product_rating ON comments;
CREATE TRIGGER trigger_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();


DROP TRIGGER IF EXISTS trigger_update_order_status ON orders;
CREATE TRIGGER trigger_update_order_status
BEFORE UPDATE OF status ON orders
FOR EACH ROW
EXECUTE FUNCTION update_order_status();


DROP TRIGGER IF EXISTS trigger_clamp_cart_items ON product_stocks;
CREATE TRIGGER trigger_clamp_cart_items
AFTER UPDATE OF stock ON product_stocks
FOR EACH ROW
EXECUTE FUNCTION clamp_cart_items_to_stock();
