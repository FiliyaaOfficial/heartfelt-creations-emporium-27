
export interface User {
  id: string;
  email: string;
  first_name?: string;  // Make these optional to match existing usage
  last_name?: string;   // Make these optional to match existing usage
  phone?: string;
  default_shipping_address?: Address;
  default_billing_address?: Address;
}
