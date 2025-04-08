
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { ShippingAddress } from "@/types";
import { ChevronLeft, CreditCard, Truck, Gift, Check, Lock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const shippingSchema = z.object({
  full_name: z.string().min(3, { message: "Full name is required" }),
  street_address: z.string().min(5, { message: "Street address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  postal_code: z.string().min(6, { message: "Valid postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  contact_email: z.string().email({ message: "Valid email is required" }),
  contact_phone: z.string().min(10, { message: "Valid phone number is required" }),
});

const paymentSchema = z.object({
  card_name: z.string().min(3, { message: "Name on card is required" }),
  card_number: z.string().min(16, { message: "Valid card number is required" }),
  expiry_date: z.string().min(5, { message: "Expiry date is required" }),
  cvv: z.string().min(3, { message: "CVV is required" }),
  payment_method: z.enum(["credit_card", "upi", "cod"]),
});

type ShippingFormData = z.infer<typeof shippingSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState<"cart" | "shipping" | "payment" | "confirmation">("shipping");
  const [shippingDetails, setShippingDetails] = useState<ShippingAddress | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { cartItems, subtotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register: registerShipping,
    handleSubmit: handleSubmitShipping,
    formState: { errors: shippingErrors },
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      country: "India",
    },
  });

  const {
    register: registerPayment,
    handleSubmit: handleSubmitPayment,
    formState: { errors: paymentErrors },
    watch: watchPayment,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: "credit_card",
    },
  });

  const paymentMethod = watchPayment("payment_method");

  const onSubmitShipping = (data: ShippingFormData) => {
    const shippingAddress = {
      full_name: data.full_name,
      street_address: data.street_address,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
    };
    
    setShippingDetails(shippingAddress);
    setCurrentStep("payment");
  };

  const onSubmitPayment = async () => {
    if (!shippingDetails) return;
    
    setIsProcessing(true);
    
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          total_amount: subtotal,
          shipping_address: shippingDetails,
          payment_status: "pending",
          contact_email: shippingDetails.full_name,
          contact_phone: "",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart
      await clearCart();

      // Set order ID and move to confirmation
      setOrderId(order.id);
      setCurrentStep("confirmation");
      
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been placed.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Error placing order",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingCost = 0; // Free shipping
  const tax = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + shippingCost + tax;

  const renderStep = () => {
    switch (currentStep) {
      case "shipping":
        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                <form onSubmit={handleSubmitShipping(onSubmitShipping)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        {...registerShipping("full_name")}
                        className={shippingErrors.full_name ? "border-red-300" : ""}
                      />
                      {shippingErrors.full_name && (
                        <p className="text-sm text-red-500">{shippingErrors.full_name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street_address">Street Address</Label>
                      <Input
                        id="street_address"
                        {...registerShipping("street_address")}
                        className={shippingErrors.street_address ? "border-red-300" : ""}
                      />
                      {shippingErrors.street_address && (
                        <p className="text-sm text-red-500">{shippingErrors.street_address.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        {...registerShipping("city")}
                        className={shippingErrors.city ? "border-red-300" : ""}
                      />
                      {shippingErrors.city && (
                        <p className="text-sm text-red-500">{shippingErrors.city.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        {...registerShipping("state")}
                        className={shippingErrors.state ? "border-red-300" : ""}
                      />
                      {shippingErrors.state && (
                        <p className="text-sm text-red-500">{shippingErrors.state.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postal_code">Postal Code</Label>
                      <Input
                        id="postal_code"
                        {...registerShipping("postal_code")}
                        className={shippingErrors.postal_code ? "border-red-300" : ""}
                      />
                      {shippingErrors.postal_code && (
                        <p className="text-sm text-red-500">{shippingErrors.postal_code.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        {...registerShipping("country")}
                        className={shippingErrors.country ? "border-red-300" : ""}
                        disabled
                      />
                      {shippingErrors.country && (
                        <p className="text-sm text-red-500">{shippingErrors.country.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_email">Email</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        {...registerShipping("contact_email")}
                        className={shippingErrors.contact_email ? "border-red-300" : ""}
                      />
                      {shippingErrors.contact_email && (
                        <p className="text-sm text-red-500">{shippingErrors.contact_email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Phone</Label>
                      <Input
                        id="contact_phone"
                        {...registerShipping("contact_phone")}
                        className={shippingErrors.contact_phone ? "border-red-300" : ""}
                      />
                      {shippingErrors.contact_phone && (
                        <p className="text-sm text-red-500">{shippingErrors.contact_phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Link to="/cart">
                      <Button type="button" variant="outline">
                        <ChevronLeft size={16} className="mr-2" /> Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded overflow-hidden mr-4">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-filiyaa-peach-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="md:col-span-3">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                <form onSubmit={handleSubmitPayment(onSubmitPayment)} className="space-y-6">
                  <RadioGroup
                    defaultValue="credit_card"
                    {...registerPayment("payment_method")}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-2 border rounded-lg p-4 mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="credit_card" id="credit_card" />
                      <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <CreditCard size={18} className="mr-2 text-filiyaa-peach-600" />
                          Credit / Debit Card
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <div className="w-5 h-5 mr-2 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#528FF0">
                              <path d="M21.4092 8.96794L13.0895 2.05459C12.4427 1.51371 11.5573 1.51371 10.9105 2.05459L2.59082 8.96794C1.75518 9.67538 1.95256 11.0327 2.94142 11.4434L10.9105 14.9454C11.5573 15.4863 12.4427 15.4863 13.0895 14.9454L21.0586 11.4434C22.0474 11.0327 22.2448 9.67538 21.4092 8.96794Z" />
                              <path d="M11.3217 16.9405C11.7123 17.2183 12.2877 17.2183 12.6783 16.9405L21.5463 10.6151C22.4051 9.99135 23.5 10.6079 23.5 11.6748V17.0311C23.5 18.2879 22.8483 19.4447 21.8138 20.1077L13.2532 25.6274C12.4951 26.1242 11.5049 26.1242 10.7468 25.6274L2.18624 20.1077C1.15166 19.4447 0.5 18.2879 0.5 17.0311V11.6748C0.5 10.6079 1.59494 9.99135 2.45374 10.6151L11.3217 16.9405Z" />
                            </svg>
                          </div>
                          UPI Payment
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 border rounded-lg p-4 mb-2 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex-1 cursor-pointer">
                        <div className="flex items-center">
                          <Truck size={18} className="mr-2 text-filiyaa-peach-600" />
                          Cash on Delivery
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit_card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="card_name">Name on Card</Label>
                        <Input
                          id="card_name"
                          {...registerPayment("card_name")}
                          className={paymentErrors.card_name ? "border-red-300" : ""}
                        />
                        {paymentErrors.card_name && (
                          <p className="text-sm text-red-500">{paymentErrors.card_name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="card_number">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="card_number"
                            {...registerPayment("card_number")}
                            className={paymentErrors.card_number ? "border-red-300" : ""}
                            placeholder="1234 5678 9012 3456"
                          />
                          <div className="absolute right-2 top-2 flex space-x-1">
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                            <div className="w-8 h-5 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                        {paymentErrors.card_number && (
                          <p className="text-sm text-red-500">{paymentErrors.card_number.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry_date">Expiry Date</Label>
                          <Input
                            id="expiry_date"
                            {...registerPayment("expiry_date")}
                            className={paymentErrors.expiry_date ? "border-red-300" : ""}
                            placeholder="MM/YY"
                          />
                          {paymentErrors.expiry_date && (
                            <p className="text-sm text-red-500">{paymentErrors.expiry_date.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            {...registerPayment("cvv")}
                            className={paymentErrors.cvv ? "border-red-300" : ""}
                            placeholder="123"
                          />
                          {paymentErrors.cvv && (
                            <p className="text-sm text-red-500">{paymentErrors.cvv.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="p-6 border rounded-lg bg-gray-50">
                      <p className="text-center mb-4">Please scan the QR code or enter UPI ID</p>
                      <div className="flex justify-center mb-4">
                        <div className="w-48 h-48 bg-white p-2 border rounded">
                          {/* Placeholder for QR code */}
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            QR Code
                          </div>
                        </div>
                      </div>
                      <div className="text-center text-sm text-muted-foreground">
                        Or pay using your UPI ID
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Lock size={14} className="mr-1" />
                      Your payment information is secure and encrypted
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      <ChevronLeft size={16} className="mr-2" /> Back
                    </Button>
                    <Button
                      type="submit"
                      className="bg-filiyaa-peach-500 hover:bg-filiyaa-peach-600"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </div>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded overflow-hidden mr-4">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-muted-foreground text-sm">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-filiyaa-peach-600">{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-dashed">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Gift size={16} className="mr-2 text-filiyaa-peach-500" />
                    Shipping Address
                  </h3>
                  {shippingDetails && (
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-gray-700">{shippingDetails.full_name}</p>
                      <p>{shippingDetails.street_address}</p>
                      <p>
                        {shippingDetails.city}, {shippingDetails.state} {shippingDetails.postal_code}
                      </p>
                      <p>{shippingDetails.country}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case "confirmation":
        return (
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm">
            <div className="text-center">
              <div className="bg-filiyaa-peach-100 w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-6">
                <Check size={48} className="text-filiyaa-peach-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold mb-2">Thank You for Your Order!</h2>
              <p className="text-muted-foreground mb-6">
                Your order #{orderId?.slice(0, 8)} has been placed successfully.
              </p>
              <div className="flex justify-center space-x-4 mt-8">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-center mb-12">Checkout</h1>
        
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex justify-between items-center relative">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation" ? "bg-filiyaa-peach-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                1
              </div>
              <span className={`text-xs mt-2 ${currentStep === "shipping" ? "font-medium text-filiyaa-peach-700" : "text-gray-500"}`}>Shipping</span>
            </div>
            
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${currentStep === "payment" || currentStep === "confirmation" ? "bg-filiyaa-peach-500" : "bg-gray-200"}`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "payment" || currentStep === "confirmation" ? "bg-filiyaa-peach-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                2
              </div>
              <span className={`text-xs mt-2 ${currentStep === "payment" ? "font-medium text-filiyaa-peach-700" : "text-gray-500"}`}>Payment</span>
            </div>
            
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${currentStep === "confirmation" ? "bg-filiyaa-peach-500" : "bg-gray-200"}`}></div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" ? "bg-filiyaa-peach-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                3
              </div>
              <span className={`text-xs mt-2 ${currentStep === "confirmation" ? "font-medium text-filiyaa-peach-700" : "text-gray-500"}`}>Confirmation</span>
            </div>
          </div>
        </div>
      </div>
      
      {renderStep()}
    </div>
  );
};

export default Checkout;
