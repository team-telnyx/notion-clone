import * as fs from 'fs';
import * as path from 'path';

describe('Database Migration Files', () => {
  const migrationsDir = path.join(__dirname, '../../migrations');

  const expectedMigrations = [
    '001_create_users.sql',
    '002_create_workspaces.sql',
    '003_create_workspace_members.sql',
    '004_create_pages.sql',
    '005_create_blocks.sql'
  ];

  describe('Migration File Existence (AC-1)', () => {
    test('should have migrations directory', () => {
      expect(fs.existsSync(migrationsDir)).toBe(true);
    });

    test('should have all 5 migration files', () => {
      expectedMigrations.forEach(file => {
        const filePath = path.join(migrationsDir, file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    test('should have run_migrations.sh script', () => {
      const scriptPath = path.join(migrationsDir, 'run_migrations.sh');
      expect(fs.existsSync(scriptPath)).toBe(true);
    });
  });

  describe('Users Migration (001_create_users.sql)', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '001_create_users.sql'), 'utf-8');

    test('should create users table with IF NOT EXISTS', () => {
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS users');
    });

    test('should have required columns', () => {
      expect(sql).toContain('id UUID PRIMARY KEY DEFAULT gen_random_uuid()');
      expect(sql).toContain('email VARCHAR(255) UNIQUE NOT NULL');
      expect(sql).toContain('password_hash VARCHAR(255) NOT NULL');
      expect(sql).toContain('name VARCHAR(255)');
      expect(sql).toContain('avatar_url TEXT');
      expect(sql).toContain('created_at TIMESTAMP DEFAULT NOW()');
      expect(sql).toContain('updated_at TIMESTAMP DEFAULT NOW()');
    });

    test('should create email index', () => {
      expect(sql).toContain('CREATE INDEX');
      expect(sql).toContain('idx_users_email ON users(email)');
    });
  });

  describe('Workspaces Migration (002_create_workspaces.sql)', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '002_create_workspaces.sql'), 'utf-8');

    test('should create workspaces table', () => {
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS workspaces');
    });

    test('should have foreign key to users with CASCADE', () => {
      expect(sql).toContain('owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE');
    });

    test('should create owner_id index', () => {
      expect(sql).toContain('idx_workspaces_owner_id ON workspaces(owner_id)');
    });
  });

  describe('Workspace Members Migration (003_create_workspace_members.sql)', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '003_create_workspace_members.sql'), 'utf-8');

    test('should create workspace_members table', () => {
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS workspace_members');
    });

    test('should have foreign keys with CASCADE', () => {
      expect(sql).toContain('workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE');
      expect(sql).toContain('user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE');
    });

    test('should have role default to member', () => {
      expect(sql).toContain("role VARCHAR(50) NOT NULL DEFAULT 'member'");
    });

    test('should have unique constraint on workspace_id and user_id', () => {
      expect(sql).toContain('UNIQUE(workspace_id, user_id)');
    });

    test('should create user_id index', () => {
      expect(sql).toContain('idx_workspace_members_user_id ON workspace_members(user_id)');
    });
  });

  describe('Pages Migration (004_create_pages.sql)', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '004_create_pages.sql'), 'utf-8');

    test('should create pages table', () => {
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS pages');
    });

    test('should have title default to Untitled', () => {
      expect(sql).toContain("title VARCHAR(255) NOT NULL DEFAULT 'Untitled'");
    });

    test('should have content as JSONB', () => {
      expect(sql).toContain("content JSONB DEFAULT '{}'::jsonb");
    });

    test('should have self-referencing parent_id with CASCADE', () => {
      expect(sql).toContain('parent_id UUID REFERENCES pages(id) ON DELETE CASCADE');
    });

    test('should have workspace_id FK with CASCADE', () => {
      expect(sql).toContain('workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE');
    });

    test('should create all required indexes', () => {
      expect(sql).toContain('idx_pages_workspace_id ON pages(workspace_id)');
      expect(sql).toContain('idx_pages_parent_id ON pages(parent_id)');
      expect(sql).toContain('idx_pages_created_by ON pages(created_by)');
    });
  });

  describe('Blocks Migration (005_create_blocks.sql)', () => {
    const sql = fs.readFileSync(path.join(migrationsDir, '005_create_blocks.sql'), 'utf-8');

    test('should create blocks table', () => {
      expect(sql).toContain('CREATE TABLE IF NOT EXISTS blocks');
    });

    test('should have page_id FK with CASCADE', () => {
      expect(sql).toContain('page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE');
    });

    test('should have self-referencing parent_id with CASCADE', () => {
      expect(sql).toContain('parent_id UUID REFERENCES blocks(id) ON DELETE CASCADE');
    });

    test('should have type and position columns', () => {
      expect(sql).toContain('type VARCHAR(50) NOT NULL');
      expect(sql).toContain('position INTEGER NOT NULL DEFAULT 0');
    });

    test('should have content as JSONB', () => {
      expect(sql).toContain("content JSONB DEFAULT '{}'::jsonb");
    });

    test('should create all required indexes', () => {
      expect(sql).toContain('idx_blocks_page_id ON blocks(page_id)');
      expect(sql).toContain('idx_blocks_parent_id ON blocks(parent_id)');
      expect(sql).toContain('idx_blocks_position ON blocks(page_id, position)');
    });
  });

  describe('Idempotency (AC-4)', () => {
    test('all CREATE TABLE statements should use IF NOT EXISTS', () => {
      expectedMigrations.forEach(file => {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        if (sql.includes('CREATE TABLE')) {
          expect(sql).toContain('CREATE TABLE IF NOT EXISTS');
        }
      });
    });

    test('all CREATE INDEX statements should use IF NOT EXISTS', () => {
      expectedMigrations.forEach(file => {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
        if (sql.includes('CREATE INDEX')) {
          expect(sql).toContain('CREATE INDEX IF NOT EXISTS');
        }
      });
    });
  });
});
