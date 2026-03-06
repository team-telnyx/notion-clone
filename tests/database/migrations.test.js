const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

describe('Database Migrations', () => {
  let client;
  const migrationsDir = path.join(__dirname, '../../migrations');
  
  beforeAll(async () => {
    client = new Client({
      host: process.env.DB_HOST || 'pgbot-main-18.internal',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'notion_clone',
      user: process.env.DB_USER || 'notion_clone',
    });
    await client.connect();
  });

  afterAll(async () => {
    await client.end();
  });

  beforeEach(async () => {
    await client.query('DELETE FROM blocks WHERE 1=1');
    await client.query('DELETE FROM pages WHERE 1=1');
    await client.query('DELETE FROM workspace_members WHERE 1=1');
    await client.query('DELETE FROM workspaces WHERE 1=1');
    await client.query('DELETE FROM users WHERE 1=1');
  });

  const runMigration = async (filename) => {
    const migrationPath = path.join(migrationsDir, filename);
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${filename}`);
    }
    const sql = fs.readFileSync(migrationPath, 'utf8');
    await client.query(sql);
  };

  describe('AC-1: All 5 tables created with exact columns', () => {
    test('TC-1: should create users table with exact columns', async () => {
      await runMigration('001_create_users.sql');
      
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position
      `);

      const columns = result.rows;
      expect(columns).toHaveLength(7);
      
      const colMap = {};
      columns.forEach(col => colMap[col.column_name] = col);
      
      expect(colMap.id.data_type).toBe('uuid');
      expect(colMap.email.data_type).toMatch(/varchar|character varying/i);
      expect(colMap.email.is_nullable).toBe('NO');
      expect(colMap.password_hash.data_type).toMatch(/varchar|character varying/i);
      expect(colMap.name.data_type).toMatch(/varchar|character varying/i);
      expect(colMap.name.is_nullable).toBe('YES');
      expect(colMap.avatar_url.data_type).toBe('text');
      expect(colMap.created_at.data_type).toMatch(/timestamp/i);
      expect(colMap.updated_at.data_type).toMatch(/timestamp/i);
    });

    test('TC-2: should create workspaces table with owner_id foreign key', async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'workspaces'
      `);

      const colMap = {};
      result.rows.forEach(col => colMap[col.column_name] = col);

      expect(colMap.id.data_type).toBe('uuid');
      expect(colMap.name.data_type).toMatch(/varchar/i);
      expect(colMap.name.is_nullable).toBe('NO');
      expect(colMap.description.data_type).toBe('text');
      expect(colMap.owner_id.data_type).toBe('uuid');
      expect(colMap.owner_id.is_nullable).toBe('NO');

      const fkResult = await client.query(`
        SELECT tc.constraint_name, ccu.table_name AS foreign_table_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'workspaces' AND tc.constraint_type = 'FOREIGN KEY'
      `);

      expect(fkResult.rows.length).toBeGreaterThan(0);
      expect(fkResult.rows.find(r => r.foreign_table_name === 'users')).toBeTruthy();
    });

    test('TC-3: should create workspace_members table with unique constraint', async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('003_create_workspace_members.sql');
      
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'workspace_members'
      `);

      const colMap = {};
      result.rows.forEach(col => colMap[col.column_name] = col);

      expect(colMap.id.data_type).toBe('uuid');
      expect(colMap.workspace_id.data_type).toBe('uuid');
      expect(colMap.workspace_id.is_nullable).toBe('NO');
      expect(colMap.user_id.data_type).toBe('uuid');
      expect(colMap.user_id.is_nullable).toBe('NO');
      expect(colMap.role.data_type).toMatch(/varchar/i);
      expect(colMap.role.is_nullable).toBe('NO');
      expect(colMap.role.column_default).toBe("'member'::character varying");

      const uniqueResult = await client.query(`
        SELECT constraint_name
        FROM information_schema.table_constraints
        WHERE table_name = 'workspace_members' AND constraint_type = 'UNIQUE'
      `);

      expect(uniqueResult.rows.length).toBeGreaterThan(0);
    });

    test('TC-4: should create pages table with parent self-reference', async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('004_create_pages.sql');
      
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'pages'
      `);

      const colMap = {};
      result.rows.forEach(col => colMap[col.column_name] = col);

      expect(colMap.id.data_type).toBe('uuid');
      expect(colMap.title.data_type).toMatch(/varchar/i);
      expect(colMap.title.is_nullable).toBe('NO');
      expect(colMap.title.column_default).toBe("'Untitled'::character varying");
      expect(colMap.content.data_type).toBe('jsonb');
      expect(colMap.workspace_id.data_type).toBe('uuid');
      expect(colMap.workspace_id.is_nullable).toBe('NO');
      expect(colMap.parent_id.data_type).toBe('uuid');
      expect(colMap.parent_id.is_nullable).toBe('YES');
      expect(colMap.created_by.data_type).toBe('uuid');
      expect(colMap.created_by.is_nullable).toBe('NO');

      const fkResult = await client.query(`
        SELECT tc.constraint_name, kcu.column_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu ON kcu.constraint_name = tc.constraint_name
        WHERE tc.table_name = 'pages' AND tc.constraint_type = 'FOREIGN KEY'
      `);

      const parentFk = fkResult.rows.find(r => r.column_name === 'parent_id');
      expect(parentFk).toBeTruthy();
    });

    test('TC-5: should create blocks table with parent self-reference', async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('004_create_pages.sql');
      await runMigration('005_create_blocks.sql');
      
      const result = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'blocks'
      `);

      const colMap = {};
      result.rows.forEach(col => colMap[col.column_name] = col);

      expect(colMap.id.data_type).toBe('uuid');
      expect(colMap.page_id.data_type).toBe('uuid');
      expect(colMap.page_id.is_nullable).toBe('NO');
      expect(colMap.parent_id.data_type).toBe('uuid');
      expect(colMap.parent_id.is_nullable).toBe('YES');
      expect(colMap.type.data_type).toMatch(/varchar/i);
      expect(colMap.type.is_nullable).toBe('NO');
      expect(colMap.content.data_type).toBe('jsonb');
      expect(colMap.position.data_type).toBe('integer');
      expect(colMap.position.is_nullable).toBe('NO');
      expect(colMap.position.column_default).toBe('0');
    });
  });

  describe('AC-2: Foreign keys cascade properly', () => {
    beforeAll(async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('003_create_workspace_members.sql');
      await runMigration('004_create_pages.sql');
      await runMigration('005_create_blocks.sql');
    });

    test('TC-6: should cascade delete workspaces when owner deleted', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test@example.com', 'hash123', 'Test User']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;

      await client.query('DELETE FROM users WHERE id = $1', [userId]);

      const checkResult = await client.query(
        'SELECT * FROM workspaces WHERE id = $1',
        [workspaceId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    test('TC-7: should cascade delete workspace_members on workspace delete', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test2@example.com', 'hash123', 'Test User 2']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace 2', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      await client.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspaceId, userId, 'owner']
      );

      await client.query('DELETE FROM workspaces WHERE id = $1', [workspaceId]);

      const checkResult = await client.query(
        'SELECT * FROM workspace_members WHERE workspace_id = $1',
        [workspaceId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    test('TC-8: should cascade delete workspace_members on user delete', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test3@example.com', 'hash123', 'Test User 3']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace 3', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      await client.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspaceId, userId, 'owner']
      );

      await client.query('DELETE FROM users WHERE id = $1', [userId]);

      const checkResult = await client.query(
        'SELECT * FROM workspace_members WHERE user_id = $1',
        [userId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    test('TC-9: should cascade delete pages on workspace delete', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test4@example.com', 'hash123', 'Test User 4']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace 4', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const pageResult = await client.query(
        "INSERT INTO pages (title, workspace_id, created_by) VALUES ($1, $2, $3) RETURNING id",
        ['Test Page', workspaceId, userId]
      );
      const pageId = pageResult.rows[0].id;

      await client.query('DELETE FROM workspaces WHERE id = $1', [workspaceId]);

      const checkResult = await client.query(
        'SELECT * FROM pages WHERE id = $1',
        [pageId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    test('TC-10: should cascade delete blocks on page delete', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test5@example.com', 'hash123', 'Test User 5']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace 5', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const pageResult = await client.query(
        "INSERT INTO pages (title, workspace_id, created_by) VALUES ($1, $2, $3) RETURNING id",
        ['Test Page 2', workspaceId, userId]
      );
      const pageId = pageResult.rows[0].id;
      
      const blockResult = await client.query(
        "INSERT INTO blocks (page_id, type, content, position) VALUES ($1, $2, $3, $4) RETURNING id",
        [pageId, 'paragraph', '{"text": "test"}', 0]
      );
      const blockId = blockResult.rows[0].id;

      await client.query('DELETE FROM pages WHERE id = $1', [pageId]);

      const checkResult = await client.query(
        'SELECT * FROM blocks WHERE id = $1',
        [blockId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });

    test('TC-11: should cascade delete child blocks on parent block delete', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['test6@example.com', 'hash123', 'Test User 6']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Test Workspace 6', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const pageResult = await client.query(
        "INSERT INTO pages (title, workspace_id, created_by) VALUES ($1, $2, $3) RETURNING id",
        ['Test Page 3', workspaceId, userId]
      );
      const pageId = pageResult.rows[0].id;
      
      const parentBlockResult = await client.query(
        "INSERT INTO blocks (page_id, type, content, position) VALUES ($1, $2, $3, $4) RETURNING id",
        [pageId, 'paragraph', '{"text": "parent"}', 0]
      );
      const parentBlockId = parentBlockResult.rows[0].id;
      
      const childBlockResult = await client.query(
        "INSERT INTO blocks (page_id, parent_id, type, content, position) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        [pageId, parentBlockId, 'paragraph', '{"text": "child"}', 0]
      );
      const childBlockId = childBlockResult.rows[0].id;

      await client.query('DELETE FROM blocks WHERE id = $1', [parentBlockId]);

      const checkResult = await client.query(
        'SELECT * FROM blocks WHERE id = $1',
        [childBlockId]
      );
      expect(checkResult.rows).toHaveLength(0);
    });
  });

  describe('AC-3: All indexes created', () => {
    beforeAll(async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('003_create_workspace_members.sql');
      await runMigration('004_create_pages.sql');
      await runMigration('005_create_blocks.sql');
    });

    test('TC-12: should create all required indexes on users table', async () => {
      const result = await client.query(`
        SELECT indexname FROM pg_indexes WHERE tablename = 'users'
      `);
      
      const indexes = result.rows.map(r => r.indexname);
      
      expect(indexes).toContain('idx_users_email');
      expect(indexes.some(idx => idx.includes('users_pkey'))).toBe(true);
    });

    test('TC-13: should create all required indexes on workspaces table', async () => {
      const result = await client.query(`
        SELECT indexname FROM pg_indexes WHERE tablename = 'workspaces'
      `);
      
      const indexes = result.rows.map(r => r.indexname);
      
      expect(indexes).toContain('idx_workspaces_owner_id');
      expect(indexes.some(idx => idx.includes('workspaces_pkey'))).toBe(true);
    });

    test('TC-14: should create all required indexes on workspace_members table', async () => {
      const result = await client.query(`
        SELECT indexname FROM pg_indexes WHERE tablename = 'workspace_members'
      `);
      
      const indexes = result.rows.map(r => r.indexname);
      
      expect(indexes).toContain('idx_workspace_members_user_id');
      expect(indexes.some(idx => idx.includes('workspace_members_pkey'))).toBe(true);
    });

    test('TC-15: should create all required indexes on pages table', async () => {
      const result = await client.query(`
        SELECT indexname FROM pg_indexes WHERE tablename = 'pages'
      `);
      
      const indexes = result.rows.map(r => r.indexname);
      
      expect(indexes).toContain('idx_pages_workspace_id');
      expect(indexes).toContain('idx_pages_parent_id');
      expect(indexes).toContain('idx_pages_created_by');
      expect(indexes.some(idx => idx.includes('pages_pkey'))).toBe(true);
    });

    test('TC-16: should create all required indexes on blocks table', async () => {
      const result = await client.query(`
        SELECT indexname FROM pg_indexes WHERE tablename = 'blocks'
      `);
      
      const indexes = result.rows.map(r => r.indexname);
      
      expect(indexes).toContain('idx_blocks_page_id');
      expect(indexes).toContain('idx_blocks_parent_id');
      expect(indexes).toContain('idx_blocks_position');
      expect(indexes.some(idx => idx.includes('blocks_pkey'))).toBe(true);
    });
  });

  describe('AC-4: Migrations are idempotent', () => {
    test('TC-17: migrations should be idempotent on multiple runs', async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('003_create_workspace_members.sql');
      await runMigration('004_create_pages.sql');
      await runMigration('005_create_blocks.sql');

      let error = null;
      try {
        await runMigration('001_create_users.sql');
        await runMigration('002_create_workspaces.sql');
        await runMigration('003_create_workspace_members.sql');
        await runMigration('004_create_pages.sql');
        await runMigration('005_create_blocks.sql');
      } catch (e) {
        error = e;
      }

      expect(error).toBeNull();

      const result = await client.query(`
        SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name IN ('users', 'workspaces', 'workspace_members', 'pages', 'blocks')
      `);
      expect(parseInt(result.rows[0].count)).toBe(5);
    });
  });

  describe('Edge Cases', () => {
    beforeAll(async () => {
      await runMigration('001_create_users.sql');
      await runMigration('002_create_workspaces.sql');
      await runMigration('003_create_workspace_members.sql');
      await runMigration('004_create_pages.sql');
      await runMigration('005_create_blocks.sql');
    });

    test('EC-1: should reject duplicate emails in users table', async () => {
      await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
        ['unique@example.com', 'hash123', 'Test']
      );

      await expect(
        client.query(
          "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)",
          ['unique@example.com', 'hash456', 'Test 2']
        )
      ).rejects.toThrow(/unique|duplicate/i);
    });

    test('EC-2: should reject duplicate workspace member pairs', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['member1@example.com', 'hash123', 'Member 1']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Workspace', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      await client.query(
        "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
        [workspaceId, userId, 'owner']
      );

      await expect(
        client.query(
          "INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, $3)",
          [workspaceId, userId, 'member']
        )
      ).rejects.toThrow(/unique|duplicate/i);
    });

    test('EC-3: should use Untitled as default page title', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['pager@example.com', 'hash123', 'Page User']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Page Workspace', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const pageResult = await client.query(
        "INSERT INTO pages (workspace_id, created_by) VALUES ($1, $2) RETURNING title",
        [workspaceId, userId]
      );

      expect(pageResult.rows[0].title).toBe('Untitled');
    });

    test('EC-4: should use member as default workspace role', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['role@example.com', 'hash123', 'Role User']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Role Workspace', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const memberResult = await client.query(
        "INSERT INTO workspace_members (workspace_id, user_id) VALUES ($1, $2) RETURNING role",
        [workspaceId, userId]
      );

      expect(memberResult.rows[0].role).toBe('member');
    });

    test('EC-5: should auto-generate UUID for primary keys', async () => {
      const result = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['uuid@example.com', 'hash123', 'UUID User']
      );

      expect(result.rows[0].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    test('EC-6: should auto-set timestamps on insert', async () => {
      const result = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING created_at, updated_at",
        ['time@example.com', 'hash123', 'Time User']
      );

      const { created_at, updated_at } = result.rows[0];
      expect(new Date(created_at)).toBeInstanceOf(Date);
      expect(new Date(updated_at)).toBeInstanceOf(Date);
      expect(new Date(created_at).getTime()).toBeGreaterThan(Date.now() - 5000);
    });

    test('EC-7: should order blocks by position within page', async () => {
      const userResult = await client.query(
        "INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id",
        ['blockorder@example.com', 'hash123', 'Block Order User']
      );
      const userId = userResult.rows[0].id;
      
      const workspaceResult = await client.query(
        "INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING id",
        ['Block Workspace', 'Description', userId]
      );
      const workspaceId = workspaceResult.rows[0].id;
      
      const pageResult = await client.query(
        "INSERT INTO pages (title, workspace_id, created_by) VALUES ($1, $2, $3) RETURNING id",
        ['Block Page', workspaceId, userId]
      );
      const pageId = pageResult.rows[0].id;
      
      await client.query(
        "INSERT INTO blocks (page_id, type, content, position) VALUES ($1, $2, $3, $4)",
        [pageId, 'paragraph', '{"text": "third"}', 2]
      );
      await client.query(
        "INSERT INTO blocks (page_id, type, content, position) VALUES ($1, $2, $3, $4)",
        [pageId, 'paragraph', '{"text": "first"}', 0]
      );
      await client.query(
        "INSERT INTO blocks (page_id, type, content, position) VALUES ($1, $2, $3, $4)",
        [pageId, 'paragraph', '{"text": "second"}', 1]
      );

      const result = await client.query(
        "SELECT content, position FROM blocks WHERE page_id = $1 ORDER BY position ASC",
        [pageId]
      );

      expect(result.rows[0].position).toBe(0);
      expect(result.rows[1].position).toBe(1);
      expect(result.rows[2].position).toBe(2);
      expect(result.rows[0].content.text).toBe('first');
      expect(result.rows[1].content.text).toBe('second');
      expect(result.rows[2].content.text).toBe('third');
    });
  });
});
