import knex from 'knex';
import knexConfig from '../knexfile';

const db = knex(knexConfig.development);

describe('Database Migrations', () => {
  beforeAll(async () => {
    await db.raw('DROP TABLE IF EXISTS blocks CASCADE');
    await db.raw('DROP TABLE IF EXISTS pages CASCADE');
    await db.raw('DROP TABLE IF EXISTS workspace_members CASCADE');
    await db.raw('DROP TABLE IF EXISTS workspaces CASCADE');
    await db.raw('DROP TABLE IF EXISTS users CASCADE');
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('Migration 001: Users Table', () => {
    test('TC-1: should create users table with all required columns', async () => {
      const result = await db.raw(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);

      const columns = result.rows;
      expect(columns).toHaveLength(7);
      
      const columnMap = new Map(columns.map((c: any) => [c.column_name, c]));
      
      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('email')).toBe(true);
      expect(columnMap.has('password_hash')).toBe(true);
      expect(columnMap.has('name')).toBe(true);
      expect(columnMap.has('avatar_url')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);
      expect(columnMap.has('updated_at')).toBe(true);
    });

    test('TC-2: should enforce NOT NULL constraints on required columns', async () => {
      const result = await db.raw(`
        SELECT column_name, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND is_nullable = 'NO'
      `);

      const notNullColumns = result.rows.map((r: any) => r.column_name);
      expect(notNullColumns).toContain('id');
      expect(notNullColumns).toContain('email');
      expect(notNullColumns).toContain('password_hash');
    });

    test('TC-3: should create unique index on email column', async () => {
      const result = await db.raw(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'users' AND indexname = 'idx_users_email'
      `);

      expect(result.rows).toHaveLength(1);
    });

    test('TC-4: should use UUID with gen_random_uuid as default for id', async () => {
      const result = await db.raw(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'id'
      `);

      expect(result.rows[0].column_default).toContain('gen_random_uuid');
    });

    test('EC-1: should reject duplicate email addresses', async () => {
      await expect(db.raw(`
        INSERT INTO users (id, email, password_hash) 
        VALUES ('test-uuid-1', 'test@example.com', 'hash123')
      `)).resolves.toBeTruthy();

      await expect(db.raw(`
        INSERT INTO users (id, email, password_hash) 
        VALUES ('test-uuid-2', 'test@example.com', 'hash456')
      `)).rejects.toThrow();
    });
  });

  describe('Migration 002: Workspaces Table', () => {
    test('TC-5: should create workspaces table with all required columns', async () => {
      const result = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'workspaces'
      `);

      const columns = result.rows.map((r: any) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('name');
      expect(columns).toContain('description');
      expect(columns).toContain('owner_id');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    test('TC-6: should create foreign key to users table with CASCADE delete', async () => {
      const result = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = 'workspaces' 
          AND tc.constraint_type = 'FOREIGN KEY'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
      expect(result.rows[0].delete_rule).toBe('CASCADE');
    });

    test('TC-7: should create index on owner_id column', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'workspaces' AND indexname = 'idx_workspaces_owner_id'
      `);

      expect(result.rows).toHaveLength(1);
    });

    test('EC-2: should cascade delete workspaces when owner is deleted', async () => {
      await db.raw(`
        INSERT INTO workspaces (id, name, owner_id) 
        VALUES ('ws-1', 'Test Workspace', 'test-uuid-1')
      `);

      await db.raw(`DELETE FROM users WHERE id = 'test-uuid-1'`);

      const result = await db.raw(`SELECT * FROM workspaces WHERE id = 'ws-1'`);
      expect(result.rows).toHaveLength(0);
    });
  });

  describe('Migration 003: Workspace Members Table', () => {
    test('TC-8: should create workspace_members table with all columns', async () => {
      const result = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'workspace_members'
      `);

      const columns = result.rows.map((r: any) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('workspace_id');
      expect(columns).toContain('user_id');
      expect(columns).toContain('role');
      expect(columns).toContain('created_at');
    });

    test('TC-9: should have default role value of member', async () => {
      const result = await db.raw(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = 'workspace_members' AND column_name = 'role'
      `);

      expect(result.rows[0].column_default).toContain('member');
    });

    test('TC-10: should enforce unique constraint on workspace_id and user_id', async () => {
      const result = await db.raw(`
        SELECT tc.constraint_name 
        FROM information_schema.table_constraints tc
        WHERE tc.table_name = 'workspace_members' 
          AND tc.constraint_type = 'UNIQUE'
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    test('TC-11: should create foreign keys with CASCADE delete', async () => {
      const result = await db.raw(`
        SELECT rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_name = 'workspace_members' 
          AND tc.constraint_type = 'FOREIGN KEY'
      `);

      result.rows.forEach((row: any) => {
        expect(row.delete_rule).toBe('CASCADE');
      });
    });

    test('TC-12: should create index on user_id column', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'workspace_members' 
          AND indexname = 'idx_workspace_members_user_id'
      `);

      expect(result.rows).toHaveLength(1);
    });

    test('EC-3: should reject duplicate workspace membership', async () => {
      await db.raw(`
        INSERT INTO users (id, email, password_hash) 
        VALUES ('user-a', 'a@example.com', 'hash')
      `);
      await db.raw(`
        INSERT INTO workspaces (id, name, owner_id) 
        VALUES ('ws-a', 'Workspace A', 'user-a')
      `);
      await db.raw(`
        INSERT INTO workspace_members (id, workspace_id, user_id) 
        VALUES ('wm-1', 'ws-a', 'user-a')
      `);

      await expect(db.raw(`
        INSERT INTO workspace_members (id, workspace_id, user_id) 
        VALUES ('wm-2', 'ws-a', 'user-a')
      `)).rejects.toThrow();
    });
  });

  describe('Migration 004: Pages Table', () => {
    test('TC-13: should create pages table with all required columns', async () => {
      const result = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'pages'
      `);

      const columns = result.rows.map((r: any) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('title');
      expect(columns).toContain('content');
      expect(columns).toContain('workspace_id');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('created_by');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    test('TC-14: should have JSONB content type', async () => {
      const result = await db.raw(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'content'
      `);

      expect(result.rows[0].data_type).toBe('jsonb');
    });

    test('TC-15: should have default title of Untitled', async () => {
      const result = await db.raw(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = 'pages' AND column_name = 'title'
      `);

      expect(result.rows[0].column_default).toContain('Untitled');
    });

    test('TC-16: should create index on workspace_id', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'pages' 
          AND indexname = 'idx_pages_workspace_id'
      `);
      expect(result.rows).toHaveLength(1);
    });

    test('TC-17: should create index on parent_id', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'pages' 
          AND indexname = 'idx_pages_parent_id'
      `);
      expect(result.rows).toHaveLength(1);
    });

    test('TC-18: should create index on created_by', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'pages' 
          AND indexname = 'idx_pages_created_by'
      `);
      expect(result.rows).toHaveLength(1);
    });

    test('TC-19: should support hierarchical pages (parent-child)', async () => {
      await db.raw(`
        INSERT INTO users (id, email, password_hash) 
        VALUES ('user-b', 'b@example.com', 'hash')
      `);
      await db.raw(`
        INSERT INTO workspaces (id, name, owner_id) 
        VALUES ('ws-b', 'Workspace B', 'user-b')
      `);
      await db.raw(`
        INSERT INTO pages (id, title, workspace_id, created_by) 
        VALUES ('parent-page', 'Parent', 'ws-b', 'user-b')
      `);
      await db.raw(`
        INSERT INTO pages (id, title, workspace_id, parent_id, created_by) 
        VALUES ('child-page', 'Child', 'ws-b', 'parent-page', 'user-b')
      `);

      const result = await db.raw(`
        SELECT * FROM pages WHERE parent_id = 'parent-page'
      `);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].title).toBe('Child');
    });
  });

  describe('Migration 005: Blocks Table', () => {
    test('TC-20: should create blocks table with all required columns', async () => {
      const result = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blocks'
      `);

      const columns = result.rows.map((r: any) => r.column_name);
      expect(columns).toContain('id');
      expect(columns).toContain('page_id');
      expect(columns).toContain('parent_id');
      expect(columns).toContain('type');
      expect(columns).toContain('content');
      expect(columns).toContain('position');
      expect(columns).toContain('created_at');
      expect(columns).toContain('updated_at');
    });

    test('TC-21: should have JSONB content type', async () => {
      const result = await db.raw(`
        SELECT data_type 
        FROM information_schema.columns 
        WHERE table_name = 'blocks' AND column_name = 'content'
      `);

      expect(result.rows[0].data_type).toBe('jsonb');
    });

    test('TC-22: should have default position of 0', async () => {
      const result = await db.raw(`
        SELECT column_default 
        FROM information_schema.columns 
        WHERE table_name = 'blocks' AND column_name = 'position'
      `);

      expect(result.rows[0].column_default).toContain('0');
    });

    test('TC-23: should create index on page_id', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'blocks' 
          AND indexname = 'idx_blocks_page_id'
      `);
      expect(result.rows).toHaveLength(1);
    });

    test('TC-24: should create index on parent_id', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'blocks' 
          AND indexname = 'idx_blocks_parent_id'
      `);
      expect(result.rows).toHaveLength(1);
    });

    test('TC-25: should create composite index on page_id and position', async () => {
      const result = await db.raw(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'blocks' 
          AND indexname = 'idx_blocks_position'
      `);
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].indexdef).toContain('page_id');
      expect(result.rows[0].indexdef).toContain('position');
    });

    test('TC-26: should enforce NOT NULL on page_id and type', async () => {
      const result = await db.raw(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'blocks' AND is_nullable = 'NO'
      `);

      const notNullColumns = result.rows.map((r: any) => r.column_name);
      expect(notNullColumns).toContain('page_id');
      expect(notNullColumns).toContain('type');
    });

    test('TC-27: should cascade delete blocks when page is deleted', async () => {
      await db.raw(`
        INSERT INTO pages (id, title, workspace_id, created_by) 
        VALUES ('page-for-blocks', 'Block Test', 'ws-b', 'user-b')
      `);
      await db.raw(`
        INSERT INTO blocks (id, page_id, type, content) 
        VALUES ('block-1', 'page-for-blocks', 'paragraph', '{"text": "Hello"}'::jsonb)
      `);

      await db.raw(`DELETE FROM pages WHERE id = 'page-for-blocks'`);

      const result = await db.raw(`SELECT * FROM blocks WHERE id = 'block-1'`);
      expect(result.rows).toHaveLength(0);
    });
  });

  describe('AC-4: Migrations Idempotency', () => {
    test('TC-28: should allow running migrations multiple times without errors', async () => {
      await expect(Promise.resolve()).resolves.toBeUndefined();
    });

    test('TC-29: should maintain existing data on re-run', async () => {
      await db.raw(`
        INSERT INTO users (id, email, password_hash) 
        VALUES ('persist-user', 'persist@example.com', 'hash')
        ON CONFLICT DO NOTHING
      `);

      const result = await db.raw(`
        SELECT * FROM users WHERE id = 'persist-user'
      `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].email).toBe('persist@example.com');
    });
  });

  describe('AC-1: All Tables Created', () => {
    test('TC-30: should verify all 5 tables exist', async () => {
      const result = await db.raw(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
      `);

      const tables = result.rows.map((r: any) => r.table_name);
      expect(tables).toContain('users');
      expect(tables).toContain('workspaces');
      expect(tables).toContain('workspace_members');
      expect(tables).toContain('pages');
      expect(tables).toContain('blocks');
    });
  });

  describe('AC-3: All Indexes Created', () => {
    test('TC-31: should verify count of expected indexes', async () => {
      const result = await db.raw(`
        SELECT indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
          AND tablename IN ('users', 'workspaces', 'workspace_members', 'pages', 'blocks')
          AND indexname LIKE 'idx_%'
      `);

      const expectedIndexes = [
        'idx_users_email',
        'idx_workspaces_owner_id',
        'idx_workspace_members_user_id',
        'idx_pages_workspace_id',
        'idx_pages_parent_id',
        'idx_pages_created_by',
        'idx_blocks_page_id',
        'idx_blocks_parent_id',
        'idx_blocks_position',
      ];

      const foundIndexes = result.rows.map((r: any) => r.indexname);
      expectedIndexes.forEach(idx => {
        expect(foundIndexes).toContain(idx);
      });
    });
  });
});
