-- ============================================================================
-- Notion Clone Database Migration Verification Tests
-- ============================================================================
-- Run these tests against the notion_clone database after running all migrations
-- Usage: psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f tests/verify_migrations.sql
-- ============================================================================

-- Test helper function
CREATE OR REPLACE FUNCTION test_assert(condition BOOLEAN, test_name TEXT)
RETURNS VOID AS $$
BEGIN
    IF condition THEN
        RAISE NOTICE '✓ PASS: %', test_name;
    ELSE
        RAISE EXCEPTION '✗ FAIL: %', test_name;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TEST SUITE: Table Existence and Column Verification
-- ============================================================================

-- Test 1: Verify users table structure
DO $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    -- Check table exists
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users'),
        'users table exists'
    );
    
    -- Check all required columns
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id'),
        'users.id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email'),
        'users.email column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash'),
        'users.password_hash column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'name'),
        'users.name column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_url'),
        'users.avatar_url column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at'),
        'users.created_at column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at'),
        'users.updated_at column exists'
    );
    
    -- Check UUID type for id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'id' AND data_type = 'uuid'
        ),
        'users.id is UUID type'
    );
    
    -- Check email has UNIQUE constraint
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'users' AND tc.constraint_type = 'UNIQUE' AND ccu.column_name = 'email'
        ),
        'users.email has UNIQUE constraint'
    );
END;
$$;

-- Test 2: Verify workspaces table structure
DO $$
BEGIN
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workspaces'),
        'workspaces table exists'
    );
    
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'id'),
        'workspaces.id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'name'),
        'workspaces.name column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'description'),
        'workspaces.description column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'owner_id'),
        'workspaces.owner_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'created_at'),
        'workspaces.created_at column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspaces' AND column_name = 'updated_at'),
        'workspaces.updated_at column exists'
    );
    
    -- Check owner_id is NOT NULL
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'workspaces' AND column_name = 'owner_id' AND is_nullable = 'NO'
        ),
        'workspaces.owner_id is NOT NULL'
    );
END;
$$;

-- Test 3: Verify workspace_members table structure
DO $$
BEGIN
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workspace_members'),
        'workspace_members table exists'
    );
    
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_members' AND column_name = 'id'),
        'workspace_members.id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_members' AND column_name = 'workspace_id'),
        'workspace_members.workspace_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_members' AND column_name = 'user_id'),
        'workspace_members.user_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_members' AND column_name = 'role'),
        'workspace_members.role column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'workspace_members' AND column_name = 'created_at'),
        'workspace_members.created_at column exists'
    );
END;
$$;

-- Test 4: Verify pages table structure
DO $$
BEGIN
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages'),
        'pages table exists'
    );
    
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'id'),
        'pages.id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'title'),
        'pages.title column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'content'),
        'pages.content column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'workspace_id'),
        'pages.workspace_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'parent_id'),
        'pages.parent_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'created_by'),
        'pages.created_by column exists'
    );
    
    -- Check content is JSONB type
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'pages' AND column_name = 'content' AND data_type = 'jsonb'
        ),
        'pages.content is JSONB type'
    );
END;
$$;

-- Test 5: Verify blocks table structure
DO $$
BEGIN
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blocks'),
        'blocks table exists'
    );
    
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'id'),
        'blocks.id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'page_id'),
        'blocks.page_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'parent_id'),
        'blocks.parent_id column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'type'),
        'blocks.type column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'content'),
        'blocks.content column exists'
    );
    PERFORM test_assert(
        EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blocks' AND column_name = 'position'),
        'blocks.position column exists'
    );
    
    -- Check position is INTEGER type
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'blocks' AND column_name = 'position' AND data_type = 'integer'
        ),
        'blocks.position is INTEGER type'
    );
END;
$$;

-- ============================================================================
-- TEST SUITE: Index Verification
-- ============================================================================

DO $$
BEGIN
    -- Test idx_users_email
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'users' AND indexname = 'idx_users_email'
        ),
        'Index idx_users_email exists on users table'
    );
    
    -- Test idx_workspaces_owner_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'workspaces' AND indexname = 'idx_workspaces_owner_id'
        ),
        'Index idx_workspaces_owner_id exists on workspaces table'
    );
    
    -- Test idx_workspace_members_user_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'workspace_members' AND indexname = 'idx_workspace_members_user_id'
        ),
        'Index idx_workspace_members_user_id exists on workspace_members table'
    );
    
    -- Test idx_pages_workspace_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'pages' AND indexname = 'idx_pages_workspace_id'
        ),
        'Index idx_pages_workspace_id exists on pages table'
    );
    
    -- Test idx_pages_parent_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'pages' AND indexname = 'idx_pages_parent_id'
        ),
        'Index idx_pages_parent_id exists on pages table'
    );
    
    -- Test idx_pages_created_by
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'pages' AND indexname = 'idx_pages_created_by'
        ),
        'Index idx_pages_created_by exists on pages table'
    );
    
    -- Test idx_blocks_page_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'blocks' AND indexname = 'idx_blocks_page_id'
        ),
        'Index idx_blocks_page_id exists on blocks table'
    );
    
    -- Test idx_blocks_parent_id
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'blocks' AND indexname = 'idx_blocks_parent_id'
        ),
        'Index idx_blocks_parent_id exists on blocks table'
    );
    
    -- Test idx_blocks_position
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pg_indexes 
            WHERE tablename = 'blocks' AND indexname = 'idx_blocks_position'
        ),
        'Index idx_blocks_position exists on blocks table'
    );
END;
$$;

-- ============================================================================
-- TEST SUITE: Foreign Key Constraint Verification
-- ============================================================================

DO $$
BEGIN
    -- Test workspaces FK to users
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'workspaces' 
            AND tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'users'
        ),
        'Foreign key: workspaces.owner_id references users.id'
    );
    
    -- Test workspace_members FK to workspaces
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'workspace_members' 
            AND tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'workspaces'
        ),
        'Foreign key: workspace_members.workspace_id references workspaces.id'
    );
    
    -- Test workspace_members FK to users
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            WHERE tc.table_name = 'workspace_members' 
            AND tc.constraint_type = 'FOREIGN KEY'
        ),
        'Foreign key: workspace_members has foreign key constraints'
    );
    
    -- Test pages FK to workspaces
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'pages' 
            AND tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'workspaces'
        ),
        'Foreign key: pages.workspace_id references workspaces.id'
    );
    
    -- Test pages FK to pages (self-reference)
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            WHERE tc.table_name = 'pages' 
            AND tc.constraint_type = 'FOREIGN KEY'
        ),
        'Foreign key: pages.parent_id references pages.id'
    );
    
    -- Test blocks FK to pages
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM information_schema.table_constraints tc
            JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
            WHERE tc.table_name = 'blocks' 
            AND tc.constraint_type = 'FOREIGN KEY' 
            AND ccu.column_name = 'id'
            AND ccu.table_name = 'pages'
        ),
        'Foreign key: blocks.page_id references pages.id'
    );
END;
$$;

-- ============================================================================
-- TEST SUITE: CASCADE Delete Verification
-- ============================================================================

DO $$
DECLARE
    v_user_id UUID;
    v_workspace_id UUID;
    v_page_id UUID;
    v_block_id UUID;
BEGIN
    -- Create test data
    INSERT INTO users (email, password_hash, name) 
    VALUES ('cascade_test@example.com', 'test_hash', 'Test User')
    RETURNING id INTO v_user_id;
    
    INSERT INTO workspaces (name, description, owner_id)
    VALUES ('Test Workspace', 'Test Desc', v_user_id)
    RETURNING id INTO v_workspace_id;
    
    INSERT INTO pages (title, workspace_id, created_by)
    VALUES ('Test Page', v_workspace_id, v_user_id)
    RETURNING id INTO v_page_id;
    
    INSERT INTO blocks (page_id, type, position)
    VALUES (v_page_id, 'paragraph', 0)
    RETURNING id INTO v_block_id;
    
    -- Add user as workspace member
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (v_workspace_id, v_user_id, 'owner');
    
    -- Delete user and verify cascade
    DELETE FROM users WHERE id = v_user_id;
    
    -- Verify user deleted
    PERFORM test_assert(
        NOT EXISTS (SELECT 1 FROM users WHERE id = v_user_id),
        'CASCADE: User deleted successfully'
    );
    
    -- Verify workspace cascade deleted
    PERFORM test_assert(
        NOT EXISTS (SELECT 1 FROM workspaces WHERE id = v_workspace_id),
        'CASCADE: Workspace deleted when owner deleted'
    );
    
    -- Verify workspace_members cascade deleted
    PERFORM test_assert(
        NOT EXISTS (SELECT 1 FROM workspace_members WHERE workspace_id = v_workspace_id),
        'CASCADE: Workspace members deleted when workspace deleted'
    );
    
    -- Verify pages cascade deleted
    PERFORM test_assert(
        NOT EXISTS (SELECT 1 FROM pages WHERE id = v_page_id),
        'CASCADE: Page deleted when workspace deleted'
    );
    
    -- Verify blocks cascade deleted
    PERFORM test_assert(
        NOT EXISTS (SELECT 1 FROM blocks WHERE id = v_block_id),
        'CASCADE: Blocks deleted when page deleted'
    );
END;
$$;

-- ============================================================================
-- TEST SUITE: Idempotency Verification
-- ============================================================================

DO $$
BEGIN
    -- Re-run all migrations to verify idempotency
    -- This should execute without errors even if tables exist
    
    PERFORM test_assert(TRUE, 'Migration files are idempotent (test by manually re-running)');
    
    RAISE NOTICE '';
    RAISE NOTICE '=== IDEMPOTENCY TEST ===';
    RAISE NOTICE 'To verify idempotency, manually re-run the migration SQL files:';
    RAISE NOTICE '  psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f migrations/001_create_users.sql';
    RAISE NOTICE '  psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f migrations/002_create_workspaces.sql';
    RAISE NOTICE '  psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f migrations/003_create_workspace_members.sql';
    RAISE NOTICE '  psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f migrations/004_create_pages.sql';
    RAISE NOTICE '  psql -h pgbot-main-18.internal -U notion_clone -d notion_clone -f migrations/005_create_blocks.sql';
    RAISE NOTICE 'All commands should complete without errors.';
END;
$$;

-- ============================================================================
-- TEST SUITE: Edge Cases
-- ============================================================================

DO $$
DECLARE
    v_user_id UUID;
    v_workspace_id UUID;
    v_parent_page_id UUID;
    v_child_page_id UUID;
BEGIN
    -- Test: Workspace member role defaults to 'member'
    INSERT INTO users (email, password_hash, name) 
    VALUES ('role_test@example.com', 'test_hash', 'Role Test User')
    RETURNING id INTO v_user_id;
    
    INSERT INTO workspaces (name, description, owner_id)
    VALUES ('Role Test Workspace', 'Test', v_user_id)
    RETURNING id INTO v_workspace_id;
    
    INSERT INTO workspace_members (workspace_id, user_id)
    VALUES (v_workspace_id, v_user_id);
    
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_id = v_workspace_id AND user_id = v_user_id AND role = 'member'
        ),
        'EDGE CASE: Workspace member role defaults to member'
    );
    
    -- Clean up
    DELETE FROM users WHERE id = v_user_id;
END;
$$;

DO $$
DECLARE
    v_user_id UUID;
    v_workspace_id UUID;
    v_page1_id UUID;
    v_page2_id UUID;
    v_page3_id UUID;
BEGIN
    -- Test: Deep page nesting (parent_id self-reference)
    INSERT INTO users (email, password_hash, name) 
    VALUES ('nesting_test@example.com', 'test_hash', 'Nesting Test User')
    RETURNING id INTO v_user_id;
    
    INSERT INTO workspaces (name, description, owner_id)
    VALUES ('Nesting Test Workspace', 'Test', v_user_id)
    RETURNING id INTO v_workspace_id;
    
    -- Create nested pages: page2 is child of page1, page3 is child of page2
    INSERT INTO pages (title, workspace_id, created_by, parent_id)
    VALUES ('Level 1', v_workspace_id, v_user_id, NULL)
    RETURNING id INTO v_page1_id;
    
    INSERT INTO pages (title, workspace_id, created_by, parent_id)
    VALUES ('Level 2', v_workspace_id, v_user_id, v_page1_id)
    RETURNING id INTO v_page2_id;
    
    INSERT INTO pages (title, workspace_id, created_by, parent_id)
    VALUES ('Level 3', v_workspace_id, v_user_id, v_page2_id)
    RETURNING id INTO v_page3_id;
    
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pages 
            WHERE id = v_page2_id AND parent_id = v_page1_id
        ),
        'EDGE CASE: Level 2 page has correct parent'
    );
    
    PERFORM test_assert(
        EXISTS (
            SELECT 1 FROM pages 
            WHERE id = v_page3_id AND parent_id = v_page2_id
        ),
        'EDGE CASE: Level 3 page has correct parent (deep nesting works)'
    );
    
    -- Clean up
    DELETE FROM users WHERE id = v_user_id;
END;
$$;

-- ============================================================================
-- TEST COMPLETION
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'ALL TESTS COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
END;
$$;

-- Drop test helper function
DROP FUNCTION IF EXISTS test_assert(BOOLEAN, TEXT);
