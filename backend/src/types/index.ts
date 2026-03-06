export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface Workspace {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: Date;
}

export interface Page {
  id: string;
  title: string;
  content: Record<string, unknown>;
  workspace_id: string;
  parent_id: string | null;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface Block {
  id: string;
  page_id: string;
  parent_id: string | null;
  type: string;
  content: Record<string, unknown>;
  position: number;
  created_at: Date;
  updated_at: Date;
}
