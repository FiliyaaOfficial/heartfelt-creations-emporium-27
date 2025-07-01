
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  orderTotal: number;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
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

    const { orderId, customerEmail, customerName, orderTotal, orderItems }: EmailRequest = await req.json()

    // Create email HTML template
    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Filiyaa</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #8B1538; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; display: flex; justify-content: space-between; }
            .total { font-weight: bold; font-size: 18px; padding-top: 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .logo { font-size: 24px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">Filiyaa</div>
                <h1>Order Confirmation</h1>
            </div>
            <div class="content">
                <h2>Thank you for your order, ${customerName}!</h2>
                <p>We're excited to confirm that we've received your order and are preparing it with care.</p>
                
                <div class="order-details">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> #${orderId.substring(0, 8)}</p>
                    <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
                    
                    <h4>Items Ordered:</h4>
                    ${orderItems.map(item => `
                        <div class="item">
                            <div>
                                <strong>${item.name}</strong><br>
                                <small>Quantity: ${item.quantity}</small>
                            </div>
                            <div>₹${(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                    `).join('')}
                    
                    <div class="total">
                        <div class="item">
                            <div>Total Amount:</div>
                            <div>₹${orderTotal.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <h3>What's Next?</h3>
                <ul>
                    <li>We'll process your order within 1-2 hours</li>
                    <li>You'll receive shipping updates via email</li>
                    <li>Expected delivery: 3-5 business days</li>
                </ul>

                <p>If you have any questions about your order, please don't hesitate to contact us:</p>
                <p>📧 Email: filiyaa.official@gmail.com<br>
                📞 Phone: +91 7050682347</p>

                <div class="footer">
                    <p>Thank you for choosing Filiyaa for your heartfelt gifts!</p>
                    <p><em>Making every moment memorable</em></p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `

    // For now, we'll log the email content and simulate sending
    // In production, you would integrate with a service like Resend, SendGrid, etc.
    console.log('Order Confirmation Email for:', customerEmail)
    console.log('Order ID:', orderId)
    console.log('Email HTML:', emailHTML)

    // Simulate email sending success
    const emailResult = {
      success: true,
      messageId: `email_${Date.now()}`,
      recipient: customerEmail
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Order confirmation email queued for sending',
        emailResult
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
