#!/bin/bash
set -e

# Configuration - can be overridden by environment variables
DB_HOST="${DB_HOST:-pgbot-main-18.internal}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-notion_clone}"
DB_USER="${DB_USER:-notion_clone}"

# Check for psql
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql is not installed. Please install PostgreSQL client."
    exit 1
fi

# Test database connection first
echo "Testing database connection..."
if ! PGPASSWORD="${DB_PASSWORD:-}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    echo "ERROR: Cannot connect to database. Please check your credentials and network."
    echo "  Host: $DB_HOST"
    echo "  Port: $DB_PORT"
    echo "  Database: $DB_NAME"
    echo "  User: $DB_USER"
    exit 1
fi
echo "✓ Database connection successful"
echo ""

echo "========================================"
echo "Running Notion Clone Migrations"
echo "========================================"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo ""

run_migration() {
    local file=$1
    echo "Running: $file"
    PGPASSWORD="${DB_PASSWORD:-}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
    if [ $? -eq 0 ]; then
        echo "✓ $file completed successfully"
    else
        echo "✗ $file failed"
        exit 1
    fi
    echo ""
}

run_migration "migrations/001_create_users.sql"
run_migration "migrations/002_create_workspaces.sql"
run_migration "migrations/003_create_workspace_members.sql"
run_migration "migrations/004_create_pages.sql"
run_migration "migrations/005_create_blocks.sql"

echo "========================================"
echo "All migrations completed!"
echo "========================================"
echo ""

echo "Tables created:"
PGPASSWORD="${DB_PASSWORD:-}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"

echo ""
echo "Indexes created:"
PGPASSWORD="${DB_PASSWORD:-}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\di"

echo ""
echo "========================================"
echo "Migration Runner: SUCCESS"
echo "========================================"
