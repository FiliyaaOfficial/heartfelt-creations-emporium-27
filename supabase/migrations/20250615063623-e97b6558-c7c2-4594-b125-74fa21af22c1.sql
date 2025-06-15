
-- Enable RLS on custom_orders table if not already enabled
ALTER TABLE public.custom_orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert custom orders (public form submissions)
CREATE POLICY "Anyone can submit custom orders" 
  ON public.custom_orders 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reading custom orders (for admin purposes)
CREATE POLICY "Public read access for custom orders" 
  ON public.custom_orders 
  FOR SELECT 
  USING (true);
