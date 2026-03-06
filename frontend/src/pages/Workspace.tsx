import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Workspace() {
  const { workspaceId } = useParams();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Workspace {workspaceId}</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500 text-lg">Workspace content will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
