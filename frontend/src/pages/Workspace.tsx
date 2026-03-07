import { useParams } from 'react-router-dom';

export default function Workspace() {
  const { workspaceId } = useParams();
  return <div className="p-8">Workspace: {workspaceId}</div>;
}
