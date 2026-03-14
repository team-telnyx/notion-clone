"""
Integration tests for running all migrations in sequence.
Tests the complete database schema.
"""
import os
import pytest


class TestFullMigration:
    """Integration tests for complete migration sequence."""
    
    MIGRATIONS = [
        '000_extensions.sql',
        '001_users.sql',
        '002_workspaces.sql',
        '003_space_members.sql',
        '004_blocks.sql',
        '005_comments.sql',
    ]
    
    def test_all_migrations_run_in_sequence(self, db_cursor, migrations_dir):
        """
        AC-7: Sequential migration files created
        TC-26: Verify all migrations run without errors
        """
        for migration in self.MIGRATIONS:
            filepath = os.path.join(migrations_dir, migration)
            with open(filepath, 'r') as f:
                sql = f.read()
            db_cursor.execute(sql)
        
        # Verify all tables exist
        expected_tables = ['users', 'workspaces', 'space_members', 'blocks', 'comments']
        for table in expected_tables:
            db_cursor.execute(f"""
                SELECT 1 FROM information_schema.tables WHERE table_name = '{table}'
            """)
            result = db_cursor.fetchone()
            assert result is not None, f"Table {table} should exist after running all migrations"
    
    def test_entity_relationships(self, db_cursor, migrations_dir):
        """
        AC-1: Core entities defined
        TC-27: Verify entity relationships work correctly
        """
        # Run all migrations
        for migration in self.MIGRATIONS:
            filepath = os.path.join(migrations_dir, migration)
            with open(filepath, 'r') as f:
                sql = f.read()
            db_cursor.execute(sql)
        
        # Create test data following relationships:
        # users ─┬─< space_members >─ workspaces
        #        │                         │
        #        └─────< blocks >──────────┘
        #                  │
        #                  └──< comments
        
        # 1. Create user
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('test@example.com', 'hashed_password')
            RETURNING id
        """)
        user_id = db_cursor.fetchone()['id']
        
        # 2. Create workspace
        db_cursor.execute("""
            INSERT INTO workspaces (name, slug)
            VALUES ('Test Workspace', 'test-workspace')
            RETURNING id
        """)
        workspace_id = db_cursor.fetchone()['id']
        
        # 3. Create space member relationship
        db_cursor.execute("""
            INSERT INTO space_members (user_id, workspace_id, role)
            VALUES (%s, %s, 'OWNER')
        """, (user_id, workspace_id))
        
        # 4. Create a page block
        db_cursor.execute("""
            INSERT INTO blocks (type, workspace_id, author_id, position, content)
            VALUES ('PAGE', %s, %s, 0, '{"title": "Home"}')
            RETURNING id
        """, (workspace_id, user_id))
        page_id = db_cursor.fetchone()['id']
        
        # 5. Create nested block
        db_cursor.execute("""
            INSERT INTO blocks (type, parent_id, author_id, position, content)
            VALUES ('TEXT', %s, %s, 0, '{"text": "Hello world"}')
            RETURNING id
        """, (page_id, user_id))
        block_id = db_cursor.fetchone()['id']
        
        # 6. Create comment on block
        db_cursor.execute("""
            INSERT INTO comments (block_id, user_id, content)
            VALUES (%s, %s, 'This looks great!')
        """, (block_id, user_id))
        
        # Verify all relationships work
        db_cursor.execute("SELECT COUNT(*) as count FROM space_members WHERE user_id = %s", (user_id,))
        assert db_cursor.fetchone()['count'] == 1, "User should have space membership"
        
        db_cursor.execute("SELECT COUNT(*) as count FROM blocks WHERE author_id = %s", (user_id,))
        assert db_cursor.fetchone()['count'] == 2, "User should have authored 2 blocks"
        
        db_cursor.execute("SELECT COUNT(*) as count FROM comments WHERE block_id = %s", (block_id,))
        assert db_cursor.fetchone()['count'] == 1, "Block should have 1 comment"
    
    def test_cascade_deletes(self, db_cursor, migrations_dir):
        """
        AC-1: Core entities defined
        EC-6: Verify cascade deletes work correctly
        """
        # Run all migrations
        for migration in self.MIGRATIONS:
            filepath = os.path.join(migrations_dir, migration)
            with open(filepath, 'r') as f:
                sql = f.read()
            db_cursor.execute(sql)
        
        # Create test data
        db_cursor.execute("INSERT INTO users (email, password_hash) VALUES ('cascade@test.com', 'hash') RETURNING id")
        user_id = db_cursor.fetchone()['id']
        
        db_cursor.execute("INSERT INTO workspaces (name, slug) VALUES ('Cascade Test', 'cascade-test') RETURNING id")
        workspace_id = db_cursor.fetchone()['id']
        
        db_cursor.execute("INSERT INTO space_members (user_id, workspace_id) VALUES (%s, %s)", (user_id, workspace_id))
        
        db_cursor.execute("INSERT INTO blocks (type, workspace_id, author_id, position, content) VALUES ('PAGE', %s, %s, 0, '{}') RETURNING id", (workspace_id, user_id))
        block_id = db_cursor.fetchone()['id']
        
        db_cursor.execute("INSERT INTO comments (block_id, user_id, content) VALUES (%s, %s, 'test')", (block_id, user_id))
        
        # Delete user and verify cascade
        db_cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        
        db_cursor.execute("SELECT COUNT(*) as count FROM space_members WHERE user_id = %s", (user_id,))
        assert db_cursor.fetchone()['count'] == 0, "Space members should be cascade deleted"
        
        db_cursor.execute("SELECT COUNT(*) as count FROM comments WHERE user_id = %s", (user_id,))
        assert db_cursor.fetchone()['count'] == 0, "Comments should be cascade deleted"
    
    def test_soft_delete_behavior(self, db_cursor, migrations_dir):
        """
        AC-4: Soft delete support
        TC-28: Verify soft delete works with partial indexes
        """
        # Run all migrations
        for migration in self.MIGRATIONS:
            filepath = os.path.join(migrations_dir, migration)
            with open(filepath, 'r') as f:
                sql = f.read()
            db_cursor.execute(sql)
        
        # Create and soft delete user
        db_cursor.execute("INSERT INTO users (email, password_hash) VALUES ('soft@test.com', 'hash') RETURNING id")
        user_id = db_cursor.fetchone()['id']
        
        db_cursor.execute("UPDATE users SET deleted_at = NOW() WHERE id = %s", (user_id,))
        
        # Verify user still exists in table
        db_cursor.execute("SELECT deleted_at FROM users WHERE id = %s", (user_id,))
        result = db_cursor.fetchone()
        assert result['deleted_at'] is not None, "deleted_at should be set"
    
    def test_workspace_slug_uniqueness(self, db_cursor, migrations_dir):
        """
        AC-1: Core entities defined - Workspaces
        EC-7: Verify workspace slug uniqueness across entire table (including soft deleted)
        """
        # Run all migrations
        for migration in self.MIGRATIONS:
            filepath = os.path.join(migrations_dir, migration)
            with open(filepath, 'r') as f:
                sql = f.read()
            db_cursor.execute(sql)
        
        db_cursor.execute("INSERT INTO workspaces (name, slug) VALUES ('Test 1', 'unique-slug')")
        db_cursor.execute("UPDATE workspaces SET deleted_at = NOW() WHERE slug = 'unique-slug'")
        
        # Should still fail due to unique constraint
        with pytest.raises(Exception):
            db_cursor.execute("INSERT INTO workspaces (name, slug) VALUES ('Test 2', 'unique-slug')")
