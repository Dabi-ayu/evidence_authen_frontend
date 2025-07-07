import LogoutButton from '../Auth/LogoutButton';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <nav className="bg-white shadow p-4 mb-6 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        📸 Image Authenticator
      </Link>

      {isAuthenticated && (
        <div>
          <LogoutButton />
        </div>
      )}
    </nav>
  );
}
