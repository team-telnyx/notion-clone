-- Verification script for database migrations
-- Run this script to verify all tables, indexes, and constraints are properly created

-- Check all 5 tables exist
SELECT 'Checking tables...' AS status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'workspaces', 'workspace_members', 'pages', 'blocks')
ORDER BY table_name;

-- Check indexes
SELECT 'Checking indexes...' AS status;
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- Check foreign key constraints
SELECT 'Checking foreign key constraints...' AS status;
SELECT 
    tc.table_name, 
    tc.constraint_name,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_schema = 'public'
AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- Check unique constraints
SELECT 'Checking unique constraints...' AS status;
SELECT table_name, constraint_name 
FROM information_schema.table_constraints 
WHERE table_schema = 'public' 
AND constraint_type = 'UNIQUE'
ORDER BY table_name;

-- Verify column counts per table
SELECT 'Verifying column counts...' AS status;
SELECT table_name, COUNT(*) as column_count 
FROM information_schema.columns 
WHERE table_schema = 'public' 
GROUP BY table_name
ORDER BY table_name;

SELECT 'Migration verification complete!' AS status;
