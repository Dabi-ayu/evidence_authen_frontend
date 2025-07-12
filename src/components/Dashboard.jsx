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
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Calculate confidence score for display
  const confidenceScore = Math.round(results.confidence * 100);
  const isFake = results.label === 'Fake';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Forensic Analysis Results</h2>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-blue-100 z-0"></div>
        
        {['Tampering Detection','Image Authenticity', 'Metadata Verification', 'Report Generation'].map((step, i) => (
          <div key={i} className="flex flex-col items-center relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              'bg-blue-600 text-white'
            }`}>
              {i + 1}
            </div>
            <span className="mt-2 text-sm text-gray-600 text-center">{step}</span>
          </div>
        ))}
      </div>

      {/* Result Card */}
      <div className={`p-5 rounded-lg mb-8 border-l-4 shadow-sm ${
        isFake ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'
      }`}>
        <h3 className="font-semibold text-gray-800 flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
            isFake ? 'bg-red-500' : 'bg-blue-500'
          }`}></span>
          {isFake ? 'Fake Confidence' : 'Real Confidence'}: 
          <span className="font-bold ml-1"> {confidenceScore}%</span>
        </h3>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isFake ? 'bg-red-500' : 'bg-blue-500'
              }`} 
              style={{ width: `${confidenceScore}%` }}
            ></div>
          </div>
        </div>
        <div className="mt-4">
          {isFake ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium">
              <span className="mr-1">❌</span> Fake Detected
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
              <span className="mr-1">✅</span> Authentic Image
            </span>
          )}
        </div>
      </div>

      <button 
        onClick={onViewReport}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center"
      >
     
        View Full Forensic Report
      </button>
    </div>
  );
}