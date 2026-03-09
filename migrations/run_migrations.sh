#!/bin/bash
#
# Usage: ./run_migrations.sh [host] [port] [database] [user]
#
# Environment Variables:
#   PGPASSWORD - PostgreSQL password (set this before running)
#
# Examples:
#   export PGPASSWORD='your_password'
#   ./run_migrations.sh
#
#   PGPASSWORD='password' ./run_migrations.sh pgbot-main-18.internal 5432 notion_clone notion_clone

set -e

HOST=${1:-pgbot-main-18.internal}
PORT=${2:-5432}
DB=${3:-notion_clone}
USER=${4:-notion_clone}

echo "Running migrations against ${DB} on ${HOST}:${PORT} as ${USER}"

if ! command -v psql &> /dev/null; then
    echo "Error: psql command not found"
    exit 1
fi

echo "Enabling pgcrypto extension..."
echo "CREATE EXTENSION IF NOT EXISTS pgcrypto;" | psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" 2>&1 || true

MIGRATIONS_DIR="$(dirname "$0")"
MIGRATION_FILES=$(ls -1 "$MIGRATIONS_DIR"/*.sql | grep "^$MIGRATIONS_DIR/[0-9]" | sort)

SUCCESS_COUNT=0
FAILED_COUNT=0

for MIGRATION_FILE in $MIGRATION_FILES; do
    MIGRATION_NAME=$(basename "$MIGRATION_FILE")
    echo ""
    echo "Running migration: $MIGRATION_NAME"

    if psql -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" -f "$MIGRATION_FILE" 2>&1; then
        echo "✓ Successfully applied: $MIGRATION_NAME"
        ((SUCCESS_COUNT++))
    else
        echo "✗ Failed to apply: $MIGRATION_NAME"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo "================================"
echo "Migration Summary:"
echo "Successful: $SUCCESS_COUNT"
echo "Failed: $FAILED_COUNT"
echo "================================"

if [ $FAILED_COUNT -gt 0 ]; then
    exit 1
fi

echo ""
echo "All migrations completed successfully!"
exit 0
