
-- Create product_reviews table to store user reviews with images
CREATE TABLE public.product_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  review_images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for review images
INSERT INTO storage.buckets (id, name, public) VALUES ('review-images', 'review-images', true);

-- Create storage policies for review images
CREATE POLICY "Anyone can view review images" ON storage.objects FOR SELECT USING (bucket_id = 'review-images');
CREATE POLICY "Authenticated users can upload review images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'review-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update their own review images" ON storage.objects FOR UPDATE USING (bucket_id = 'review-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own review images" ON storage.objects FOR DELETE USING (bucket_id = 'review-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable RLS on product_reviews
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for product_reviews
CREATE POLICY "Anyone can view approved reviews" ON public.product_reviews
FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can create reviews" ON public.product_reviews
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON public.product_reviews
FOR UPDATE USING (user_id = auth.uid());

-- Create applied_coupons table to track coupon usage
CREATE TABLE public.applied_coupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  coupon_id UUID REFERENCES public.coupon_codes(id) ON DELETE CASCADE,
  discount_amount NUMERIC NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on applied_coupons
ALTER TABLE public.applied_coupons ENABLE ROW LEVEL SECURITY;

-- Create policy for applied_coupons
CREATE POLICY "Users can view their own applied coupons" ON public.applied_coupons
FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- Add coupon_discount column to orders table
ALTER TABLE public.orders ADD COLUMN coupon_discount NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN coupon_code TEXT;

-- Create function to validate and apply coupon
CREATE OR REPLACE FUNCTION public.validate_coupon(
  coupon_code_input TEXT,
  order_amount NUMERIC
) RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coupon_record RECORD;
  discount_amount NUMERIC := 0;
  result JSON;
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
