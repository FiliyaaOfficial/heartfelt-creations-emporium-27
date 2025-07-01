// Application constants and configuration
export const APP_CONFIG = {
  // Domain configuration
  DOMAIN: 'https://www.filiyaa.com',
  APP_NAME: 'Filiyaa',
  
  // API endpoints
  API_BASE_URL: 'https://www.filiyaa.com/api',
  
  // Payment configuration
  PAYMENT_METHODS: {
    RAZORPAY: 'razorpay',
    STRIPE: 'stripe',
    COD: 'cod' // Cash on Delivery
  },
  
  // Currency configuration
  DEFAULT_CURRENCY: 'INR',
  DEFAULT_COUNTRY: 'IN',
  
  // File upload limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  
  // Contact information
  CONTACT: {
    PHONE: '+91-7050682347',
    EMAIL: 'hello@filiyaa.com',
    WHATSAPP: '917050682347'
  },
  
  // Social media
  SOCIAL_MEDIA: {
    INSTAGRAM: 'https://instagram.com/filiyaa',
    FACEBOOK: 'https://facebook.com/filiyaa',
    TWITTER: 'https://twitter.com/filiyaa'
  }
};

// Shipping configuration
export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 999, // Free shipping above ₹999
  STANDARD_SHIPPING_COST: 99,
  EXPRESS_SHIPPING_COST: 199,
  DELIVERY_DAYS: {
    STANDARD: '5-7 business days',
    EXPRESS: '2-3 business days'
  }
};

// Order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
} as const;

// Domain configuration for Filiyaa
export const DOMAIN_CONFIG = {
  domain: 'www.filiyaa.com',
  url: 'https://www.filiyaa.com',
  name: 'Filiyaa',
  description: 'Handcrafted gifts and personalized items',
  social: {
    instagram: 'https://instagram.com/filiyaa',
    facebook: 'https://facebook.com/filiyaa',
    twitter: 'https://twitter.com/filiyaa'
  }
};

// SEO and sitemap configuration
export const SEO_CONFIG = {
  sitemap: `${DOMAIN_CONFIG.url}/sitemap.xml`,
  robots: `${DOMAIN_CONFIG.url}/robots.txt`,
  canonical: DOMAIN_CONFIG.url
};
