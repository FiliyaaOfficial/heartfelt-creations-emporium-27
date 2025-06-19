
# API Keys Setup Guide

This document outlines the API keys needed for the Filiyaa e-commerce application and how to configure them securely using Supabase.

## Required API Keys

### Payment Gateways
1. **Razorpay** (Primary payment gateway for India)
   - `RAZORPAY_KEY_ID` - Publishable key for frontend
   - `RAZORPAY_KEY_SECRET` - Secret key for backend (store in Supabase secrets)

2. **Stripe** (International payments)
   - `STRIPE_PUBLISHABLE_KEY` - Publishable key for frontend
   - `STRIPE_SECRET_KEY` - Secret key for backend (store in Supabase secrets)

### Location & Maps
3. **Google Maps API** (For address validation and mapping)
   - `GOOGLE_MAPS_API_KEY` - For address autocomplete and validation

### Email Services
4. **Email Service** (Choose one)
   - SendGrid: `SENDGRID_API_KEY`
   - Resend: `RESEND_API_KEY`
   - Or use Supabase Auth for basic email functionality

### SMS Services (Optional)
5. **Twilio** (For SMS notifications)
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`

## How to Set Up API Keys in Supabase

1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add each secret key in the "Function Secrets" section
4. These secrets will be available to your Edge Functions securely

## Current Configuration

The app is configured to work with https://www.filiyaa.com domain.

### Razorpay Setup
- Configure webhook URL: `https://www.filiyaa.com/api/webhooks/razorpay`
- Set authorized domains in Razorpay dashboard

### Stripe Setup  
- Configure webhook URL: `https://www.filiyaa.com/api/webhooks/stripe`
- Set authorized domains in Stripe dashboard

## Development vs Production

- **Development**: Test keys can be used
- **Production**: Use live keys and ensure all webhooks point to https://www.filiyaa.com

## Security Notes

- Never store secret keys in frontend code
- Use Supabase Edge Functions to handle secret keys
- All sensitive operations should happen on the backend
- Implement proper CORS policies for your domain
