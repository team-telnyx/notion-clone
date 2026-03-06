import os
import sys

import psycopg2
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture(scope="session")
def database_url():
    return os.getenv("DATABASE_URL", "postgresql://postgres@localhost:5432/notion_clone")


@pytest.fixture(scope="function")
def db_connection(database_url):
    conn = psycopg2.connect(database_url)
    conn.autocommit = False
    yield conn
    conn.rollback()
    conn.close()


@pytest.fixture(scope="function")
def db_cursor(db_connection):
    cursor = db_connection.cursor()
    yield cursor
    cursor.close()


@pytest.fixture(scope="session", autouse=True)
def setup_database(database_url):
    conn = psycopg2.connect(database_url)
    conn.autocommit = True
    cursor = conn.cursor()
    
    cursor.execute("SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'users')")
    if not cursor.fetchone()[0]:
        raise pytest.skip("Database not migrated yet - run migrations first")
    
    cursor.close()
    conn.close()
