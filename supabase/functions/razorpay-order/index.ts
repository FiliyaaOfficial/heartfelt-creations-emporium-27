
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
      currency = 'INR', 
      shipping_address, 
      cart_items, 
      coupon_code,
      discount_amount,
      notes = {} 
    } = await req.json();

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Create Razorpay order
    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency,
      notes: {
        ...notes,
        user_id: user.id,
        coupon_code: coupon_code || '',
        discount_amount: discount_amount?.toString() || '0',
      },
      receipt: `order_${Date.now()}`
    };

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const razorpayOrder = await response.json();

    if (!response.ok) {
      throw new Error(razorpayOrder.error?.description || 'Failed to create Razorpay order');
    }

    // Create order record in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: shipping_address.full_name,
        customer_email: user.email,
        shipping_address,
        total_amount: amount,
        payment_method: 'razorpay',
        payment_status: 'pending',
        status: 'pending',
        coupon_code,
        discount_amount: discount_amount || 0,
        currency: currency,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = cart_items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({
      ...razorpayOrder,
      order_id: order.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
