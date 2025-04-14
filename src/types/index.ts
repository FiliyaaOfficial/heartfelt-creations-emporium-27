
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compare_at_price?: number;
  image_url?: string;
  category: string;
  is_featured?: boolean;
  is_new?: boolean;
  is_bestseller?: boolean;
  is_customizable?: boolean;
  stock_quantity: number;
  inventory_count?: number;
  created_at?: string;
  updated_at?: string;
  badges?: string[];
  rating?: number;
  review_count?: number;
  variants?: ProductVariant[];
  options?: ProductOption[];
  dimensions?: string;
  weight?: string;
  materials?: string[];
  care_instructions?: string;
  tags?: string[];
  icon?: string; // Added for category icons
}

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  inventory_count?: number;
  option_values: {
    [key: string]: string;
  };
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  slug?: string;
  icon?: string; // Add icon property
  background_color?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  product: Product; // Add this to fix errors
  selected_options?: {
    [key: string]: string;
  };
  customization?: string;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  added_at: string;
  product: Product;
}

export interface ShippingAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  user_id?: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  payment_method: string;
  subtotal: number;
  shipping_cost: number;
  tax: number;
  total: number;
  total_amount?: number;
  placed_at: string;
  created_at?: string;
  updated_at?: string;
  payment_status?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface Address {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id?: string;
  username: string;
  rating: number;
  title?: string;
  content: string;
  created_at: string;
  helpful_count?: number;
  photos?: string[];
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  default_shipping_address?: Address;
  default_billing_address?: Address;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author: string;
  published_at: string;
  reading_time: number;
  tags?: string[];
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  customizable: boolean;
  sortBy: string;
}

export interface SupportMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  user_id?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}
