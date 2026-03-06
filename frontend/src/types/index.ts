export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  owner_id: string;
  role?: 'owner' | 'admin' | 'member';
  memberCount?: number;
  created_at: string;
  updated_at?: string;
}

export interface Page {
  id: string;
  title: string;
  content: Record<string, unknown>;
  workspace_id: string;
  parent_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Block {
  id: string;
  page_id: string;
  parent_id: string | null;
  type: BlockType;
  content: Record<string, unknown>;
  position: number;
  created_at: string;
  updated_at: string;
}

export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bullet_list'
  | 'numbered_list'
  | 'todo'
  | 'code'
  | 'quote'
  | 'divider'
  | 'image';

export interface AuthResponse {
  token: string;
  user: User;
}
