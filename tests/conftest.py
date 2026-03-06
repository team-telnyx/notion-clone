"""
Pytest configuration and fixtures for database migration tests.
"""
import os
import pytest
import psycopg2
from psycopg2.extras import RealDictCursor


@pytest.fixture(scope='session')
def db_config():
    """Database configuration for tests."""
    return {
        'host': os.getenv('TEST_DB_HOST', 'localhost'),
        'port': os.getenv('TEST_DB_PORT', '5432'),
        'database': os.getenv('TEST_DB_NAME', 'notion_clone_test'),
        'user': os.getenv('TEST_DB_USER', 'postgres'),
        'password': os.getenv('TEST_DB_PASSWORD', 'postgres'),
    }


@pytest.fixture(scope='function')
def db_connection(db_config):
    """Create a fresh database connection for each test."""
    conn = psycopg2.connect(**db_config)
    conn.autocommit = False
    yield conn
    conn.rollback()
    conn.close()


@pytest.fixture(scope='function')
def db_cursor(db_connection):
    """Create a cursor for database operations."""
    cursor = db_connection.cursor(cursor_factory=RealDictCursor)
    yield cursor
    cursor.close()


@pytest.fixture(scope='function')
def clean_database(db_connection, db_cursor):
    """Clean all tables before test runs."""
    db_cursor.execute("""
        DROP TABLE IF EXISTS comments CASCADE;
        DROP TABLE IF EXISTS blocks CASCADE;
        DROP TABLE IF EXISTS space_members CASCADE;
        DROP TABLE IF EXISTS workspaces CASCADE;
        DROP TABLE IF EXISTS users CASCADE;
        DROP TYPE IF EXISTS block_type CASCADE;
        DROP TYPE IF EXISTS space_member_role CASCADE;
    """)
    db_connection.commit()
    yield


@pytest.fixture(scope='function')
def migrations_dir():
    """Path to migrations directory."""
    return os.path.join(os.path.dirname(__file__), '..', 'migrations')


def load_migration(migrations_dir, filename):
    """Load and return migration file content."""
    filepath = os.path.join(migrations_dir, filename)
    with open(filepath, 'r') as f:
        return f.read()


@pytest.fixture
def run_migration(db_cursor, migrations_dir):
    """Helper to run a migration file."""
    def _run(filename):
        sql = load_migration(migrations_dir, filename)
        db_cursor.execute(sql)
    return _run
