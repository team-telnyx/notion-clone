CREATE TYPE block_type AS ENUM (
    'PAGE',
    'TEXT',
    'HEADING_1',
    'HEADING_2',
    'HEADING_3',
    'BULLET_LIST'
);

CREATE TABLE IF NOT EXISTS blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type block_type NOT NULL,
    content JSONB,
    content_version INTEGER DEFAULT 1 NOT NULL,
    properties JSONB,
    position FLOAT NOT NULL,
    path LTREE,
    
    parent_id UUID REFERENCES blocks(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    version INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT blocks_page_must_have_workspace CHECK (
        (type = 'PAGE' AND workspace_id IS NOT NULL) OR type != 'PAGE'
    )
);

CREATE INDEX IF NOT EXISTS idx_blocks_type ON blocks(type);
CREATE INDEX IF NOT EXISTS idx_blocks_parent_id ON blocks(parent_id);
CREATE INDEX IF NOT EXISTS idx_blocks_workspace_id ON blocks(workspace_id);
CREATE INDEX IF NOT EXISTS idx_blocks_author_id ON blocks(author_id);
CREATE INDEX IF NOT EXISTS idx_blocks_deleted_at ON blocks(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_blocks_position ON blocks(position);
CREATE INDEX IF NOT EXISTS idx_blocks_path ON blocks USING GIST(path);
CREATE INDEX IF NOT EXISTS idx_blocks_content ON blocks USING GIN(content);
CREATE INDEX IF NOT EXISTS idx_blocks_properties ON blocks USING GIN(properties);
