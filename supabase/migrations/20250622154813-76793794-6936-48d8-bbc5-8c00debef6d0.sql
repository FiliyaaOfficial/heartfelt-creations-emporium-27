
-- Add OTP verification support and improve user profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS shipping_address jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone_verified boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_verified boolean DEFAULT false;

-- Add more detailed order tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery_date date;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_notes text;

-- Create order status history table for detailed tracking
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  status_message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  created_by text DEFAULT 'system'
);

-- Add RLS policies for order status history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their order status history" ON order_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create customer testimonials table
CREATE TABLE IF NOT EXISTS customer_testimonials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name text NOT NULL,
  customer_image text,
  testimonial_text text NOT NULL,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  product_id uuid REFERENCES products(id),
  is_featured boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add RLS for testimonials (public read)
ALTER TABLE customer_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published testimonials" ON customer_testimonials
  FOR SELECT USING (is_published = true);

-- Insert sample testimonials
INSERT INTO customer_testimonials (customer_name, customer_image, testimonial_text, rating, is_featured) VALUES
('Priya Sharma', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Absolutely loved the personalized gift! The quality exceeded my expectations and the delivery was super fast.', 5, true),
('Rahul Kumar', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Great experience with Filiyaa. The custom order process was smooth and the final product was exactly what I wanted.', 5, true),
('Anita Desai', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Beautiful handcrafted items with excellent packaging. Will definitely order again for special occasions.', 4, true);

-- Create function to automatically create order status history
CREATE OR REPLACE FUNCTION create_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert initial status when order is created
  IF TG_OP = 'INSERT' THEN
    INSERT INTO order_status_history (order_id, status, status_message)
    VALUES (NEW.id, NEW.status, 'Order placed successfully');
    RETURN NEW;
  END IF;
  
  -- Insert status change when order is updated
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    INSERT INTO order_status_history (order_id, status, status_message)
    VALUES (NEW.id, NEW.status, 
      CASE NEW.status
        WHEN 'processing' THEN 'Order is being prepared'
        WHEN 'shipped' THEN 'Order has been shipped'
        WHEN 'delivered' THEN 'Order delivered successfully'
        WHEN 'cancelled' THEN 'Order has been cancelled'
        ELSE 'Status updated'
      END
    );
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for order status history
DROP TRIGGER IF EXISTS order_status_history_trigger ON orders;
CREATE TRIGGER order_status_history_trigger
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION create_order_status_history();
