import {
  User,
  Workspace,
  WorkspaceMember,
  Page,
  Block
} from '../types/index';

describe('Type Definitions Tests', () => {
  describe('TC-4: Type Exports', () => {
    it('should export User interface', () => {
      const mockUser: User = {
        id: 'test-uuid',
        email: 'test@example.com',
        password_hash: 'hashed-password',
        name: 'Test User',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(mockUser).toBeDefined();
      expect(mockUser.id).toBe('test-uuid');
    });

    it('should export Workspace interface', () => {
      const mockWorkspace: Workspace = {
        id: 'workspace-uuid',
        name: 'Test Workspace',
        description: null,
        owner_id: 'owner-uuid',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(mockWorkspace).toBeDefined();
      expect(mockWorkspace.name).toBe('Test Workspace');
    });

    it('should export WorkspaceMember interface', () => {
      const mockMember: WorkspaceMember = {
        id: 'member-uuid',
        workspace_id: 'workspace-uuid',
        user_id: 'user-uuid',
        role: 'member',
        created_at: new Date()
      };
      
      expect(mockMember).toBeDefined();
      expect(mockMember.role).toBe('member');
    });

    it('should export Page interface', () => {
      const mockPage: Page = {
        id: 'page-uuid',
        title: 'Test Page',
        content: { blocks: [] },
        workspace_id: 'workspace-uuid',
        parent_id: null,
        created_by: 'user-uuid',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(mockPage).toBeDefined();
      expect(mockPage.title).toBe('Test Page');
    });

    it('should export Block interface', () => {
      const mockBlock: Block = {
        id: 'block-uuid',
        page_id: 'page-uuid',
        parent_id: null,
        type: 'paragraph',
        content: { text: 'Hello World' },
        position: 0,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(mockBlock).toBeDefined();
      expect(mockBlock.type).toBe('paragraph');
    });
  });

  describe('EC-3: Type Constraints', () => {
    it('should support all workspace member roles', () => {
      const owner: WorkspaceMember = {
        id: '1',
        workspace_id: '1',
        user_id: '1',
        role: 'owner',
        created_at: new Date()
      };
      
      const admin: WorkspaceMember = {
        id: '2',
        workspace_id: '1',
        user_id: '2',
        role: 'admin',
        created_at: new Date()
      };
      
      expect(owner.role).toBe('owner');
      expect(admin.role).toBe('admin');
    });

    it('should support nullable fields', () => {
      const user: User = {
        id: 'test',
        email: 'test@test.com',
        password_hash: 'hash',
        name: 'Test',
        avatar_url: null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      expect(user.avatar_url).toBeNull();
    });
  });
});
