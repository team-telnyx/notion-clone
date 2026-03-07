"""
Tests for migration 001_users.sql
Tests that users table is created with proper schema.
"""
import os
import pytest


class TestUsersMigration:
    """Test suite for 001_users.sql migration."""
    
    MIGRATION_FILE = '001_users.sql'
    REQUIRED_COLUMNS = {
        'id': {'type': 'uuid', 'nullable': False},
        'email': {'type': 'character varying', 'nullable': False, 'max_length': 255},
        'password_hash': {'type': 'character varying', 'nullable': False, 'max_length': 255},
        'name': {'type': 'character varying', 'nullable': True, 'max_length': 255},
        'avatar_url': {'type': 'text', 'nullable': True},
        'version': {'type': 'integer', 'nullable': False},
        'created_at': {'type': 'timestamp with time zone', 'nullable': False},
        'updated_at': {'type': 'timestamp with time zone', 'nullable': False},
        'deleted_at': {'type': 'timestamp with time zone', 'nullable': True},
    }
    
    def test_migration_file_exists(self, migrations_dir):
        """
        AC-1: Core entities defined - Users
        TC-5: Verify migration file exists
        """
        filepath = os.path.join(migrations_dir, self.MIGRATION_FILE)
        assert os.path.exists(filepath), f"Migration file {self.MIGRATION_FILE} does not exist"
    
    def test_users_table_exists(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-5: Verify users table is created
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'users'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "users table should exist"
    
    def test_users_table_columns(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-6: Verify all required columns exist with correct types
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT column_name, data_type, is_nullable, character_maximum_length
            FROM information_schema.columns
            WHERE table_name = 'users'
        """)
        columns = {row['column_name']: row for row in db_cursor.fetchall()}
        
        for col_name, expected in self.REQUIRED_COLUMNS.items():
            assert col_name in columns, f"Column {col_name} should exist"
            col = columns[col_name]
            assert col['data_type'] == expected['type'], \
                f"Column {col_name} should be {expected['type']}"
            expected_nullable = 'YES' if expected['nullable'] else 'NO'
            assert col['is_nullable'] == expected_nullable, \
                f"Column {col_name} nullable should be {expected_nullable}"
    
    def test_users_primary_key(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-6b: Verify id is primary key
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT kcu.column_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = 'users' AND tc.constraint_type = 'PRIMARY KEY'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "users table should have a primary key"
        assert result['column_name'] == 'id', "Primary key should be id"
    
    def test_users_email_unique_constraint(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-7: Verify email has unique constraint
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM information_schema.table_constraints
            WHERE table_name = 'users' AND constraint_type = 'UNIQUE'
            AND constraint_name LIKE '%email%'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "email should have unique constraint"
    
    def test_users_email_index_exists(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-8: Verify email index exists for fast lookups
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT 1 FROM pg_indexes
            WHERE tablename = 'users' AND indexname = 'idx_users_email'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "idx_users_email index should exist"
    
    def test_users_deleted_at_index_exists(self, db_cursor, run_migration):
        """
        AC-4: Soft delete support
        TC-10: Verify partial index on deleted_at for soft deletes
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            SELECT indexdef FROM pg_indexes
            WHERE tablename = 'users' AND indexname = 'idx_users_deleted_at'
        """)
        result = db_cursor.fetchone()
        assert result is not None, "idx_users_deleted_at index should exist"
        assert 'deleted_at IS NULL' in result['indexdef'], \
            "deleted_at index should be partial for non-deleted records"
    
    def test_users_uuid_generation(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-9: Verify UUID is auto-generated
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('test@example.com', 'hash123')
            RETURNING id
        """)
        result = db_cursor.fetchone()
        assert result['id'] is not None, "UUID should be auto-generated"
        assert len(str(result['id'])) == 36, "Should be valid UUID format"
    
    def test_users_timestamp_defaults(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        TC-9b: Verify timestamp defaults
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('test2@example.com', 'hash456')
            RETURNING created_at, updated_at
        """)
        result = db_cursor.fetchone()
        assert result['created_at'] is not None, "created_at should default to NOW()"
        assert result['updated_at'] is not None, "updated_at should default to NOW()"
    
    def test_users_email_not_null(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        EC-2: Verify email cannot be null
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        with pytest.raises(Exception):
            db_cursor.execute("""
                INSERT INTO users (email, password_hash)
                VALUES (NULL, 'hash123')
            """)
    
    def test_users_duplicate_email_rejected(self, db_cursor, run_migration):
        """
        AC-1: Core entities defined - Users
        EC-3: Verify duplicate emails are rejected
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('duplicate@example.com', 'hash123')
        """)
        
        with pytest.raises(Exception):
            db_cursor.execute("""
                INSERT INTO users (email, password_hash)
                VALUES ('duplicate@example.com', 'hash456')
            """)
    
    def test_users_optimistic_locking(self, db_cursor, run_migration):
        """
        AC-4: Optimistic locking support
        TC-11: Verify version field exists for optimistic locking
        """
        run_migration('000_extensions.sql')
        run_migration(self.MIGRATION_FILE)
        
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('version@test.com', 'hash123')
            RETURNING version
        """)
        result = db_cursor.fetchone()
        assert result['version'] == 0, "Version should default to 0"
