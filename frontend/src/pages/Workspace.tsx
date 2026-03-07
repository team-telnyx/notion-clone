import { useParams } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Workspace
        </h1>
        <p className="mt-2 text-gray-600">
          Workspace ID: {workspaceId}
        </p>
      </div>
    </div>
  );
}
