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
  quantity: number;
  product: Product;
  name?: string;   // Make these optional since we're deriving them from product
  price?: number;
  image_url?: string;
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

export interface Address {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
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

// Updated Order interface to match database schema - using string for status to match database
export interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  status: string; // Changed from union type to string to match database
  payment_method?: string;
  payment_status?: string;
  shipping_address?: any; // JSON field from database
  total_amount: number;
  created_at: string;
  order_items?: OrderItem[]; // Relation to order items
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at?: string;
  products?: Product; // Relation to product
}

export interface User {
  id: string;
  email: string;
  first_name?: string;  // Added first_name as optional
  last_name?: string;   // Added last_name as optional
  phone?: string;
  default_shipping_address?: Address;
  default_billing_address?: Address;
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

// Updated BlogPost interface to include is_published
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
  is_published?: boolean; // Added missing property
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
  order_id?: string; // Add this field
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

// Add new interfaces for payment system
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_uses: number;
  used_count: number;
  valid_from?: string;
  valid_until?: string;
  active: boolean;
  created_at: string;
}

export interface CurrencyRate {
  id: string;
  currency_code: string;
  rate_to_inr: number;
  symbol: string;
  updated_at: string;
}

export interface PaymentGateway {
  id: string;
  name: string;
  supported_currencies: string[];
  active: boolean;
  config?: any;
  created_at: string;
}
