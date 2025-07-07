import { useState } from 'react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Report from './components/Report';

export default function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const analyzeImage = async (uploadedFile) => {
    setFile(uploadedFile);
    
    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      
      // Show loading state
      setResults({ status: 'loading' });
      
      // Send to Django API
      const response = await fetch('http://localhost:8000/api/verify/', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Verification failed');
      }
      
      const data = await response.json();
      
      // Map Django response to your frontend structure
      setResults({
        status: 'complete',
        isAuthentic: data.is_authentic,
        confidence: data.confidence,
        metadata: {
          status: data.metadata_status,
          // Additional metadata fields
          timestamp: new Date().toLocaleString(),
          device: "Unknown Device",
          location: "Unknown Location",
          inconsistencies: data.metadata_status !== "Clean" ? 
            [data.metadata_status] : []
        },
        blockchainHash: data.blockchain_hash
      });
      
    } catch (error) {
      setResults({
        status: 'error',
        message: error.message || 'Failed to verify evidence'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-[#2563EB] mb-8 text-center">
        Image Evidence Authenticator
      </h1>

      {!file ? (
        <Upload onFileUpload={analyzeImage} />
      ) : showReport ? (
        <Report 
          results={results} 
          file={file} 
          onBack={() => setShowReport(false)} 
        />
      ) : (
        <Dashboard 
          results={results} 
          onViewReport={() => setShowReport(true)} 
        />
      )}
    </div>
  );
}