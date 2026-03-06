#!/bin/bash
set -e

DB_HOST="pgbot-main-18.internal"
DB_PORT="5432"
DB_NAME="notion_clone"
DB_USER="notion_clone"

if ! command -v psql &> /dev/null; then
    echo "ERROR: psql is not installed. Please install PostgreSQL client."
    exit 1
fi

echo "========================================"
echo "Running Notion Clone Migrations"
echo "========================================"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST"
echo ""

run_migration() {
    local file=$1
    echo "Running: $file"
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$file"
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
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"

echo ""
echo "Indexes created:"
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\di"

echo ""
echo "========================================"
echo "Migration Runner: SUCCESS"
echo "========================================"
