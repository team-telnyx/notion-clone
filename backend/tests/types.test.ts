import fs from 'fs';
import path from 'path';

describe('Type Definitions Tests', () => {
  const typesPath = path.join(__dirname, '..', 'src/types/index.ts');
  let typesContent: string;

  beforeAll(() => {
    typesContent = fs.readFileSync(typesPath, 'utf-8');
  });

  describe('User Interface', () => {
    test('should have User interface with required fields', () => {
      expect(typesContent).toContain('export interface User');
      expect(typesContent).toContain('id: string');
      expect(typesContent).toContain('email: string');
      expect(typesContent).toContain('password_hash: string');
      expect(typesContent).toContain('name: string');
      expect(typesContent).toContain('avatar_url: string | null');
      expect(typesContent).toContain('created_at: Date');
      expect(typesContent).toContain('updated_at: Date');
    });
  });

  describe('Workspace Interface', () => {
    test('should have Workspace interface with required fields', () => {
      expect(typesContent).toContain('export interface Workspace');
      expect(typesContent).toContain('name: string');
      expect(typesContent).toContain('description: string | null');
      expect(typesContent).toContain('owner_id: string');
    });
  });

  describe('Page Interface', () => {
    test('should have Page interface with required fields', () => {
      expect(typesContent).toContain('export interface Page');
      expect(typesContent).toContain('title: string');
      expect(typesContent).toContain('content: Record<string, unknown>');
      expect(typesContent).toContain('workspace_id: string');
      expect(typesContent).toContain('parent_id: string | null');
      expect(typesContent).toContain('created_by: string');
    });
  });

  describe('Block Interface', () => {
    test('should have Block interface with required fields', () => {
      expect(typesContent).toContain('export interface Block');
      expect(typesContent).toContain('page_id: string');
      expect(typesContent).toContain('type: string');
      expect(typesContent).toContain('position: number');
    });
  });

  describe('WorkspaceMember Interface', () => {
    test('should have WorkspaceMember interface with role union type', () => {
      expect(typesContent).toContain('export interface WorkspaceMember');
      expect(typesContent).toContain('workspace_id: string');
      expect(typesContent).toContain('user_id: string');
      expect(typesContent).toContain("role: 'owner' | 'admin' | 'member'");
    });
  });
});
