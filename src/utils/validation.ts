
import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');

export const shippingAddressSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  street_address: z.string().min(5, 'Street address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  postal_code: z.string().regex(/^\d{6}$/, 'Postal code must be 6 digits'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().regex(/^[+]?[\d\s-()]{10,15}$/, 'Please enter a valid phone number'),
});

export const customOrderSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: z.string().regex(/^[+]?[\d\s-()]{10,15}$/, 'Please enter a valid phone number').optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  budget: z.number().min(100, 'Budget must be at least ₹100').optional(),
  occasion: z.string().optional(),
  timeline: z.string().optional(),
});

// XSS protection utility
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim();
};

// CSRF token utilities (basic implementation)
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const setCSRFToken = () => {
  const token = generateCSRFToken();
  sessionStorage.setItem('csrf_token', token);
  return token;
};

export const getCSRFToken = (): string | null => {
  return sessionStorage.getItem('csrf_token');
};
