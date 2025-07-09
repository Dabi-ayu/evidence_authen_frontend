import { useState } from 'react';

import uploadImage from '../assets/drop.svg';

export default function Upload({ onFileUpload }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Unsupported file format. Please upload JPG or PNG images only.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum allowed is 10MB.');
      return;
    }

    setIsUploading(true);
    try {
      await onFileUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Upload Box */}
      <div className="w-full max-w-3xl border-2 border-dashed border-blue-500 rounded-lg p-12 text-center bg-white hover:bg-gray-50 cursor-pointer shadow-md">
        <input
          type="file"
          id="file-upload"
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
          disabled={isUploading}
        />
        <label htmlFor="file-upload" className={`cursor-pointer block ${isUploading ? 'opacity-70' : ''}`}>
          {isUploading ? (
            <div>
              <p className="text-[#1E3A8A] font-medium">Processing image...</p>
              <div className="mt-4 w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
            </div>
          ) : (
            <div>
              <img src={uploadImage} alt="Upload illustration" className="mx-auto mb-6 w-60" />
              <p className="text-[#1E3A8A] font-medium text-lg">Drag & drop an image, or click to browse</p>
              <p className="text-gray-800 text-sm mt-2">Accepted formats: JPG, JPEG, PNG | Max: 10MB</p>
            </div>
          )}
        </label>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-600 text-sm">
        <p>This tool ensures the authenticity of image evidence using advanced forensic techniques and blockchain timestamps.</p>
        <p className="mt-1">&copy; {new Date().getFullYear()} Image Evidence Authenticator. All rights reserved.</p>
      </footer>
    </div>
  );
}
