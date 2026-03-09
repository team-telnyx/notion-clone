import { db, testConnection, closeConnection } from '../src/db/knex';
import * as fs from 'fs';
import * as path from 'path';

describe('Database Migrations', () => {
  beforeAll(async () => {
    const isConnected = await testConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Ensure PostgreSQL is running and accessible.');
    }
  });

  afterAll(async () => {
    await closeConnection();
  });

  // AC-1: All 5 tables created with exact columns
  describe('AC-1: Table Creation and Schema', () => {
    test('should_have_all_five_tables_created', async () => {
      const tables = await db('information_schema.tables')
        .select('table_name')
        .where('table_schema', 'public');
      
      const tableNames = tables.map(t => t.table_name);
      
      expect(tableNames).toContain('users');
      expect(tableNames).toContain('workspaces');
      expect(tableNames).toContain('workspace_members');
      expect(tableNames).toContain('pages');
      expect(tableNames).toContain('blocks');
    });

    test('should_have_users_table_with_correct_columns', async () => {
      const columns = await db('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable', 'column_default')
        .where({ table_schema: 'public', table_name: 'users' });

      const columnMap = new Map(columns.map(c => [c.column_name, c]));

      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('email')).toBe(true);
      expect(columnMap.has('password_hash')).toBe(true);
      expect(columnMap.has('name')).toBe(true);
      expect(columnMap.has('avatar_url')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);
      expect(columnMap.has('updated_at')).toBe(true);

      const emailCol = columnMap.get('email');
      expect(emailCol?.data_type).toBe('character varying');
      expect(emailCol?.is_nullable).toBe('NO');

      const idCol = columnMap.get('id');
      expect(idCol?.data_type).toBe('uuid');
      expect(idCol?.column_default).toContain('gen_random_uuid');
    });

    test('should_have_workspaces_table_with_correct_columns', async () => {
      const columns = await db('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable')
        .where({ table_schema: 'public', table_name: 'workspaces' });

      const columnMap = new Map(columns.map(c => [c.column_name, c]));

      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('name')).toBe(true);
      expect(columnMap.has('description')).toBe(true);
      expect(columnMap.has('owner_id')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);
      expect(columnMap.has('updated_at')).toBe(true);

      const nameCol = columnMap.get('name');
      expect(nameCol?.is_nullable).toBe('NO');

      const ownerIdCol = columnMap.get('owner_id');
      expect(ownerIdCol?.is_nullable).toBe('NO');
    });

    test('should_have_workspace_members_table_with_correct_columns', async () => {
      const columns = await db('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable', 'column_default')
        .where({ table_schema: 'public', table_name: 'workspace_members' });

      const columnMap = new Map(columns.map(c => [c.column_name, c]));

      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('workspace_id')).toBe(true);
      expect(columnMap.has('user_id')).toBe(true);
      expect(columnMap.has('role')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);

      const roleCol = columnMap.get('role');
      expect(roleCol?.is_nullable).toBe('NO');
      expect(roleCol?.column_default).toBe("'member'::character varying");
    });

    test('should_have_pages_table_with_correct_columns', async () => {
      const columns = await db('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable', 'column_default')
        .where({ table_schema: 'public', table_name: 'pages' });

      const columnMap = new Map(columns.map(c => [c.column_name, c]));

      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('title')).toBe(true);
      expect(columnMap.has('content')).toBe(true);
      expect(columnMap.has('workspace_id')).toBe(true);
      expect(columnMap.has('parent_id')).toBe(true);
      expect(columnMap.has('created_by')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);
      expect(columnMap.has('updated_at')).toBe(true);

      const titleCol = columnMap.get('title');
      expect(titleCol?.is_nullable).toBe('NO');
      expect(titleCol?.column_default).toBe("'Untitled'::character varying");

      const contentCol = columnMap.get('content');
      expect(contentCol?.data_type).toBe('jsonb');

      const parentIdCol = columnMap.get('parent_id');
      expect(parentIdCol?.is_nullable).toBe('YES');
    });

    test('should_have_blocks_table_with_correct_columns', async () => {
      const columns = await db('information_schema.columns')
        .select('column_name', 'data_type', 'is_nullable', 'column_default')
        .where({ table_schema: 'public', table_name: 'blocks' });

      const columnMap = new Map(columns.map(c => [c.column_name, c]));

      expect(columnMap.has('id')).toBe(true);
      expect(columnMap.has('page_id')).toBe(true);
      expect(columnMap.has('parent_id')).toBe(true);
      expect(columnMap.has('type')).toBe(true);
      expect(columnMap.has('content')).toBe(true);
      expect(columnMap.has('position')).toBe(true);
      expect(columnMap.has('created_at')).toBe(true);
      expect(columnMap.has('updated_at')).toBe(true);

      const typeCol = columnMap.get('type');
      expect(typeCol?.is_nullable).toBe('NO');

      const positionCol = columnMap.get('position');
      expect(positionCol?.is_nullable).toBe('NO');
      expect(positionCol?.column_default).toBe('0');
    });
  });

  // AC-2: Foreign keys cascade properly
  describe('AC-2: Foreign Key Constraints and Cascade Behavior', () => {
    test('should_have_foreign_key_from_workspaces_to_users_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'workspaces'
          AND tc.constraint_type = 'FOREIGN KEY'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      const ownerFk = constraints.rows.find(
        (c: { constraint_name: string }) => c.constraint_name.toLowerCase().includes('owner_id')
      );
      expect(ownerFk).toBeDefined();
      expect(ownerFk?.delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_workspace_members_to_workspaces_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'workspace_members'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%workspace_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_workspace_members_to_users_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'workspace_members'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%user_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_pages_to_workspaces_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'pages'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%workspace_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_pages_to_pages_parent_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'pages'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%parent_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_pages_to_users_created_by', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'pages'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%created_by%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
    });

    test('should_have_foreign_key_from_blocks_to_pages_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'blocks'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%page_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_foreign_key_from_blocks_to_blocks_parent_with_cascade_delete', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name, rc.delete_rule
        FROM information_schema.table_constraints tc
        JOIN information_schema.referential_constraints rc 
          ON tc.constraint_name = rc.constraint_name
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'blocks'
          AND tc.constraint_type = 'FOREIGN KEY'
          AND tc.constraint_name LIKE '%parent_id%'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
      expect(constraints.rows[0].delete_rule).toBe('CASCADE');
    });

    test('should_have_unique_constraint_on_workspace_members', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'workspace_members'
          AND tc.constraint_type = 'UNIQUE'
      `);

      expect(constraints.rows.length).toBeGreaterThan(0);
    });

    test('should_have_unique_constraint_on_users_email', async () => {
      const constraints = await db.raw(`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        WHERE tc.table_schema = 'public'
          AND tc.table_name = 'users'
          AND tc.constraint_type = 'UNIQUE'
      `);

      const uniqueConstraint = constraints.rows.find(
        (c: { constraint_name: string }) => c.constraint_name.toLowerCase().includes('email')
      );
      expect(uniqueConstraint).toBeDefined();
    });
  });

  // AC-3: All indexes created
  describe('AC-3: Index Creation', () => {
    test('should_have_all_required_indexes_on_users_table', async () => {
      const indexes = await db.raw(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'users'
      `);

      const usersEmailIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_users_email'
      );
      expect(usersEmailIndex).toBeDefined();
      expect(usersEmailIndex?.indexdef).toContain('email');
    });

    test('should_have_all_required_indexes_on_workspaces_table', async () => {
      const indexes = await db.raw(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'workspaces'
      `);

      const workspacesOwnerIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_workspaces_owner_id'
      );
      expect(workspacesOwnerIndex).toBeDefined();
      expect(workspacesOwnerIndex?.indexdef).toContain('owner_id');
    });

    test('should_have_all_required_indexes_on_workspace_members_table', async () => {
      const indexes = await db.raw(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'workspace_members'
      `);

      const userIdIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_workspace_members_user_id'
      );
      expect(userIdIndex).toBeDefined();
      expect(userIdIndex?.indexdef).toContain('user_id');
    });

    test('should_have_all_required_indexes_on_pages_table', async () => {
      const indexes = await db.raw(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'pages'
      `);

      const workspaceIdIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_pages_workspace_id'
      );
      expect(workspaceIdIndex).toBeDefined();

      const parentIdIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_pages_parent_id'
      );
      expect(parentIdIndex).toBeDefined();

      const createdByIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_pages_created_by'
      );
      expect(createdByIndex).toBeDefined();
    });

    test('should_have_all_required_indexes_on_blocks_table', async () => {
      const indexes = await db.raw(`
        SELECT indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'blocks'
      `);

      const pageIdIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_blocks_page_id'
      );
      expect(pageIdIndex).toBeDefined();

      const parentIdIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_blocks_parent_id'
      );
      expect(parentIdIndex).toBeDefined();

      const positionIndex = indexes.rows.find((idx: { indexname: string }) => 
        idx.indexname === 'idx_blocks_position'
      );
      expect(positionIndex).toBeDefined();
      expect(positionIndex?.indexdef).toContain('page_id');
      expect(positionIndex?.indexdef).toContain('position');
    });
  });

  // AC-4: Migrations are idempotent
  describe('AC-4: Migration Idempotency', () => {
    test('should_be_idempotent_running_migrations_twice_should_not_fail', async () => {
      const migrationsDir = path.join(__dirname, '../../migrations');
      const migrationFiles = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

      expect(migrationFiles.length).toBeGreaterThan(0);

      // Run migrations again - should not throw
      for (const file of migrationFiles) {
        const migrationPath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(migrationPath, 'utf-8');
        
        await expect(db.raw(sql)).resolves.not.toThrow();
      }
    });

    test('should_be_idempotent_tables_should_not_be_duplicated', async () => {
      const tables = await db('information_schema.tables')
        .where('table_schema', 'public')
        .select('table_name');

      const usersCount = tables.filter((t: { table_name: string }) => t.table_name === 'users').length;
      const workspacesCount = tables.filter((t: { table_name: string }) => t.table_name === 'workspaces').length;
      const membersCount = tables.filter((t: { table_name: string }) => t.table_name === 'workspace_members').length;
      const pagesCount = tables.filter((t: { table_name: string }) => t.table_name === 'pages').length;
      const blocksCount = tables.filter((t: { table_name: string }) => t.table_name === 'blocks').length;

      expect(usersCount).toBe(1);
      expect(workspacesCount).toBe(1);
      expect(membersCount).toBe(1);
      expect(pagesCount).toBe(1);
      expect(blocksCount).toBe(1);
    });
  });
});
