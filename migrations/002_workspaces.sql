CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    icon VARCHAR(255),
    version INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_workspaces_slug ON workspaces(slug);
CREATE INDEX IF NOT EXISTS idx_workspaces_deleted_at ON workspaces(deleted_at) WHERE deleted_at IS NULL;
