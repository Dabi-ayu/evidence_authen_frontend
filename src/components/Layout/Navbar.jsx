import LogoutButton from '../Auth/LogoutButton';
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem('accessToken'); // Make sure token key matches
  const username = localStorage.getItem('username');

  return (
    <nav className="bg-white shadow p-4 mb-8 flex justify-between items-center px-6">
      <Link to="/" className="text-xl font-bold text-blue-600 hover:text-blue-700 transition">
        📸 Image Authenticator
      </Link>

      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FaUserCircle className="text-2xl text-gray-600" />
            <span className="hidden sm:inline text-gray-700 font-medium">{username}</span>
          </div>

          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
