import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Workspace() {
  const { workspaceId } = useParams();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                ← Back
              </Link>
              <h1 className="text-xl font-bold text-gray-900">
                Workspace: {workspaceId}
              </h1>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">{user?.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-gray-500">Workspace content will appear here</p>
          </div>
        </div>
      </main>
    </div>
  );
}
