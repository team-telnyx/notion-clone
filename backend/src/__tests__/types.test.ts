import * as types from '../types';

describe('Types Interface Tests', () => {
  describe('AC-5: Type Definitions', () => {
    it('TC-17: should export User interface', () => {
      const user: types.User = {
        id: 'test-id',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        name: 'Test User',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(user).toBeDefined();
      expect(user.id).toBe('test-id');
      expect(user.email).toBe('test@example.com');
    });

    it('TC-18: should export Workspace interface', () => {
      const workspace: types.Workspace = {
        id: 'ws-id',
        name: 'Test Workspace',
        description: null,
        owner_id: 'user-id',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(workspace).toBeDefined();
      expect(workspace.name).toBe('Test Workspace');
    });

    it('TC-19: should export WorkspaceMember interface', () => {
      const member: types.WorkspaceMember = {
        id: 'member-id',
        workspace_id: 'ws-id',
        user_id: 'user-id',
        role: 'member',
        created_at: new Date()
      };
      
      expect(member).toBeDefined();
      expect(member.role).toBe('member');
      
      const adminMember: types.WorkspaceMember = {
        ...member,
        role: 'admin'
      };
      expect(adminMember.role).toBe('admin');
    });

    it('TC-20: should export Page interface', () => {
      const page: types.Page = {
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
      expect(page.title).toBe('Test Page');
    });

    it('TC-21: should export Block interface', () => {
      const block: types.Block = {
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
    });

    it('EC-6: should allow null for optional fields', () => {
      const user: types.User = {
        id: 'id',
        email: 'email@test.com',
        password_hash: 'hash',
        name: 'Name',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(user.avatar_url).toBeNull();
    });
  });
});
