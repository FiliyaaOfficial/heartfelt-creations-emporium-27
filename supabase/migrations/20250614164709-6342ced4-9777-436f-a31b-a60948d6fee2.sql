
-- Create blog_posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reading_time INTEGER DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true
);

-- Create index on slug for faster lookups
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published_at ON public.blog_posts(published_at DESC);

-- Insert dummy blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, cover_image, author, published_at, reading_time, tags) VALUES
(
  'Handcrafting with Love: The Art of Personalized Gifts',
  'handcrafting-with-love',
  'Discover the joy and meaning behind handcrafted personalized gifts and why they make the perfect present for your loved ones.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=1200&auto=format&fit=crop',
  'Sarah Johnson',
  '2025-03-15T10:30:00Z',
  8,
  ARRAY['handcraft', 'personalized', 'gifts']
),
(
  'The Perfect Gift Guide for Every Occasion',
  'gift-guide-for-every-occasion',
  'From birthdays to anniversaries, find the ideal handmade gift for any special moment in your loved ones'' lives.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=1200&auto=format&fit=crop',
  'Michael Chen',
  '2025-03-10T14:45:00Z',
  6,
  ARRAY['gifts', 'guide', 'occasions']
),
(
  'The Sustainable Gift Revolution: Eco-Friendly Choices',
  'sustainable-gift-revolution',
  'How our handcrafted gifts are not only beautiful but also environmentally conscious and sustainable.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'https://images.unsplash.com/photo-1610114113404-0d9769eb5b82?q=80&w=1200&auto=format&fit=crop',
  'Emma Rodriguez',
  '2025-03-05T09:15:00Z',
  7,
  ARRAY['sustainable', 'eco-friendly', 'environment']
),
(
  'Behind the Scenes: Meet Our Artisan Craftspeople',
  'meet-our-artisan-craftspeople',
  'Get to know the talented individuals who pour their heart and soul into creating our beautiful handcrafted items.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'https://images.unsplash.com/photo-1507236827745-1a76294d9ab2?q=80&w=1200&auto=format&fit=crop',
  'David Wilson',
  '2025-02-28T16:20:00Z',
  5,
  ARRAY['artisan', 'craftspeople', 'behind-scenes']
),
(
  'Customer Stories: Memorable Gifts That Changed Lives',
  'customer-stories-memorable-gifts',
  'Heartwarming stories from our customers about how our personalized gifts created unforgettable moments.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'https://images.unsplash.com/photo-1559452214-f4901ae5a753?q=80&w=1200&auto=format&fit=crop',
  'Jessica Taylor',
  '2025-02-20T11:10:00Z',
  9,
  ARRAY['customer-stories', 'testimonials', 'memorable']
);
