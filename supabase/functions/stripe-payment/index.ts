
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    
    if (!user) throw new Error('User not authenticated');

    const { 
      amount, 
      currency, 
      shipping_address, 
      cart_items, 
      coupon_code,
      discount_amount 
    } = await req.json();

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    // Create Stripe customer if doesn't exist
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email!,
        name: shipping_address.full_name,
      });
      customerId = customer.id;
    }

    // Create line items
    const line_items = cart_items.map((item: any) => ({
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: item.product.name,
          description: item.product.description,
          images: item.product.image_url ? [item.product.image_url] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add discount if coupon applied
    if (discount_amount > 0) {
      line_items.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `Discount (${coupon_code})`,
          },
          unit_amount: -Math.round(discount_amount * 100),
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      metadata: {
        user_id: user.id,
        coupon_code: coupon_code || '',
        discount_amount: discount_amount?.toString() || '0',
      },
    });

    // Create order record
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: shipping_address.full_name,
        customer_email: user.email,
        shipping_address,
        total_amount: amount,
        payment_method: 'stripe',
        payment_status: 'pending',
        status: 'pending',
        coupon_code,
        discount_amount: discount_amount || 0,
        currency: currency,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url,
      order_id: order.id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Stripe payment error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
