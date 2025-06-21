
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId, customerEmail, customerName, customerPhone } = await req.json()

    // Fetch order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError) throw orderError

    // Fetch order items
    const { data: items, error: itemsError } = await supabaseClient
      .from('order_items')
      .select('*')
      .eq('order_id', orderId)

    if (itemsError) throw itemsError

    // Send email notification (placeholder - implement with your email service)
    console.log('Sending email to:', customerEmail)
    console.log('Order details:', { order, items })

    // Send SMS notification (placeholder - implement with your SMS service)
    console.log('Sending SMS to:', customerPhone)
    console.log('SMS: Your order #' + orderId.substring(0, 8) + ' has been confirmed. Total: ₹' + order.total_amount)

    // Here you would integrate with services like:
    // - Resend for emails
    // - Twilio for SMS
    // - Any other notification service

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
