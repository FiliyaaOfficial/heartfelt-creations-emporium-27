
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, onReviewSubmitted }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    reviewerName: user?.user_metadata?.first_name || '',
    reviewerEmail: user?.email || ''
  });
  const [images, setImages] = useState<File[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 3) {
      toast.error('You can upload maximum 3 images');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user?.id || 'anonymous'}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('review-images')
        .upload(fileName, image);
      
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('review-images')
        .getPublicUrl(fileName);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: productId,
          user_id: user?.id || null,
          reviewer_name: formData.reviewerName,
          reviewer_email: formData.reviewerEmail,
          rating: formData.rating,
          title: formData.title,
          comment: formData.comment,
          review_images: imageUrls,
          is_verified_purchase: !!user
        });

      if (error) throw error;

      toast.success('Review submitted successfully!');
      setFormData({
        rating: 5,
        title: '',
        comment: '',
        reviewerName: user?.user_metadata?.first_name || '',
        reviewerEmail: user?.email || ''
      });
      setImages([]);
      onReviewSubmitted();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border">
      <h3 className="text-xl font-semibold">Write a Review</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="reviewerName">Your Name</Label>
          <Input
            id="reviewerName"
            value={formData.reviewerName}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewerName: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="reviewerEmail">Your Email</Label>
          <Input
            id="reviewerEmail"
            type="email"
            value={formData.reviewerEmail}
            onChange={(e) => setFormData(prev => ({ ...prev, reviewerEmail: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Rating</Label>
        <div className="flex items-center mt-1">
          {[1, 2, 3, 4, 5].map(rating => (
            <Star
              key={rating}
              size={24}
              className={`cursor-pointer transition-colors ${
                (hoveredRating || formData.rating) >= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, rating }))}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
            />
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="title">Review Title (Optional)</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Summarize your review"
        />
      </div>

      <div>
        <Label htmlFor="comment">Your Review</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
          rows={4}
          required
          placeholder="Tell others about your experience with this product"
        />
      </div>

      <div>
        <Label>Add Photos (Optional)</Label>
        <div className="mt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="review-images"
          />
          <label
            htmlFor="review-images"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            <Upload size={16} className="mr-2" />
            Upload Images
          </label>
          
          {images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Review image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-heartfelt-burgundy hover:bg-heartfelt-dark"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};

export default ReviewForm;
