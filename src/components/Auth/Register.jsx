import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register({ user, onRegisterSuccess, onError }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      console.log("API Base URL:", API_BASE_URL);

      const response = await fetch(`${API_BASE_URL}register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      onRegisterSuccess?.();
      navigate("/login");
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-14 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Create Your Account</h2>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
        {/* Username */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <User className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full outline-none text-sm"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Mail className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full outline-none text-sm"
              autoComplete="off"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none text-sm"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
          <div className="flex items-center border rounded px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Lock className="text-gray-400 mr-2 w-5 h-5" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full outline-none text-sm"
              autoComplete="new-password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="ml-2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-5 text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">Login here</a>
      </p>
    </div>
  );
}
