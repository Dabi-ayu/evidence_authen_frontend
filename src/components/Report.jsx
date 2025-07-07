import { useState } from 'react';

export default function Report({ results, file, onBack }) {
  // Handle TXID verification state
  const [txidStatus, setTxidStatus] = useState(null);
  const [txidLoading, setTxidLoading] = useState(false);

  const verifyTxid = async () => {
    setTxidLoading(true);
    setTxidStatus(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/verify-txid/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txid: results.blockchainHash }),
      });

      const data = await response.json();
      if (data.status === 'valid') {
        setTxidStatus({ valid: true, info: data.data });
      } else {
        setTxidStatus({ valid: false, message: data.message });
      }
    } catch (err) {
      setTxidStatus({ valid: false, message: err.message });
    }
    setTxidLoading(false);
  };

  // Show loading or error states
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
            <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    );
  }

  const tamperScore = results.isAuthentic
    ? Math.round(results.confidence * 100)
    : Math.round((1 - results.confidence) * 100);

  const metadata = results.metadata || {};

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-content { padding: 0; }
          body, html { background: white !important; }
        }
      `}</style>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-4 no-print">
        <h2 className="text-2xl font-bold text-gray-800">Forensic Analysis Report</h2>
        <button onClick={onBack} className="text-blue-600 hover:underline">
          ← Back to Dashboard
        </button>
      </div>

      {/* Main report content */}
      <div className="print-content">

        {/* ✅ Blockchain Verification */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="font-medium">Blockchain Verification:</p>
          <p className="font-mono text-sm break-all">
            TXID: {results.blockchainHash || "No verification record"}
          </p>

          <button
            onClick={verifyTxid}
            className="mt-2 text-sm text-blue-600 hover:underline"
            disabled={txidLoading}
          >
            {txidLoading ? "Verifying..." : "Verify TXID"}
          </button>

          {txidStatus && (
            <div className={`mt-2 text-sm ${txidStatus.valid ? "text-green-600" : "text-red-600"}`}>
              {txidStatus.valid
                ? `✅ Valid TXID – Verified on ${txidStatus.info.timestamp}`
                : `❌ ${txidStatus.message || "Invalid TXID"}`}
            </div>
          )}
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
        <div className={`mb-8 p-4 rounded-lg ${results.isAuthentic ? 'bg-teal-50 border-l-4 border-teal-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tampering Detection</h3>
          <p className={results.isAuthentic ? 'text-teal-800' : 'text-red-800'}>
            {results.isAuthentic ? '✅ Authentic' : '❌ Tampering Detected'}
          </p>
          <p>
            {results.isAuthentic ? 'Authenticity Confidence' : 'Tampering Confidence'}:
            <span className="font-bold"> {tamperScore}%</span>
          </p>
        </div>

        {/* Metadata */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Metadata Verification</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Status:</p>
                <p className={`font-medium ${metadata.status === "Clean" ? 'text-green-600' : 'text-red-600'}`}>
                  {metadata.status || "Not verified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Captured Device:</p>
                <p className="font-medium">{metadata.device || "Unknown"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Location (GPS):</p>
                <p className="font-medium">{metadata.location || "Unavailable"}</p>
              </div>
            </div>

            {metadata.details && Object.keys(metadata.details).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Extracted Metadata:</h4>
                <div className="max-h-64 overflow-auto border rounded p-2 text-xs bg-white shadow-inner">
                  {Object.entries(metadata.details).map(([key, value], i) => (
                    <div key={i} className="mb-1">
                      <span className="font-medium text-gray-800">{key}</span>: {value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {metadata.inconsistencies?.length > 0 && (
              <div className="bg-red-50 p-3 rounded-lg mt-4">
                <p className="font-semibold text-red-800">⚠️ Inconsistencies Found:</p>
                <ul className="list-disc pl-5 mt-2 text-red-700">
                  {metadata.inconsistencies.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer (Print only) */}
        <div className="hidden print:block mt-16 pt-4 border-t text-sm text-gray-500">
          <p>Generated by Image Evidence Authenticator</p>
          <p>Printed on: {new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Export as PDF Button */}
      <div className="border-t pt-4 mt-6 no-print">
        <button
          onClick={() => window.print()}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          Export as PDF
        </button>
      </div>
    </div>
  );
}
