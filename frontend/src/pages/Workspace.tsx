import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Workspace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Workspace: {workspaceId}
            </h2>
            <p className="text-gray-600">
              Your pages and blocks will appear here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
