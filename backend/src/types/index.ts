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
  type: BlockType;
  content: Record<string, unknown>;
  position: number;
  created_at: Date;
  updated_at: Date;
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

export interface AuthPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface ApiError {
  status: 'error';
  statusCode: number;
  message: string;
  stack?: string;
}

export interface ApiSuccess<T> {
  status: 'success';
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;
