"""
Tests for migration 003_space_members.sql
Tests that space_members junction table and role enum are created.
"""
import os
import pytest


class TestSpaceMembersMigration:
    """Test suite for 003_space_members.sql migration."""
    
    MIGRATION_FILE = '003_space_members.sql'
    
    def test_migration_file_exists(self, migrations_dir):
        """
        AC-1: Core entities defined - SpaceMembers
        TC-14: Verify migration file exists
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        assert os.path.exists(filepath), f"Migration file {self.MIGRATION_FILE} does not exist"
    
    def test_space_member_role_enum_exists(self, db_cursor, run_migration):
        """
        AC-5: Workspace permission structure with roles
        TC-15: Verify space_member_role enum is created
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_type WHERE typname = 'space_member_role'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "space_member_role enum should exist"
    
    def test_space_member_role_values(self, db_cursor, run_migration):
        """
        AC-5: Workspace permission structure with roles
        TC-15: Verify all role values exist
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT enumlabel FROM pg_enum WHERE enumtypid = 'space_member_role'::regtype
        """)
        values = [row['enumlabel'] for row in db_cursor.fetchall()]
        
        expected_roles = ['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']
        for role in expected_roles:
            assert role in values, f"Role {role} should exist in enum"
    
    def test_space_members_table_exists(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - SpaceMembers
        TC-14: Verify space_members table is created
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'space_members'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "space_members table should exist"
    
    def test_space_members_unique_user_workspace(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - SpaceMembers
        TC-16: Verify user_id + workspace_id is unique
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'space_members' AND constraint_type = 'UNIQUE'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "space_members should have unique constraint"
    
    def test_space_members_foreign_keys(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - SpaceMembers
        TC-17: Verify foreign key constraints
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT kcu.column_name, ccu.table_name AS foreign_table
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'space_members' AND tc.constraint_type = 'FOREIGN KEY'
        """)
        fks = {row['column_name']: row['foreign_table'] for row in db_cursor.fetchall()}
        
        assert 'user_id' in fks, "user_id should have foreign key"
        assert 'workspace_id' in fks, "workspace_id should have foreign key"
    
    def test_space_members_default_role_member(self, db_cursor, run_migration):
        """
        AC-5: Workspace permission structure with roles
        EC-4: Verify default role is MEMBER
        """
        run_migration('000_extensions.sql')
        run_migration('001_users.sql')
        run_migration('002_workspaces.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT column_default FROM information_schema.columns
            WHERE table_name = 'space_members' AND column_name = 'role'
        """)
        result = db_cursor.fetchone()
        assert 'MEMBER' in result['column_default'], "Default role should be MEMBER"
