import { User, Workspace, Page, Block, WorkspaceMember } from '../src/types';

describe('Type Definitions', () => {
  test('should export User interface with correct fields', () => {
    const user: User = {
      id: 'test-id',
      email: 'test@example.com',
      password_hash: 'hash123',
      name: 'Test User',
      avatar_url: null,
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(user).toBeDefined();
    expect(user.id).toBe('test-id');
    expect(user.email).toBe('test@example.com');
  });

  test('should export Workspace interface with correct fields', () => {
    const workspace: Workspace = {
      id: 'ws-id',
      name: 'Test Workspace',
      description: null,
      owner_id: 'user-id',
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(workspace).toBeDefined();
    expect(workspace.name).toBe('Test Workspace');
    expect(workspace.owner_id).toBe('user-id');
  });

  test('should export Page interface with content field', () => {
    const page: Page = {
      id: 'page-id',
      title: 'Test Page',
      content: { blocks: [] },
      workspace_id: 'ws-id',
      parent_id: null,
      created_by: 'user-id',
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(page).toBeDefined();
    expect(page.content).toEqual({ blocks: [] });
    expect(page.parent_id).toBeNull();
  });

  test('should export Block interface with parent_id field', () => {
    const block: Block = {
      id: 'block-id',
      page_id: 'page-id',
      parent_id: null,
      type: 'text',
      content: { text: 'Hello' },
      position: 0,
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(block).toBeDefined();
    expect(block.type).toBe('text');
    expect(block.position).toBe(0);
  });

  test('should export WorkspaceMember interface with role field', () => {
    const member: WorkspaceMember = {
      id: 'member-id',
      workspace_id: 'ws-id',
      user_id: 'user-id',
      role: 'admin',
      created_at: new Date()
    };

    expect(member).toBeDefined();
    expect(member.role).toBe('admin');
  });
});
