import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import Report from './components/Report';
import { FaUserCircle } from 'react-icons/fa';

import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

import ProtectedRoute from './pages/ProtectedRoute';
import { FaCamera } from 'react-icons/fa';


function AppContent() {
  // index.js

  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const access = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    if (access && username) {
      setUser({ username, accessToken: access });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    setUser(null);
    setFile(null);
    setResults(null);
    setShowReport(false);
  };

  const analyzeImage = async (uploadedFile) => {
    setFile(uploadedFile);

    if (!user || !user.accessToken) {
      setResults({
        status: 'error',
        message: 'You must be logged in to analyze images.'
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      setResults({ status: 'loading' });
      //
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}token/`
        , {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });

      if (!response.ok) {
        if (response.status === 401) {
          logout();
          throw new Error('Session expired. Please log in again.');
        }
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Verification failed');
      }

      const data = await response.json();

      setResults({
        status: 'complete',
        isFake: data.is_authentic,
        confidence: data.confidence,
        metadata: {
          status: data.metadata_status,
          details: data.metadata_details || {},
          inconsistencies: data.metadata_status !== "Clean" ? [data.metadata_status] : []
        },
        imageHash: data.image_hash
      });

    } catch (error) {
      setResults({
        status: 'error',
        message: error.message || 'Failed to verify evidence'
      });
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setAuthError(null);
  };

  const handleAuthError = (errorMessage) => {
    setAuthError(errorMessage);
  };

  const handleRegisterSuccess = () => {
    setAuthError(null);
  };

  const handleTitleClick = () => {
    setFile(null);
    setResults(null);
    setShowReport(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow p-2 mb-8 flex justify-between items-center px-6">
        <button
          onClick={handleTitleClick}
          className="flex items-center gap-2 text-xl font-bold text-blue-600 hover:text-blue-700 transition"
        >
          <FaCamera className="text-2xl" />
          Image Evidence Authenticator
        </button>

        <div>
          {user ? (
            <>
              <span className="mr-4 gap-2">
                <FaUserCircle className="text-2xl text-gray-600" />
                <strong>{user.username}</strong>
              </span>
              <button
                onClick={logout}
                className="py-1 ml-28 px-3 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="mr-4 text-blue-600 hover:underline">Login</a>
              <a href="/register" className="text-blue-600 hover:underline">Register</a>
            </>
          )}
        </div>
      </header>

      <Routes>
        <Route path="/" element={<ProtectedRoute user={user} redirectPath="/login" />}>
          <Route
            index
            element={
              !file ? (
                <Upload onFileUpload={analyzeImage} />
              ) : showReport ? (
                <Report results={results} file={file} onBack={() => setShowReport(false)} />
              ) : (
                <Dashboard results={results} onViewReport={() => setShowReport(true)} />
              )
            }
          />
        </Route>

        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} onError={handleAuthError} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" replace /> : <Register onRegisterSuccess={handleRegisterSuccess} onError={handleAuthError} />}
        />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
      </Routes>


      {authError && (
        <div className="max-w-4xl mx-auto mt-4 p-3 bg-red-100 text-red-800 rounded shadow">
          <strong>Error:</strong> {authError}
        </div>
      )}
    </div>
  );
}

// Wrap AppContent in Router
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
