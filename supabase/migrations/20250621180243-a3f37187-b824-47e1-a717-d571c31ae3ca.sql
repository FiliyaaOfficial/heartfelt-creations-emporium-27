
-- Create a table to track first-time buyers for coupon eligibility
CREATE TABLE public.user_purchase_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  total_orders INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_purchase_history
ALTER TABLE public.user_purchase_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user_purchase_history
CREATE POLICY "Users can view their own purchase history" ON public.user_purchase_history
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert purchase history" ON public.user_purchase_history
FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update purchase history" ON public.user_purchase_history
FOR UPDATE USING (true);

-- Insert the first-time buyer coupon code
INSERT INTO public.coupon_codes (
  code,
  description,
  discount_type,
  discount_value,
  minimum_order_amount,
  maximum_discount_amount,
  is_active,
  valid_from,
  valid_until
) VALUES (
  'FIRST50',
  '50% off on your first order above ₹799',
  'percentage',
  50,
  799,
  2000,
  true,
  now(),
  now() + interval '1 year'
);

-- Add a column to track if user has used first-time buyer discount
ALTER TABLE public.orders ADD COLUMN is_first_order BOOLEAN DEFAULT false;

-- Create function to check if user is eligible for first-time buyer discount
CREATE OR REPLACE FUNCTION public.is_first_time_buyer(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user has any previous orders
  RETURN NOT EXISTS (
    SELECT 1 FROM public.orders 
    WHERE customer_email = user_email 
    AND payment_status = 'completed'
  );
END;
$$;

-- Update the validate_coupon function to check first-time buyer eligibility for FIRST50
CREATE OR REPLACE FUNCTION public.validate_coupon(
  coupon_code_input TEXT,
  order_amount NUMERIC,
  user_email TEXT DEFAULT NULL
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
  discount_amount NUMERIC := 0;
  result JSON;
  is_first_buyer BOOLEAN := false;
BEGIN
  -- Get coupon details
  SELECT * INTO coupon_record 
  FROM public.coupon_codes 
  WHERE code = coupon_code_input 
    AND is_active = true 
    AND (valid_from IS NULL OR valid_from <= now())
    AND (valid_until IS NULL OR valid_until >= now())
    AND (usage_limit IS NULL OR used_count < usage_limit);
  
  -- Check if coupon exists and is valid
  IF coupon_record IS NULL THEN
    result := json_build_object('valid', false, 'message', 'Invalid or expired coupon code');
    RETURN result;
  END IF;
  
  -- Special validation for FIRST50 coupon
  IF coupon_code_input = 'FIRST50' AND user_email IS NOT NULL THEN
    SELECT public.is_first_time_buyer(user_email) INTO is_first_buyer;
    IF NOT is_first_buyer THEN
      result := json_build_object('valid', false, 'message', 'This coupon is only valid for first-time buyers');
      RETURN result;
    END IF;
  END IF;
  
  -- Check minimum order amount
  IF coupon_record.minimum_order_amount > 0 AND order_amount < coupon_record.minimum_order_amount THEN
    result := json_build_object(
      'valid', false, 
      'message', 'Minimum order amount of ₹' || coupon_record.minimum_order_amount || ' required'
    );
    RETURN result;
  END IF;
  
  -- Calculate discount
  IF coupon_record.discount_type = 'percentage' THEN
    discount_amount := (order_amount * coupon_record.discount_value / 100);
    -- Apply maximum discount limit if set
    IF coupon_record.maximum_discount_amount > 0 AND discount_amount > coupon_record.maximum_discount_amount THEN
      discount_amount := coupon_record.maximum_discount_amount;
    END IF;
  ELSIF coupon_record.discount_type = 'fixed' THEN
    discount_amount := coupon_record.discount_value;
    -- Don't let discount exceed order amount
    IF discount_amount > order_amount THEN
      discount_amount := order_amount;
    END IF;
  END IF;
  
  result := json_build_object(
    'valid', true,
    'discount_amount', discount_amount,
    'coupon_id', coupon_record.id,
    'description', coupon_record.description
  );
  
  RETURN result;
END;
$$;
