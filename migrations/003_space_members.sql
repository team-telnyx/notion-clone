DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'space_member_role') THEN
        CREATE TYPE space_member_role AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS space_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    role space_member_role DEFAULT 'MEMBER' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, workspace_id)
);

CREATE INDEX IF NOT EXISTS idx_space_members_user_id ON space_members(user_id);
CREATE INDEX IF NOT EXISTS idx_space_members_workspace_id ON space_members(workspace_id);
