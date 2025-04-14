
// Example unit tests for Filiyaa E-commerce
// Note: This is for demonstration purposes only

import { render, screen } from '@testing-library/react';
import { PromoBar } from '@/components/PromoBar';
import { CartNotification } from '@/components/CartNotification';
import { AddToCartButton } from '@/components/AddToCartButton';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(() => ({
    totalItems: 2,
    cartItems: [
      { 
        product: { id: '1', name: 'Test Product', price: 19.99 }, 
        quantity: 2 
      }
    ],
    addToCart: jest.fn(),
  })),
}));

jest.mock('canvas-confetti', () => jest.fn());

describe('PromoBar Component', () => {
  it('renders promo code correctly', () => {
    render(<PromoBar />);
    expect(screen.getByText('NHBDAY50')).toBeInTheDocument();
    expect(screen.getByText('Get Flat 50% OFF on your Order')).toBeInTheDocument();
    expect(screen.getByText('Min Order of Rs.799')).toBeInTheDocument();
  });

  it('hides when close button is clicked', () => {
    render(<PromoBar />);
    const closeButton = screen.getByLabelText('Close promo banner');
    fireEvent.click(closeButton);
    expect(screen.queryByText('NHBDAY50')).not.toBeInTheDocument();
  });
});

describe('CartNotification Component', () => {
  beforeEach(() => {
    // Reset mocked local storage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('displays correct cart totals', () => {
    render(<CartNotification />);
    expect(screen.getByText('Items in cart:')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('$39.98')).toBeInTheDocument();  // 19.99 * 2
  });

  it('provides navigation to cart and checkout', () => {
    render(<CartNotification />);
    expect(screen.getByText('View Cart').closest('a')).toHaveAttribute('href', '/cart');
    expect(screen.getByText('Checkout').closest('a')).toHaveAttribute('href', '/checkout');
  });
});

describe('AddToCartButton Unit Tests', () => {
  const mockProduct = {
    id: '123',
    name: 'Test Product',
    price: 29.99,
    description: 'Test description',
    image_url: '/test.jpg',
    category: 'Test',
  };

  it('renders with default quantity of 1', () => {
    render(<AddToCartButton product={mockProduct} showQuantity={true} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('disables decrement button when quantity is 1', () => {
    render(<AddToCartButton product={mockProduct} showQuantity={true} />);
    const decrementButton = screen.getByLabelText('Decrease quantity');
    expect(decrementButton).toBeDisabled();
  });

  it('renders with specified variant and size props', () => {
    render(<AddToCartButton product={mockProduct} variant="outline" size="sm" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('outline');
    expect(button).toHaveClass('sm');
  });
});
