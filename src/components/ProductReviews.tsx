
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, User } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast as sonnerToast } from "sonner";

// Sample review data (in a real app, this would come from the database)
const sampleReviews = [
  {
    id: '1',
    name: 'Ananya Sharma',
    rating: 5,
    date: '2023-11-15',
    comment: 'Absolutely love this product! The quality is outstanding and it arrived much faster than I expected. Will definitely buy more items from this store.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: 'Raj Patel',
    rating: 4,
    date: '2023-10-28',
    comment: 'Very good craftsmanship. The attention to detail is impressive. Giving 4 stars only because shipping took a bit longer than expected.',
    avatar: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: 'Meera Desai',
    rating: 5,
    date: '2023-09-12',
    comment: 'This item exceeded my expectations. The colors are vibrant and the material is of premium quality. Highly recommend!',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
];

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews] = useState(sampleReviews);
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the review to your backend
    console.log('Submitting review:', { ...newReview, productId });
    
    // Show success message
    sonnerToast("Review submitted", {
      description: "Thank you for sharing your feedback!",
    });
    
    // Reset the form
    setNewReview({
      name: '',
      email: '',
      rating: 5,
      comment: '',
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview(prev => ({ ...prev, [name]: value }));
  };
  
  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <div className="bg-heartfelt-cream/30 p-6 rounded-lg">
            <h3 className="text-xl font-serif font-semibold mb-4">Customer Reviews</h3>
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={20} 
                    className={i < Math.round(averageRating) ? "fill-heartfelt-burgundy text-heartfelt-burgundy" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="font-semibold text-lg">{averageRating.toFixed(1)}</span>
              <span className="text-muted-foreground ml-2">({reviews.length} reviews)</span>
            </div>
            
            <div className="space-y-2 mt-6">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviews.length) * 100;
                
                return (
                  <div key={rating} className="flex items-center text-sm">
                    <span className="w-10">{rating} star</span>
                    <div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="bg-heartfelt-burgundy h-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="md:w-2/3">
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="border-heartfelt-cream">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-heartfelt-burgundy/10 flex items-center justify-center">
                        <User size={16} className="text-heartfelt-burgundy" />
                      </div>
                      <div>
                        <p className="font-medium">{review.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={14} 
                          className={i < review.rating ? "fill-heartfelt-burgundy text-heartfelt-burgundy" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-10 border-t border-heartfelt-cream pt-8">
        <h3 className="text-xl font-serif font-semibold mb-6">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={newReview.name} 
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={newReview.email} 
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <div className="flex items-center" id="rating">
              {[1, 2, 3, 4, 5].map(rating => (
                <Star 
                  key={rating} 
                  size={24} 
                  className={`cursor-pointer transition-all ${
                    (hoveredRating || newReview.rating) >= rating 
                      ? "fill-heartfelt-burgundy text-heartfelt-burgundy" 
                      : "text-gray-300"
                  }`}
                  onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="comment">Your Review</Label>
            <Textarea 
              id="comment" 
              name="comment" 
              value={newReview.comment} 
              onChange={handleInputChange}
              rows={4} 
              required 
            />
          </div>
          
          <Button type="submit" className="bg-heartfelt-burgundy hover:bg-heartfelt-dark">
            Submit Review
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ProductReviews;
