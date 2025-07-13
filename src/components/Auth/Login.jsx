import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function Login({ user, onLogin, onError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

      const response = await fetch(`${API_BASE_URL}token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password
        }),
      });


      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('username', username);
        onLogin({ username, accessToken: data.access });
      } else {
        onError(data.detail || 'Login failed');
      }

    } catch (err) {
      onError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 mt-16 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Welcome Back</h2>

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <User className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full outline-none text-sm"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full outline-none text-sm"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
