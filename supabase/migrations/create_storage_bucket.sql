
-- Create storage bucket for custom order images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'custom-order-images',
  'custom-order-images', 
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create policies for the storage bucket
CREATE POLICY "Anyone can upload custom order images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'custom-order-images');

CREATE POLICY "Anyone can view custom order images"
ON storage.objects FOR SELECT
USING (bucket_id = 'custom-order-images');

CREATE POLICY "Anyone can delete custom order images"
ON storage.objects FOR DELETE
USING (bucket_id = 'custom-order-images');
