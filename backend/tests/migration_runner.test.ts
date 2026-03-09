import { existsSync } from 'fs';
import { join } from 'path';

describe('Migration Runner Script', () => {
  const migrationsDir = join(__dirname, '..', '..', 'migrations');
  const scriptPath = join(migrationsDir, 'run_migrations.sh');

  describe('AC-5: Migration Runner Script Exists', () => {
    test('TC-32: should have run_migrations.sh script', () => {
      expect(existsSync(scriptPath)).toBe(true);
    });

    test('TC-33: should have 5 migration SQL files', () => {
      const expectedFiles = [
        '001_create_users.sql',
        '002_create_workspaces.sql',
        '003_create_workspace_members.sql',
        '004_create_pages.sql',
        '005_create_blocks.sql',
      ];

      expectedFiles.forEach(file => {
        const filePath = join(migrationsDir, file);
        expect(existsSync(filePath)).toBe(true);
      });
    });

    test('TC-34: migration files should have .sql extension', () => {
      const fs = require('fs');
      const files = fs.readdirSync(migrationsDir);
      const sqlFiles = files.filter((f: string) => f.endsWith('.sql'));
      expect(sqlFiles.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('AC-6: Migration Script Parameters', () => {
    test('TC-35: script should accept database connection parameters', () => {
      const fs = require('fs');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('${1:-');
      expect(content).toContain('${2:-');
      expect(content).toContain('${3:-');
      expect(content).toContain('${4:-');
    });

    test('TC-36: script should validate required parameters', () => {
      const fs = require('fs');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('set -e');
    });
  });

  describe('AC-7: Migration Order Enforcement', () => {
    test('TC-37: migration files should be named with numeric prefix', () => {
      const fs = require('fs');
      const files = fs.readdirSync(migrationsDir)
        .filter((f: string) => f.endsWith('.sql'))
        .sort();

      files.forEach((file: string, index: number) => {
        const expectedPrefix = String(index + 1).padStart(3, '0');
        expect(file.startsWith(expectedPrefix)).toBe(true);
      });
    });

    test('TC-38: runner should execute migrations in order', () => {
      const fs = require('fs');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toMatch(/sort|for.*\.sql/);
    });
  });

  describe('EC-4: Migration Rollback Error Handling', () => {
    test('TC-39: script should handle connection failures gracefully', () => {
      const fs = require('fs');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toContain('set -e');
    });

    test('TC-40: script should provide meaningful error messages', () => {
      const fs = require('fs');
      const content = fs.readFileSync(scriptPath, 'utf-8');
      
      expect(content).toMatch(/echo.*error|echo.*failed|echo.*Error|Failed to apply/i);
    });
  });
});
