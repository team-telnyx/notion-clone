"""
Tests for migration 000_extensions.sql
Tests that required PostgreSQL extensions are properly enabled.
"""
import os
import pytest


class TestExtensionsMigration:
    """Test suite for 000_extensions.sql migration."""
    
    MIGRATION_FILE = '000_extensions.sql'
    
    def test_migration_file_exists(self, migrations_dir):
        """
        AC-6: Database extensions enabled
        TC-1: Verify migration file exists at correct path
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        assert os.path.exists(filepath), f"Migration file {self.MIGRATION_FILE} does not exist"
    
    def test_migration_sql_syntax_valid(self, migrations_dir):
        """
        AC-6: Database extensions enabled
        TC-1b: Verify SQL syntax is valid
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        with open(filepath, 'r') as f:
            content = f.read()
        
        assert 'CREATE EXTENSION' in content, "Migration should contain CREATE EXTENSION statements"
        assert 'uuid-ossp' in content, "Migration should enable uuid-ossp extension"
        assert 'pg_trgm' in content, "Migration should enable pg_trgm extension"
        assert 'ltree' in content, "Migration should enable ltree extension"
    
    def test_uuid_ossp_extension_created(self, db_cursor, run_migration):
        """
        AC-6: Database extensions enabled
        TC-2: Verify uuid-ossp extension is enabled
        """
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "uuid-ossp extension should be enabled"
    
    def test_pg_trgm_extension_created(self, db_cursor, run_migration):
        """
        AC-6: Database extensions enabled
        TC-3: Verify pg_trgm extension is enabled
        """
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_extension WHERE extname = 'pg_trgm'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "pg_trgm extension should be enabled"
    
    def test_ltree_extension_created(self, db_cursor, run_migration):
        """
        AC-6: Database extensions enabled
        TC-4: Verify ltree extension is enabled
        """
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_extension WHERE extname = 'ltree'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "ltree extension should be enabled"
    
    def test_extension_idempotent(self, db_cursor, run_migration):
        """
        AC-6: Database extensions enabled
        EC-1: Migration should be idempotent and not fail on re-run
        """
        # Run migration twice
        run_migration(self.MIGRATION_FILE)
        run_migration(self.MIGRATION_FILE)
        
        # Verify all extensions still exist
        db_cursor.execute("""
            SELECT extname FROM pg_extension WHERE extname IN ('uuid-ossp', 'pg_trgm', 'ltree')
        """)
        results = [row['extname'] for row in db_cursor.fetchall()]
        assert 'uuid-ossp' in results
        assert 'pg_trgm' in results
        assert 'ltree' in results
