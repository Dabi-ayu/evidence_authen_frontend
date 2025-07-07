export default function Dashboard({ results, onViewReport }) {
  // Handle loading state
  if (!results || results.status === 'loading') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto text-center py-10">
        <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p>Analyzing image for tampering and metadata verification...</p>
      </div>
    );
  }
  
  // Handle error state
  if (results.status === 'error') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="bg-red-50 p-4 rounded-lg mb-6 border-l-4 border-red-500">
          <h3 className="font-semibold text-red-800">Verification Error</h3>
          <p className="mt-2">{results.message}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="w-full py-2 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate tamper score for display
  const tamperScore = results.isAuthentic ? 
    Math.round(results.confidence * 100) : 
    Math.round((1 - results.confidence) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analysis Results</h2>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {['Tampering Detection', 'Metadata Verification', 'Report Generation'].map((step, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              i < 2 ? 'bg-[#2563EB] text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1}
            </div>
            <span className="mt-2 text-sm text-gray-600">{step}</span>
          </div>
        ))}
      </div>

      {/* Result Card */}
      <div className={`p-4 rounded-lg mb-6 border-l-4 ${
        results.isAuthentic ? 'bg-teal-50 border-teal-500' : 'bg-red-50 border-red-500'
      }`}>
        <h3 className="font-semibold text-gray-800">
          {results.isAuthentic ? 'Authenticity Confidence' : 'Tampering Confidence'}: 
          <span className="font-bold"> {tamperScore}%</span>
        </h3>
        {results.isAuthentic ? (
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800">
            ✅ Authentic
          </span>
        ) : (
          <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full bg-red-100 text-red-800">
            ❌ Tampered Detected
          </span>
        )}
      </div>

      <button 
        onClick={onViewReport}
        className="w-full py-2 px-4 bg-[#2563EB] hover:bg-blue-700 text-white rounded-lg transition"
      >
        Download Forensic Report (PDF)
      </button>
    </div>
  );
}