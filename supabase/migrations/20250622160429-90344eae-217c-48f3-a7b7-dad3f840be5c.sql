
-- First, let's add RLS policies for the order_status_history table to fix the checkout error
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert order status history for their own orders
CREATE POLICY "Users can insert order status history for their orders" 
  ON public.order_status_history 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Allow users to view order status history for their own orders
CREATE POLICY "Users can view order status history for their orders" 
  ON public.order_status_history 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Add COD availability column to products table
ALTER TABLE public.products ADD COLUMN cod_available boolean DEFAULT true;

-- Update existing products to have COD available by default
UPDATE public.products SET cod_available = true WHERE cod_available IS NULL;
