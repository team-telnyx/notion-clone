"""
Tests for migration 002_workspaces.sql
Tests that workspaces table is created with proper schema.
"""
import os
import pytest


class TestWorkspacesMigration:
    """Test suite for 002_workspaces.sql migration."""
    
    MIGRATION_FILE = '002_workspaces.sql'
    
    def test_migration_file_exists(self, migrations_dir):
        """
        AC-1: Core entities defined - Workspaces
        TC-12: Verify migration file exists
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        assert os.path.exists(filepath), f"Migration file {self.MIGRATION_FILE} does not exist"
    
    def test_workspaces_table_exists(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Workspaces
        TC-12: Verify workspaces table is created
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'workspaces'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "workspaces table should exist"
    
    def test_workspaces_columns(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Workspaces
        TC-12b: Verify required columns exist
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        required_columns = ['id', 'name', 'slug', 'icon', 'version', 'created_at', 'updated_at', 'deleted_at']
        
        db_cursor.execute("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'workspaces'
        """)
        columns = [row['column_name'] for row in db_cursor.fetchall()]
        
        for col in required_columns:
            assert col in columns, f"Column {col} should exist in workspaces"
    
    def test_workspaces_slug_unique(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Workspaces
        TC-13: Verify slug has unique constraint
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("INSERT INTO workspaces (name, slug) VALUES ('Test', 'test-slug')")
        
        with pytest.raises(Exception):
            db_cursor.execute("INSERT INTO workspaces (name, slug) VALUES ('Test 2', 'test-slug')")
    
    def test_workspaces_slug_index(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Workspaces
        TC-13b: Verify slug index exists
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'workspaces' AND indexname = 'idx_workspaces_slug'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "idx_workspaces_slug index should exist"
