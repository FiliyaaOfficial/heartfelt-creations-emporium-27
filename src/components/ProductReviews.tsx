
import React, { useState } from 'react';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewsList from '@/components/reviews/ReviewsList';

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <ReviewsList productId={productId} refreshTrigger={refreshTrigger} />
      <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
};

export default ProductReviews;
