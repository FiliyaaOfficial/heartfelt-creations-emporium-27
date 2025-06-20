
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileInput } from '@/components/ui/file-input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Palette } from 'lucide-react';

interface ProductCustomizationProps {
  onCustomizationChange: (customization: string, images: string[]) => void;
  initialCustomization?: string;
  initialImages?: string[];
}

const ProductCustomization: React.FC<ProductCustomizationProps> = ({
  onCustomizationChange,
  initialCustomization = '',
  initialImages = []
}) => {
  const [customization, setCustomization] = useState(initialCustomization);
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);

  const handleCustomizationChange = (value: string) => {
    setCustomization(value);
    onCustomizationChange(value, uploadedImages);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImageUrls: string[] = [];
      
      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const filePath = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-customizations')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          toast.error(`Failed to upload ${file.name}`);
          continue;
        }

        const { data } = supabase.storage
          .from('product-customizations')
          .getPublicUrl(filePath);

        newImageUrls.push(data.publicUrl);
      }

      if (newImageUrls.length > 0) {
        const updatedImages = [...uploadedImages, ...newImageUrls];
        setUploadedImages(updatedImages);
        onCustomizationChange(customization, updatedImages);
        toast.success(`Successfully uploaded ${newImageUrls.length} image(s)`);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    onCustomizationChange(customization, updatedImages);
    toast.success('Image removed');
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-heartfelt-burgundy" />
          Customize Your Product
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customization Text */}
        <div>
          <Label htmlFor="customization" className="text-base font-medium">
            Customization Details
          </Label>
          <Textarea
            id="customization"
            value={customization}
            onChange={(e) => handleCustomizationChange(e.target.value)}
            placeholder="Describe how you'd like this product customized. Include colors, text, special designs, or any specific requirements..."
            rows={4}
            className="mt-2 border-2 border-heartfelt-cream focus:border-heartfelt-burgundy"
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label className="text-base font-medium">Reference Images</Label>
          <p className="text-sm text-gray-600 mb-3">
            Upload images to show us your inspiration or specific requirements (Max 5MB per image)
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <FileInput 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*"
                disabled={uploading}
                className="border-2 border-dashed border-heartfelt-cream hover:border-heartfelt-burgundy"
              />
              <Button
                type="button"
                variant="outline"
                disabled={uploading}
                className="whitespace-nowrap border-heartfelt-burgundy text-heartfelt-burgundy hover:bg-heartfelt-burgundy hover:text-white"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Images'}
              </Button>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageUrl} 
                      alt={`Customization reference ${index + 1}`} 
                      className="w-full h-24 object-cover rounded-lg border-2 border-heartfelt-cream shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {(customization || uploadedImages.length > 0) && (
          <div className="bg-heartfelt-cream/20 p-4 rounded-lg">
            <p className="text-sm text-heartfelt-dark font-medium">
              ✨ Your customization details have been saved and will be included with your order.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCustomization;
