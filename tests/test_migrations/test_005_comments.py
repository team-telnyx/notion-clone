"""
Tests for migration 005_comments.sql
Tests that comments table with resolution tracking is created.
"""
import os
import pytest


class TestCommentsMigration:
    """Test suite for 005_comments.sql migration."""
    
    MIGRATION_FILE = '005_comments.sql'
    
    def test_migration_file_exists(self, migrations_dir):
        """
        AC-1: Core entities defined - Comments
        TC-23: Verify migration file exists
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        assert os.path.exists(filepath), f"Migration file {self.MIGRATION_FILE} does not exist"
    
    def test_comments_table_exists(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Comments
        TC-23: Verify comments table is created
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'comments'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "comments table should exist"
    
    def test_comments_resolved_field(self, db_cursor, run_migration):
        """
        AC-3: Block-level comments with resolution tracking
        TC-24: Verify resolved boolean field exists
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT data_type, column_default, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'comments' AND column_name = 'resolved'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "resolved column should exist"
        assert result['is_nullable'] == 'NO', "resolved should be NOT NULL"
        assert result['column_default'] == 'false', "resolved should default to false"
    
    def test_comments_resolved_index(self, db_cursor, run_migration):
        """
        AC-3: Block-level comments with resolution tracking
        TC-24b: Verify resolved index for filtering
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'comments' AND indexname = 'idx_comments_resolved'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "idx_comments_resolved index should exist"
    
    def test_comments_foreign_keys(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Comments
        TC-25: Verify foreign key relationships
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT kcu.column_name, ccu.table_name AS foreign_table
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'comments' AND tc.constraint_type = 'FOREIGN KEY'
        """)
        fks = {row['column_name']: row['foreign_table'] for row in db_cursor.fetchall()}
        
        assert 'block_id' in fks, "block_id should have foreign key"
        assert 'user_id' in fks, "user_id should have foreign key"
    
    def test_comments_block_id_index(self, db_cursor, run_migration):
        """
        AC-3: Block-level comments
        TC-25b: Verify index on block_id for lookups
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'comments' AND indexname = 'idx_comments_block_id'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "idx_comments_block_id index should exist"
    
    def test_comments_required_fields(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Comments
        EC-5: Verify required fields are NOT NULL
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration('003_space_members.sql')
        run_migration('004_blocks.sql')
        run_migration(self.MIGRATION_FILE)
        
        required_fields = ['block_id', 'user_id', 'content']
        
        for field in required_fields:
            db_cursor.execute(f"""
                SELECT is_nullable FROM information_schema.columns
                WHERE table_name = 'comments' AND column_name = '{field}'
            """)
            result = db_cursor.fetchone()
            assert result is not None, f"{field} should exist"
            assert result['is_nullable'] == 'NO', f"{field} should be NOT NULL"
