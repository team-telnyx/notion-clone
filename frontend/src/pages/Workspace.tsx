import { useParams, Link } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="text-gray-500 hover:text-gray-700"
          >
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Workspace</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500">
              Workspace ID: {workspaceId}
            </p>
            <p className="text-gray-400 mt-2">
              Document editor will be implemented here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
