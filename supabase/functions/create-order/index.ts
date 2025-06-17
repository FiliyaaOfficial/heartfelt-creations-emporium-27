
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

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

    const { shipping_address, cart_items, total_amount, payment_id } = await req.json();

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name: shipping_address.full_name,
        customer_email: user.email,
        shipping_address,
        total_amount,
        payment_method: 'razorpay',
        payment_status: payment_id ? 'paid' : 'pending',
        status: 'confirmed'
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

    // Send confirmation email
    if (resend) {
      await resend.emails.send({
        from: 'Filiyaa <orders@filiyaa.com>',
        to: [user.email!],
        subject: `Order Confirmation - #${order.id.slice(0, 8)}`,
        html: `
          <h1>Thank you for your order!</h1>
          <p>Dear ${shipping_address.full_name},</p>
          <p>Your order has been confirmed and is being processed.</p>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Total Amount:</strong> ₹${total_amount}</p>
          <p>We'll send you another email when your order ships.</p>
          <p>Thank you for choosing Filiyaa!</p>
        `
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      order_id: order.id,
      message: 'Order created successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Order creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
