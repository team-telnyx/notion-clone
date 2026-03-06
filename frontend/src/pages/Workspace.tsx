import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

interface Page {
  id: string;
  title: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

interface WorkspaceInfo {
  id: string;
  name: string;
  description?: string;
}

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const { user, logout } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceInfo | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  const fetchWorkspaceData = useCallback(async () => {
    try {
      const [workspaceRes, pagesRes] = await Promise.all([
        api.get(`/workspaces/${workspaceId}`),
        api.get(`/workspaces/${workspaceId}/pages`),
      ]);
      setWorkspace(workspaceRes.data);
      setPages(pagesRes.data);
    } catch {
      console.error('Failed to fetch workspace data');
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspaceData();
    }
  }, [workspaceId, fetchWorkspaceData]);

  const createPage = async () => {
    try {
      const res = await api.post(`/workspaces/${workspaceId}/pages`, {
        title: 'Untitled',
        parent_id: null,
      });
      setPages([...pages, res.data]);
      setSelectedPage(res.data);
    } catch {
      console.error('Failed to create page');
    }
  };

  const renderPageTree = (parentId: string | null = null): React.ReactNode => {
    const childPages = pages.filter((p) => p.parent_id === parentId);
    if (childPages.length === 0) return null;

    return (
      <ul className="ml-4">
        {childPages.map((page) => (
          <li key={page.id}>
            <button
              onClick={() => setSelectedPage(page)}
              className={`w-full text-left px-2 py-1 rounded hover:bg-gray-200 ${
                selectedPage?.id === page.id ? 'bg-gray-200' : ''
              }`}
            >
              {page.title}
            </button>
            {renderPageTree(page.id)}
          </li>
        ))}
      </ul>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-100 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 truncate">{workspace?.name}</h2>
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">
            ←
          </Link>
        </div>
        <button
          onClick={createPage}
          className="w-full px-3 py-2 mb-4 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          New Page
        </button>
        <nav>
          <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">Pages</h3>
          {pages.length === 0 ? (
            <p className="text-sm text-gray-500">No pages yet</p>
          ) : (
            renderPageTree(null)
          )}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedPage?.title || 'Workspace'}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name || user?.email}</span>
            <button onClick={logout} className="text-sm text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </header>

        {selectedPage ? (
          <div className="bg-white rounded-lg shadow p-6">
            <input
              type="text"
              value={selectedPage.title}
              onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
              className="text-3xl font-bold w-full border-none outline-none mb-4"
              placeholder="Untitled"
            />
            <div className="text-gray-500">
              Select or create blocks to start editing this page.
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Select a page from the sidebar or create a new one.
          </div>
        )}
      </main>
    </div>
  );
}
