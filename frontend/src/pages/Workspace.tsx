import { useParams, Link } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Workspace</h2>
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Back
          </Link>
        </div>
        
        <button className="w-full px-3 py-2 text-sm text-left text-gray-300 hover:bg-gray-800 rounded">
          + New Page
        </button>

        <nav className="mt-4 space-y-1">
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded cursor-pointer">
            📄 Getting Started
          </div>
          <div className="px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded cursor-pointer">
            📄 Notes
          </div>
        </nav>
      </aside>

      <main className="flex-1 bg-white p-8">
        <div className="max-w-3xl mx-auto">
          <input
            type="text"
            defaultValue="Untitled"
            className="w-full text-4xl font-bold border-none outline-none placeholder-gray-300"
            placeholder="Untitled"
          />
          
          <div className="mt-8 text-gray-500">
            <p>Workspace ID: {workspaceId}</p>
            <p className="mt-4">Click "New Page" to create a page or select an existing page from the sidebar.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
