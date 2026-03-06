import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Workspace {workspaceId}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex h-[calc(100vh-4rem)]">
        <aside className="w-64 bg-white shadow-sm p-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">Pages</h2>
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                📄 Getting Started
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                📄 Notes
              </button>
            </li>
            <li>
              <button className="w-full text-left px-3 py-2 text-gray-500 hover:bg-gray-100 rounded">
                + Add a page
              </button>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to your workspace</h1>
            <p className="text-gray-600">
              Start creating pages and organizing your thoughts.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
