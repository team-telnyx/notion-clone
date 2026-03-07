import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold">Workspace: {workspaceId}</h2>
        </div>
        <nav>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Pages</h3>
          <ul className="space-y-1">
            <li className="text-gray-300 hover:bg-gray-800 px-2 py-1 rounded cursor-pointer">
              Getting Started
            </li>
          </ul>
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Back to Dashboard
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Page Content</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Logout
          </button>
        </header>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Select a page from the sidebar or create a new one.</p>
        </div>
      </main>
    </div>
  );
}

export default Workspace;
