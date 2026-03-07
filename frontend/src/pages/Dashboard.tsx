import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Workspaces</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">No workspaces yet. Create your first workspace to get started.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
