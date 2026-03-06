import { describe, it, expect } from 'bun:test';
import type { User, Workspace, WorkspaceMember, Page, Block } from '../../types/index';

describe('Type Definitions', () => {
  describe('User Interface', () => {
    it('should define User interface with all required fields', () => {
      const user: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        name: 'Test User',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(user).toBeDefined();
      expect(user.id).toBe('test-uuid');
      expect(user.email).toBe('test@example.com');
    });
  });

  describe('Workspace Interface', () => {
    it('should define Workspace interface with all required fields', () => {
      const workspace: Workspace = {
        id: 'workspace-uuid',
        name: 'Test Workspace',
        description: null,
        owner_id: 'user-uuid',
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(workspace).toBeDefined();
      expect(workspace.name).toBe('Test Workspace');
    });

    it('should allow description to be string or null', () => {
      const workspaceWithDesc: Workspace = {
        id: 'uuid',
        name: 'Test',
        description: 'A description',
        owner_id: 'user-uuid',
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(workspaceWithDesc.description).toBe('A description');
    });
  });

  describe('WorkspaceMember Interface', () => {
    it('should define WorkspaceMember with valid role types', () => {
      const member: WorkspaceMember = {
        id: 'member-uuid',
        workspace_id: 'workspace-uuid',
        user_id: 'user-uuid',
        role: 'admin',
        created_at: new Date()
      };

      expect(['owner', 'admin', 'member']).toContain(member.role);
    });
  });

  describe('Page Interface', () => {
    it('should define Page interface with JSONB content field', () => {
      const page: Page = {
        id: 'page-uuid',
        title: 'Test Page',
        content: { blocks: [], metadata: {} },
        workspace_id: 'workspace-uuid',
        parent_id: null,
        created_by: 'user-uuid',
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(page).toBeDefined();
      expect(typeof page.content).toBe('object');
    });
  });

  describe('Block Interface', () => {
    it('should define Block interface with all required fields', () => {
      const block: Block = {
        id: 'block-uuid',
        page_id: 'page-uuid',
        parent_id: null,
        type: 'paragraph',
        content: { text: 'Hello world' },
        position: 0,
        created_at: new Date(),
        updated_at: new Date()
      };

      expect(block).toBeDefined();
      expect(block.position).toBe(0);
    });
  });
});
