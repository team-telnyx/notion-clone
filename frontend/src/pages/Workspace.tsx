import { useParams, Link } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Workspace</h2>
          <p className="text-sm text-gray-500">ID: {workspaceId}</p>
        </div>
        <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 mb-4">
          New Page
        </button>
        <nav className="space-y-2">
          <p className="text-sm text-gray-500">No pages yet</p>
        </nav>
        <div className="mt-auto pt-4 border-t border-gray-200">
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to your Workspace
          </h1>
          <p className="text-gray-600">
            Select a page from the sidebar or create a new one to get started.
          </p>
        </div>
      </main>
    </div>
  );
}
