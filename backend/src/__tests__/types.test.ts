import { existsSync } from 'fs';
import { resolve } from 'path';
import type { User, Workspace, WorkspaceMember, Page, Block } from '../types';

describe('TypeScript Types - Directory Structure', () => {
  describe('TypeScript Types Setup', () => {
    const typesDir = resolve(__dirname, '../types');
    const indexPath = resolve(typesDir, 'index.ts');

    it('should have types directory', () => {
      const exists = existsSync(typesDir);
      expect(exists).toBe(true);
    });

    it('should have types/index.ts file', () => {
      const exists = existsSync(indexPath);
      expect(exists).toBe(true);
    });
  });

  describe('Interface Exports', () => {
    it('should export User interface', () => {
      const user: User = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hash',
        name: 'Test User',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      expect(user.id).toBeDefined();
    });

    it('should export Workspace interface', () => {
      const workspace: Workspace = {
        id: 'workspace-id',
        name: 'Test Workspace',
        description: null,
        owner_id: 'owner-id',
        created_at: new Date(),
        updated_at: new Date()
      };
      expect(workspace.id).toBeDefined();
    });

    it('should export WorkspaceMember interface', () => {
      const member: WorkspaceMember = {
        id: 'member-id',
        workspace_id: 'workspace-id',
        user_id: 'user-id',
        role: 'member',
        created_at: new Date()
      };
      expect(member.role).toBe('member');
    });

    it('should export Page interface', () => {
      const page: Page = {
        id: 'page-id',
        title: 'Test Page',
        content: {},
        workspace_id: 'workspace-id',
        parent_id: null,
        created_by: 'user-id',
        created_at: new Date(),
        updated_at: new Date()
      };
      expect(page.title).toBeDefined();
    });

    it('should export Block interface', () => {
      const block: Block = {
        id: 'block-id',
        page_id: 'page-id',
        parent_id: null,
        type: 'paragraph',
        content: {},
        position: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      expect(block.type).toBe('paragraph');
    });
  });
});

describe('Directory Structure Verification', () => {
  const srcDir = resolve(__dirname, '..');

  it('should have routes directory', () => {
    const routesDir = resolve(srcDir, 'routes');
    expect(existsSync(routesDir)).toBe(true);
  });

  it('should have middleware directory', () => {
    const middlewareDir = resolve(srcDir, 'middleware');
    expect(existsSync(middlewareDir)).toBe(true);
  });

  it('should have db directory', () => {
    const dbDir = resolve(srcDir, 'db');
    expect(existsSync(dbDir)).toBe(true);
  });

  it('should have types directory', () => {
    const typesDir = resolve(srcDir, 'types');
    expect(existsSync(typesDir)).toBe(true);
  });
});
