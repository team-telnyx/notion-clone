import { useParams, useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Workspace</h2>
          <p className="text-sm text-gray-400 mb-4">ID: {workspaceId}</p>
          <button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 mb-4">
            New Page
          </button>
          <nav className="space-y-2">
            <p className="text-gray-500 text-sm">No pages yet</p>
          </nav>
        </div>
      </aside>
      <main className="flex-1">
        <header className="bg-white shadow">
          <div className="py-4 px-6 flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center gap-4">
              <span className="text-gray-700">{user?.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        <div className="p-6">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Select or create a page to start editing</p>
          </div>
        </div>
      </main>
    </div>
  );
}
