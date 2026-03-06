#!/bin/bash
set -e

DB_HOST="${DB_HOST:-pgbot-main-18.internal}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-notion_clone}"
DB_USER="${DB_USER:-notion_clone}"

echo "Running database migrations..."
echo "Host: $DB_HOST"
echo "Database: $DB_NAME"
echo ""

for migration in migrations/001_create_users.sql \
                 migrations/002_create_workspaces.sql \
                 migrations/003_create_workspace_members.sql \
                 migrations/004_create_pages.sql \
                 migrations/005_create_blocks.sql; do
    echo "Running $migration..."
    psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration"
    echo "  ✓ $migration completed"
done

echo ""
echo "All migrations completed successfully!"
echo ""
echo "Verifying tables..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"

echo ""
echo "Verifying indexes..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\di"
