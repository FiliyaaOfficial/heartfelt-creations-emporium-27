
declare global {
  interface Window {
    Razorpay: any;
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};
