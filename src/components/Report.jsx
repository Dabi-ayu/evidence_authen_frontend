

export default function Report({ results, onBack }) {
 

  if (!results || results.status !== 'complete') {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto text-center py-10">
        {!results || results.status === 'loading' ? (
          <>
            <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p>Generating forensic report...</p>
          </>
        ) : (
          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="font-semibold text-red-800">Report Error</h3>
            <p>{results.message || 'Unable to generate report'}</p>
            <button
              onClick={onBack}
              className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md shadow-sm transition font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  // Directly use backend's confidence score
  const confidenceScore = Math.round(results.confidence * 100);
  const isFake = results.label === 'Fake';
  
  // Confidence explanation based on score
  const confidenceLevel = confidenceScore >= 90 ? 'High' : 
                         confidenceScore >= 70 ? 'Moderate' : 
                         'Low';

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-content {
            padding: 0;
          }
          body, html {
            background: white !important;
          }
        }
      `}</style>

      <div className="flex justify-between items-center mb-6 border-b pb-4 no-print">
        <h2 className="text-2xl font-bold text-gray-800">Forensic Analysis Report</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md shadow-sm transition font-medium"
        >
         Back to Dashboard
        </button>
      </div>

      <div className="print-content">
        {/* Blockchain Section */}
         <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Image Authenticity</p>
              <p className="font-mono text-sm break-all mt-1">
                Hash value: {results.imageHash || 'No hash record'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                This hash can be used later to verify if the image has been modified. Re-uploading the same image will produce the same hash.
              </p>
            </div>
          </div>
        </div>
        {/* File Info */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">File Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 text-sm">Filename:</p>
              <p className="font-medium">{file.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Analysis Date:</p>
              <p className="font-medium">{metadata.timestamp || new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
        {/* Tampering Detection */}
        <div
          className={`mb-8 p-4 rounded-lg ${isFake
            ? 'bg-red-50 border-l-4 border-red-500'
            : 'bg-green-50 border-l-4 border-green-500'
            }`}
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Tampering Detection
          </h3>
          
          <div className="flex items-center mb-2">
            <span className={`text-xl mr-2 ${isFake ? 'text-red-600' : 'text-green-600'}`}>
              {isFake ? '❌' : '✅'}
            </span>
             <p className={`font-bold text-lg ${isFake ? 'text-red-800' : 'text-green-800'}`}>
              {isFake ? 'Fake Detected' : 'Authentic Image'}
            </p>
          </div>
          
          <div className="mt-4">
            <p className="font-medium">Confidence Level: 
              <span className={`ml-2 ${
                confidenceScore >= 90 ? 'text-green-600' : 
                confidenceScore >= 70 ? 'text-yellow-600' : 
                'text-orange-600'
              }`}>
                {confidenceLevel} Confidence
              </span>
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className={`h-2.5 rounded-full ${
                  isFake ? 'bg-red-500' : 'bg-green-500'
                }`} 
                style={{ width: `${confidenceScore}%` }}
              ></div>
            </div>
            
            <p className="mt-2 text-sm">
              {isFake 
                ? `This model is ${confidenceScore}% confident this image is fake`
                : `This model is ${confidenceScore}% confident this image is authentic`}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Metadata Verification</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Status:</p>
                <p
                  className={`font-medium ${results.metadata?.status === 'Clean' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {results.metadata?.status || 'Not verified'}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Captured Device:</p>
                <p className="font-medium">{results.metadata?.device || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Location (GPS):</p>
                <p className="font-medium">{results.metadata?.location || 'Unavailable'}</p>
              </div>
            </div>

            {results.metadata?.details && Object.keys(results.metadata.details).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">
                  Extracted Metadata:
                </h4>
                <div className="max-h-64 overflow-auto border rounded p-2 text-xs bg-white shadow-inner">
                  {Object.entries(results.metadata.details).map(([key, value], i) => (
                    <div key={i} className="mb-1">
                      <span className="font-medium text-gray-800">{key}</span>: {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {results.metadata?.inconsistencies?.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg mt-4">
                <p className="font-semibold text-red-800">⚠️ Inconsistencies Found:</p>
                <ul className="list-disc pl-5 mt-2 text-red-700">
                  {results.metadata.inconsistencies.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

          {/* Forensic Insights */}
        <div className={`mb-8 p-5 rounded-lg border-l-4 ${isFake ? 'bg-red-50 border-red-500' : 'bg-blue-50 border-blue-500'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Forensic Insights
          </h3>
          
          <div className="mb-5">
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-sm">1</span>
              AI Analysis Summary
            </h4>
            <p className="text-sm pl-7">
              {isFake
                ? "Potential signs of manipulation include inconsistent lighting, unnatural edges, or compression artifacts."
                : "The image shows consistent lighting, natural edges, and no detectable manipulation artifacts."}
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-700 mb-2 flex items-center">
              <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-sm">2</span>
              Recommendations
            </h4>
            <ul className="list-disc pl-10 text-sm">
              {isFake ? (
                <>
                  <li className="mb-2">Exercise caution when using this image as evidence</li>
                  <li className="mb-2">Request the original file for further verification</li>
                  <li>Examine metadata for inconsistencies</li>
                </>
              ) : (
                <>
                  <li className="mb-2">This image appears authentic based on forensic analysis</li>
                  <li className="mb-2">Verify metadata for additional context</li>
                  <li>Store the image hash for future verification</li>
                </>
              )}
            </ul>
          </div>
        </div>

       {/* Footer for Print */}
        <div className="hidden print:block mt-16 pt-4 border-t text-sm text-gray-500">
          <div className="flex justify-between">
            <div>
              <p>Generated by Image Evidence Authenticator</p>
              <p>Analysis ID: {results.imageHash?.substring(0, 12) || 'N/A'}</p>
            </div>
            <div className="text-right">
              <p>Printed on: {new Date().toLocaleString()}</p>
              <p>Document Version: 1.0</p>
            </div>
          </div>
        </div>
      </div>

     {/* Download PDF Button */}
      <div className="border-t pt-4 mt-6 no-print">
        <button
          onClick={() => window.print()}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export as PDF
        </button>
      </div>
    </div>
  );
}