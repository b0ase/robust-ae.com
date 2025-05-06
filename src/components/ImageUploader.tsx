'use client';
import React, { useState, useRef } from 'react';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void;
  section: 'testimonials' | 'projects' | 'logos';
  currentImageUrl?: string;
  label?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded, 
  section, 
  currentImageUrl = '', 
  label = 'Upload Image' 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(currentImageUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Validate file type - only accept images
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, etc.)');
      return;
    }
    
    // Validate file size - max 2MB
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Trigger file selection dialog
  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };
  
  // Upload the selected file
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('section', section);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to upload image');
      }
      
      // Call the callback with the new image URL
      onImageUploaded(result.url);
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="w-full mb-4">
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-2">
        {label}
      </label>
      
      <div className="mb-2 flex items-start space-x-4">
        {/* Preview image */}
        {preview && (
          <div className="relative w-24 h-24 border border-gray-300 dark:border-gray-700 rounded overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          {/* Button to trigger file selection */}
          <div className="flex">
            <button
              type="button"
              onClick={handleSelectClick}
              className="text-sm bg-transparent border border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 font-medium px-3 py-1 rounded"
            >
              Select Image
            </button>
            
            {/* Only show upload button if a file is selected but not yet uploaded */}
            {selectedFile && (
              <button
                type="button"
                onClick={handleUpload}
                disabled={isUploading}
                className="ml-2 text-sm bg-transparent border border-b0ase-blue text-b0ase-blue hover:bg-b0ase-blue hover:bg-opacity-10 font-medium px-3 py-1 rounded"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            )}
          </div>
          
          {/* Selected file name */}
          {selectedFile && (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
            </p>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default ImageUploader; 