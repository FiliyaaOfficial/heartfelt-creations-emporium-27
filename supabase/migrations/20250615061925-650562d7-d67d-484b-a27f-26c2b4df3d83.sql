
-- Create a storage bucket for custom order inspiration images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-order-images',
  'custom-order-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy to allow anyone to upload images
CREATE POLICY "Anyone can upload custom order images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'custom-order-images');

-- Create policy to allow anyone to view uploaded images
CREATE POLICY "Anyone can view custom order images"
ON storage.objects FOR SELECT
USING (bucket_id = 'custom-order-images');

-- Add image_urls column to custom_orders table to store the uploaded image URLs
ALTER TABLE public.custom_orders 
ADD COLUMN image_urls TEXT[] DEFAULT '{}';
