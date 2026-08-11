import React, { useRef, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { processImage } from '../../lib/image-utils';
import { uploadDirectImage, deleteDirectImage } from '../../lib/supabase/storage';
import { useAuth } from '../../auth/AuthContext';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  maxSize?: number;
  circular?: boolean;
}

export const ImageUpload = ({ value, onChange, bucket = 'artwork', maxSize = 2000, circular = false }: ImageUploadProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Process image in canvas
      const processedBlob = await processImage(file, maxSize);
      
      // 2. Upload to Supabase directly
      const randomId = Math.random().toString(36).substring(2, 15);
      const path = `${user.id}/${randomId}`;
      const uploaded = await uploadDirectImage(bucket, path, processedBlob);
      
      if (uploaded) {
        onChange(uploaded.url);
      } else {
        throw new Error('Upload failed.');
      }
    } catch (err) {
      console.error('Error processing/uploading image:', err);
      setError('Failed to process image.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
      
      {value ? (
        <div className={`relative group overflow-hidden border border-gray-200 aspect-square max-w-[200px] ${circular ? 'rounded-full' : 'rounded-lg'}`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-bold uppercase tracking-widest text-white hover:text-gray-200"
            >
              Change
            </button>
            <button 
              type="button"
              onClick={handleRemove}
              className="text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors aspect-square max-w-[200px] ${circular ? 'rounded-full' : 'rounded-lg'}`}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-3" />
          ) : (
            <Upload className="w-8 h-8 text-gray-400 mb-3" />
          )}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
            {isProcessing ? 'Processing...' : 'Upload Image'}
          </p>
          <p className="text-[10px] text-gray-400 mt-2">Max {maxSize}x{maxSize}</p>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png,image/webp" 
        className="hidden" 
      />
    </div>
  );
};
