
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Database } from "@/integrations/supabase/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']

// Helper function to convert objects to Json type for Supabase compatibility
export function toJson<T>(data: T): Database['public']['Tables']['orders']['Insert']['shipping_address'] {
  return data as Database['public']['Tables']['orders']['Insert']['shipping_address'];
}
