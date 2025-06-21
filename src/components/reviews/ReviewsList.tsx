
import React, { useState, useEffect } from 'react';
import { Star, User, ThumbsUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  title?: string;
  comment: string;
  review_images: string[];
  is_verified_purchase: boolean;
  helpful_count: number;
  created_at: string;
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
      
      if (data && data.length > 0) {
        const avg = data.reduce((sum, review) => sum + review.rating, 0) / data.length;
        setAverageRating(avg);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
        {reviews.length > 0 ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(averageRating) 
                      ? "fill-yellow-400 text-yellow-400" 
                      : "text-gray-300"
                    }
                  />
                ))}
              </div>
              <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        )}
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="border shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-heartfelt-cream flex items-center justify-center">
                    <User size={18} className="text-heartfelt-burgundy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{review.reviewer_name}</p>
                      {review.is_verified_purchase && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300"
                      }
                    />
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {review.title && (
                <h4 className="font-medium mb-2">{review.title}</h4>
              )}
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              {review.review_images && review.review_images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.review_images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border cursor-pointer hover:opacity-80"
                      onClick={() => window.open(imageUrl, '_blank')}
                    />
                  ))}
                </div>
              )}
              
              <div className="flex items-center text-sm text-muted-foreground">
                <button className="flex items-center gap-1 hover:text-gray-700">
                  <ThumbsUp size={14} />
                  Helpful ({review.helpful_count})
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
