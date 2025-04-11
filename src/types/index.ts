
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_featured: boolean;
  is_new: boolean;
  is_bestseller: boolean;
  is_customizable?: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  badges?: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  background_color: string;
  image_url?: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  user_id?: string;
  status: string;
  total_amount: number;
  shipping_address: ShippingAddress;
  payment_status: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  created_at: string;
}

export interface ShippingAddress {
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface SupportMessage {
  id?: string;
  user_id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  created_at?: string;
  order_id?: string;
}
