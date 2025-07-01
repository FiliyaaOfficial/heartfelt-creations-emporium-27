
-- Create storage bucket for product customization images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-customizations',
  'product-customizations', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create policies for the storage bucket
CREATE POLICY "Anyone can upload product customization images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-customizations');

CREATE POLICY "Anyone can view product customization images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-customizations');

CREATE POLICY "Anyone can delete product customization images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-customizations');
