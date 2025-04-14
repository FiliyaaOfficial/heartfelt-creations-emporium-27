
# Test Plan for Filiyaa E-Commerce App

## 1. Functional Testing

### 1.1 Navigation & UI
- [ ] Verify that the PromoBar displays correctly with proper styling and functionality
- [ ] Test that the promo code can be copied to clipboard
- [ ] Check that the notification bar can be closed and state is remembered
- [ ] Confirm that the navigation menu displays all categories correctly
- [ ] Test that category circles below the navbar load and display correctly
- [ ] Verify that all navigation links work correctly
- [ ] Test responsive design on mobile, tablet, and desktop viewports

### 1.2 Product Listings
- [ ] Verify that products are displayed correctly on the Shop page
- [ ] Test category filtering functionality
- [ ] Test price range filtering
- [ ] Test "customizable products only" filtering
- [ ] Verify sort functionality (newest, price low-high, price high-low)
- [ ] Test pagination if applicable
- [ ] Confirm that product cards display all required information

### 1.3 Cart Functionality
- [ ] Test adding products to cart
- [ ] Verify that quantity selector works properly
- [ ] Test confetti animation when product is added to cart
- [ ] Check that cart notification appears after adding an item
- [ ] Test "View Cart" and "Checkout" buttons in the cart notification
- [ ] Verify that the cart icon updates with the correct number of items
- [ ] Test removing items from cart
- [ ] Verify cart total price calculation is correct

### 1.4 Category Pages
- [ ] Test each category page to ensure it displays the correct products
- [ ] Verify category description and image display correctly
- [ ] Confirm featured products in category carousels load properly
- [ ] Test carousel navigation controls

### 1.5 Search Functionality
- [ ] Test search functionality with valid and invalid queries
- [ ] Verify search results display relevant products
- [ ] Test empty search results handling

## 2. Performance Testing

### 2.1 Load Time
- [ ] Measure initial page load time
- [ ] Test load time with cache cleared vs cached
- [ ] Measure time to first meaningful paint
- [ ] Test time to interactive

### 2.2 API Response Time
- [ ] Measure response time for product listings API call
- [ ] Test category listings API response time
- [ ] Measure cart operations response time

### 2.3 Resource Usage
- [ ] Monitor memory usage during normal browsing
- [ ] Test CPU usage during animations and interactions
- [ ] Check for memory leaks during extended usage

## 3. Cross-Browser Testing

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on mobile browsers (iOS Safari and Android Chrome)

## 4. Usability Testing

### 4.1 User Flows
- [ ] Test complete purchase flow from product discovery to checkout
- [ ] Measure time to complete common tasks
- [ ] Test customer support contact flow
- [ ] Verify wishlist functionality

### 4.2 Accessibility
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Test tab order and focus indicators

## 5. Security Testing

- [ ] Verify input validation on forms
- [ ] Test for XSS vulnerabilities
- [ ] Check CSRF protection
- [ ] Test authentication and authorization if applicable

## 6. Error Handling & Recovery

- [ ] Test offline functionality
- [ ] Verify error messages are user-friendly
- [ ] Test recovery from network errors
- [ ] Verify form validation error messages

## 7. End-to-End Tests

### Example Test Cases

1. **Add to Cart Test**
```javascript
describe('Add to Cart Functionality', () => {
  it('should add a product to the cart and show notification', () => {
    // Visit product page
    cy.visit('/product/sample-product');
    
    // Get initial cart count
    cy.get('[data-testid="cart-count"]').then($count => {
      const initialCount = parseInt($count.text() || '0');
      
      // Click add to cart button
      cy.get('[data-testid="add-to-cart-button"]').click();
      
      // Check that confetti animation appears
      cy.get('.canvas-confetti-container').should('exist');
      
      // Check that notification appears
      cy.get('[data-testid="cart-notification"]').should('be.visible');
      
      // Verify cart count increased by 1
      cy.get('[data-testid="cart-count"]')
        .should('have.text', `${initialCount + 1}`);
    });
  });
});
```

2. **Filter Products Test**
```javascript
describe('Product Filtering', () => {
  it('should filter products by category and price range', () => {
    // Visit shop page
    cy.visit('/shop');
    
    // Select a category
    cy.get('[data-testid="category-checkbox-Artisan Chocolates"]').click();
    
    // Set price range
    cy.get('[data-testid="price-slider"]').invoke('val', [20, 50]).trigger('change');
    
    // Wait for products to update
    cy.wait(1000);
    
    // Verify filtered products
    cy.get('[data-testid="product-card"]').each($card => {
      // Check category
      cy.wrap($card).find('[data-testid="product-category"]')
        .should('contain', 'Artisan Chocolates');
      
      // Check price
      cy.wrap($card).find('[data-testid="product-price"]').then($price => {
        const price = parseFloat($price.text().replace('$', ''));
        expect(price).to.be.at.least(20);
        expect(price).to.be.at.most(50);
      });
    });
  });
});
```

## 8. Data Testing

- [ ] Verify product data is displayed correctly
- [ ] Test cart calculations with various combinations of products
- [ ] Verify category relationships and navigation
- [ ] Test search functionality with various queries

## 9. Acceptance Criteria

- [x] All products display correctly on the shop page
- [x] Category navigation is intuitive and functional
- [x] Add to cart animation and notification work correctly
- [x] Mobile and desktop views are properly responsive
- [x] Featured carousels display relevant products per category
- [x] Promo code banner displays and functions correctly
- [x] Navigation menu matches design requirements
