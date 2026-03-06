#!/bin/bash
#
# Run all database migrations for Notion Clone
#
# Usage: ./run_migrations.sh [options]
#
# Environment Variables:
#   DB_HOST     - Database host (default: pgbot-main-18.internal)
#   DB_PORT     - Database port (default: 5432)
#   DB_NAME     - Database name (default: notion_clone)
#   DB_USER     - Database user (default: notion_clone)
#   DB_PASSWORD - Database password (required, or use PGPASSWORD)
#
# Options:
#   --dry-run   Show what would be executed without running
#   --verify    Verify schema after running migrations
#

set -e

# Configuration
DB_HOST="${DB_HOST:-pgbot-main-18.internal}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-notion_clone}"
DB_USER="${DB_USER:-notion_clone}"

# Parse arguments
DRY_RUN=false
VERIFY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --verify)
            VERIFY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Migration files in order
MIGRATIONS=(
    "001_create_users.sql"
    "002_create_workspaces.sql"
    "003_create_workspace_members.sql"
    "004_create_pages.sql"
    "005_create_blocks.sql"
)

echo "==================================="
echo "  Notion Clone Database Migrations"
echo "==================================="
echo ""
echo "Host: $DB_HOST"
echo "Port: $DB_PORT"
echo "Database: $DB_NAME"
echo "User: $DB_USER"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN MODE - No changes will be made]"
    echo ""
fi

# Check for psql
if ! command -v psql &> /dev/null; then
    echo "ERROR: psql command not found. Please install PostgreSQL client."
    exit 1
fi

# Test connection
echo "Testing database connection..."
if ! PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1" > /dev/null 2>&1; then
    echo "ERROR: Cannot connect to database. Check your credentials and network."
    exit 1
fi
echo "Connection successful!"
echo ""

# Run migrations
echo "Running migrations..."
for migration in "${MIGRATIONS[@]}"; do
    migration_path="$SCRIPT_DIR/$migration"
    
    if [ ! -f "$migration_path" ]; then
        echo "ERROR: Migration file not found: $migration_path"
        exit 1
    fi
    
    echo "  → $migration"
    
    if [ "$DRY_RUN" = false ]; then
        if ! PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$migration_path" > /dev/null 2>&1; then
            echo "    ERROR: Migration failed!"
            exit 1
        fi
        echo "    ✓ Complete"
    else
        echo "    [Would run: psql -f $migration]"
    fi
done

echo ""
echo "All migrations completed successfully!"

# Verify schema if requested
if [ "$VERIFY" = true ] && [ "$DRY_RUN" = false ]; then
    echo ""
    echo "==================================="
    echo "  Verifying Schema"
    echo "==================================="
    echo ""
    
    echo "Tables:"
    PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\dt"
    
    echo ""
    echo "Indexes:"
    PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "\di"
    
    echo ""
    echo "Foreign Keys:"
    PGPASSWORD="${DB_PASSWORD:-$PGPASSWORD}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
"
fi

echo ""
echo "==================================="
echo "  Migration Complete ✓"
echo "==================================="
