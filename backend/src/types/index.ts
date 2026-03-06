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

export interface ParagraphContent {
  text: string;
  marks?: string[];
}

export interface HeadingContent {
  text: string;
}

export interface ListContent {
  items: string[];
}

export interface TodoContent {
  text: string;
  checked: boolean;
}

export interface CodeContent {
  text: string;
  language: string;
}

export interface QuoteContent {
  text: string;
}

export interface ImageContent {
  url: string;
  caption: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
}

export interface CreatePageRequest {
  title?: string;
  parent_id?: string | null;
}

export interface CreateBlockRequest {
  type: BlockType;
  content: Record<string, unknown>;
  parent_id?: string | null;
  position?: number;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password_hash'>;
}

export interface WorkspaceWithRole extends Workspace {
  role: 'owner' | 'admin' | 'member';
  memberCount?: number;
}
