import os
import subprocess
import time

import psycopg2
import pytest

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/notion_clone")
MIGRATION_FILE = "migrations/001_create_users.sql"


@pytest.fixture
def db_connection():
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = False
    yield conn
    conn.rollback()
    conn.close()


@pytest.fixture
def db_cursor(db_connection):
    cursor = db_connection.cursor()
    yield cursor
    cursor.close()


def test_ac1_migration_file_exists():
    assert os.path.exists(MIGRATION_FILE), f"Migration file {MIGRATION_FILE} must exist"


def test_ac1_migration_has_valid_sql_syntax():
    with open(MIGRATION_FILE, 'r') as f:
        content = f.read()
    assert 'CREATE TABLE' in content
    assert 'users' in content
    assert 'CREATE INDEX' in content


def test_ac2_users_table_exists(db_cursor):
    db_cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'users'
        );
    """)
    assert db_cursor.fetchone()[0], "Users table must exist"


def test_ac2_column_id_is_uuid_primary_key(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'id';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "id column must exist"
    assert result[0] == 'uuid', f"id must be UUID, got {result[0]}"
    assert result[1] == 'NO', "id must be NOT NULL"
    assert 'gen_random_uuid' in result[2], f"id must default to gen_random_uuid, got {result[2]}"

    db_cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
                ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'users' 
                AND tc.constraint_type = 'PRIMARY KEY'
                AND ccu.column_name = 'id'
        );
    """)
    assert db_cursor.fetchone()[0], "id must be PRIMARY KEY"


def test_ac2_column_email_is_varchar_unique_not_null(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'email';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "email column must exist"
    assert result[0] == 'character varying', f"email must be VARCHAR, got {result[0]}"
    assert result[1] == 'NO', "email must be NOT NULL"
    assert result[2] == 255, f"email must have max length 255, got {result[2]}"

    db_cursor.execute("""
        SELECT EXISTS (
            SELECT FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu 
                ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'users' 
                AND tc.constraint_type = 'UNIQUE'
                AND ccu.column_name = 'email'
        );
    """)
    assert db_cursor.fetchone()[0], "email must have UNIQUE constraint"


def test_ac2_column_password_hash_is_varchar_not_null(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'password_hash';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "password_hash column must exist"
    assert result[0] == 'character varying', f"password_hash must be VARCHAR, got {result[0]}"
    assert result[1] == 'NO', "password_hash must be NOT NULL"
    assert result[2] == 255, f"password_hash must have max length 255, got {result[2]}"


def test_ac2_column_name_is_varchar_nullable(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, character_maximum_length
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'name';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "name column must exist"
    assert result[0] == 'character varying', f"name must be VARCHAR, got {result[0]}"
    assert result[1] == 'YES', "name must be nullable"
    assert result[2] == 255, f"name must have max length 255, got {result[2]}"


def test_ac2_column_avatar_url_is_text_nullable(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'avatar_url';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "avatar_url column must exist"
    assert result[0] == 'text', f"avatar_url must be TEXT, got {result[0]}"
    assert result[1] == 'YES', "avatar_url must be nullable"


def test_ac2_column_created_at_is_timestamp_with_default_now(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'created_at';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "created_at column must exist"
    assert 'timestamp' in result[0].lower(), f"created_at must be TIMESTAMP, got {result[0]}"
    assert 'now' in result[2].lower(), f"created_at must default to NOW(), got {result[2]}"


def test_ac2_column_updated_at_is_timestamp_with_default_now(db_cursor):
    db_cursor.execute("""
        SELECT data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'users' AND column_name = 'updated_at';
    """)
    result = db_cursor.fetchone()
    assert result is not None, "updated_at column must exist"
    assert 'timestamp' in result[0].lower(), f"updated_at must be TIMESTAMP, got {result[0]}"
    assert 'now' in result[2].lower(), f"updated_at must default to NOW(), got {result[2]}"


def test_ac3_index_on_email_exists(db_cursor):
    db_cursor.execute("""
        SELECT EXISTS (
            SELECT FROM pg_indexes
            WHERE tablename = 'users' AND indexname = 'idx_users_email'
        );
    """)
    assert db_cursor.fetchone()[0], "Index idx_users_email must exist on users table"

    db_cursor.execute("""
        SELECT indexdef FROM pg_indexes
        WHERE tablename = 'users' AND indexname = 'idx_users_email';
    """)
    result = db_cursor.fetchone()
    assert 'email' in result[0].lower(), "Index must be on email column"


def test_ac4_migration_executes_without_errors():
    result = subprocess.run(
        ['psql', DATABASE_URL, '-f', MIGRATION_FILE],
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Migration failed with error: {result.stderr}"


def test_ac5_trigger_updates_updated_at_on_row_update(db_connection, db_cursor):
    db_cursor.execute("""
        INSERT INTO users (email, password_hash, name)
        VALUES ('trigger_test@example.com', 'test_hash', 'Test User')
        RETURNING id, created_at, updated_at;
    """)
    result = db_cursor.fetchone()
    user_id = result[0]
    created_at = result[1]
    original_updated_at = result[2]

    time.sleep(1)

    db_cursor.execute("""
        UPDATE users SET name = 'Updated Name' WHERE id = %s;
    """, (user_id,))
    db_connection.commit()

    db_cursor.execute("""
        SELECT created_at, updated_at FROM users WHERE id = %s;
    """, (user_id,))
    result = db_cursor.fetchone()
    final_created_at = result[0]
    final_updated_at = result[1]

    assert final_created_at == created_at, "created_at should not change on update"
    assert final_updated_at > original_updated_at, "updated_at should increase on update"

    db_cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
    db_connection.commit()


def test_ec_unique_constraint_prevents_duplicate_email(db_connection, db_cursor):
    db_cursor.execute("""
        INSERT INTO users (email, password_hash)
        VALUES ('duplicate_test@example.com', 'hash1');
    """)
    db_connection.commit()

    with pytest.raises(psycopg2.IntegrityError):
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('duplicate_test@example.com', 'hash2');
        """)
        db_connection.commit()

    db_connection.rollback()
    db_cursor.execute("DELETE FROM users WHERE email = 'duplicate_test@example.com';")
    db_connection.commit()


def test_ec_not_null_constraints_reject_null_values(db_cursor):
    with pytest.raises(psycopg2.IntegrityError):
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES (NULL, 'some_hash');
        """)

    with pytest.raises(psycopg2.IntegrityError):
        db_cursor.execute("""
            INSERT INTO users (email, password_hash)
            VALUES ('test@example.com', NULL);
        """)


def test_ec_uuid_auto_generates_on_insert(db_connection, db_cursor):
    db_cursor.execute("""
        INSERT INTO users (email, password_hash)
        VALUES ('uuid_test@example.com', 'hash_value')
        RETURNING id;
    """)
    result = db_cursor.fetchone()
    user_id = result[0]

    assert user_id is not None, "id should be auto-generated"
    assert len(str(user_id)) == 36, "id should be a valid UUID"

    db_cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
    db_connection.commit()


def test_ec_password_hash_accepts_60_char_bcrypt(db_connection, db_cursor):
    bcrypt_hash = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.VTtYA.qGZvKG6"

    db_cursor.execute("""
        INSERT INTO users (email, password_hash)
        VALUES ('bcrypt_test@example.com', %s)
        RETURNING id;
    """, (bcrypt_hash,))
    result = db_cursor.fetchone()
    user_id = result[0]

    db_cursor.execute("""
        SELECT password_hash FROM users WHERE id = %s;
    """, (user_id,))
    stored_hash = db_cursor.fetchone()[0]

    assert stored_hash == bcrypt_hash, "Password hash should store 60 char bcrypt value"

    db_cursor.execute("DELETE FROM users WHERE id = %s;", (user_id,))
    db_connection.commit()
