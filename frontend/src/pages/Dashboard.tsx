import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  role: string;
  memberCount: number;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await api.get('/workspaces');
      setWorkspaces(res.data);
    } catch {
      console.error('Failed to fetch workspaces');
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/workspaces', {
        name: newWorkspaceName,
        description: newWorkspaceDescription,
      });
      setShowCreateModal(false);
      setNewWorkspaceName('');
      setNewWorkspaceDescription('');
      fetchWorkspaces();
    } catch {
      console.error('Failed to create workspace');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name || user?.email}</span>
            <button
              onClick={logout}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Workspaces</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create Workspace
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No workspaces yet. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                to={`/workspace/${workspace.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
              >
                <h3 className="text-lg font-medium text-gray-900">{workspace.name}</h3>
                {workspace.description && (
                  <p className="mt-2 text-sm text-gray-500">{workspace.description}</p>
                )}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {workspace.role}
                  </span>
                  <span className="text-gray-500">
                    {workspace.memberCount} member{workspace.memberCount !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Create Workspace</h3>
            <form onSubmit={createWorkspace} className="space-y-4">
              <div>
                <label htmlFor="workspaceName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="workspaceName"
                  type="text"
                  required
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="workspaceDescription" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="workspaceDescription"
                  value={newWorkspaceDescription}
                  onChange={(e) => setNewWorkspaceDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
