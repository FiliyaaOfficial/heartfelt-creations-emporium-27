
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Default currency formatter (will be replaced by useCurrency hook in components)
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Since Supabase types haven't updated yet, we'll use type assertions
export function getOrdersFromSupabase() {
  // This will be updated once types are regenerated
  return (window as any).supabase?.from('orders');
}

export function getCustomOrdersFromSupabase() {
  return (window as any).supabase?.from('custom_orders');
}

export function getSupportMessagesFromSupabase() {
  return (window as any).supabase?.from('support_messages');
}
