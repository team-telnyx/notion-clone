import { useParams } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Workspace: {workspaceId}
        </h1>
        <p className="text-gray-600">Workspace page placeholder</p>
      </div>
    </div>
  );
}
