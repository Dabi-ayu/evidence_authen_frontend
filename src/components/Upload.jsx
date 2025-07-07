import { useState } from 'react';

export default function Upload({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    if (!e.target.files[0]) return;
    
    setIsUploading(true);
    try {
      await onFileUpload(e.target.files[0]);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-blue-500 rounded-lg p-8 text-center bg-white hover:bg-gray-50 cursor-pointer">
      <input 
        type="file" 
        id="file-upload" 
        accept="image/*" 
        onChange={handleFileChange}
        className="hidden"
        disabled={isUploading}
      />
      <label 
        htmlFor="file-upload" 
        className={`cursor-pointer ${isUploading ? 'opacity-70' : ''}`}
      >
        {isUploading ? (
          <div>
            <p className="text-[#1E3A8A] font-medium">Processing image...</p>
            <div className="mt-2 w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div>
            <p className="text-[#1E3A8A] font-medium">Drag & drop an image, or click to browse</p>
            <small className="text-gray-800 text-sm">Supports JPG, PNG (Max 10MB)</small>
          </div>
        )}
      </label>
    </div>
  );
}