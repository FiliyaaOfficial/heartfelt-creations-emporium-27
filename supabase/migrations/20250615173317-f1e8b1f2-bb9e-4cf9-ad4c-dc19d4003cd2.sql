
-- Add a user_id column to the cart_items table to link carts to user accounts
ALTER TABLE public.cart_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Enable Row Level Security on cart_items to protect user data
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Allow logged-in users to access only their own cart items
CREATE POLICY "Authenticated users can access their own cart items"
  ON public.cart_items
  FOR ALL
  USING (auth.uid() = user_id);

-- Allow anonymous users to access carts that are not linked to a user account
CREATE POLICY "Anonymous users can manage their cart"
  ON public.cart_items
  FOR ALL
  USING (user_id IS NULL);

-- Enable Row Level Security on wishlists to protect user data
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Allow logged-in users to access only their own wishlist items
CREATE POLICY "Authenticated users can access their own wishlist"
  ON public.wishlists
  FOR ALL
  USING (auth.uid() = user_id);

-- Allow anonymous users to access wishlists that are not linked to a user account
CREATE POLICY "Anonymous users can manage their wishlist"
  ON public.wishlists
  FOR ALL
  USING (user_id IS NULL);
