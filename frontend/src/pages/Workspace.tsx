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

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <button
            onClick={handleBackToDashboard}
            className="text-gray-300 hover:text-white flex items-center space-x-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </div>
        <div className="p-4 border-t border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Pages</h2>
          <nav className="space-y-2">
            <div className="text-gray-400 text-sm">No pages yet</div>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          <button className="w-full px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-md">
            + Add a page
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow">
          <div className="py-4 px-6 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Workspace {workspaceId}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-lg shadow p-6 min-h-96">
            <div className="text-gray-400 text-center py-12">
              <p className="text-lg">Select a page from the sidebar or create a new one</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
