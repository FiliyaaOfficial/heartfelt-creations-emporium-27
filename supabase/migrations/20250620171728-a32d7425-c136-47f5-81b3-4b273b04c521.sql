
-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create storage bucket for custom order images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('custom-order-images', 'custom-order-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for custom order images
CREATE POLICY "Anyone can upload custom order images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'custom-order-images');

CREATE POLICY "Anyone can view custom order images" ON storage.objects
  FOR SELECT USING (bucket_id = 'custom-order-images');

-- Create storage bucket for customizable product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-customizations', 'product-customizations', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product customization images
CREATE POLICY "Anyone can upload product customization images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-customizations');

CREATE POLICY "Anyone can view product customization images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-customizations');
