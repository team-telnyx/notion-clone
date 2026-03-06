# Notion Clone - Technical Specification

**Version:** 1.0
**Database:** PostgreSQL (notion_clone on pgbot-main-18)
**Backend:** Express + TypeScript + Knex.js
**Frontend:** React + Vite + Tailwind + React Router

---

## Database Schema

### 1. users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Auto-generated |
| email | VARCHAR(255) | UNIQUE NOT NULL | User email (login) |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt hash (60 chars) |
| name | VARCHAR(255) | | Display name |
| avatar_url | TEXT | NULLABLE | Profile picture URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:** idx_users_email ON users(email)

### 2. workspaces
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Auto-generated |
| name | VARCHAR(255) | NOT NULL | Workspace name |
| description | TEXT | NULLABLE | Workspace description |
| owner_id | UUID | NOT NULL REFERENCES users(id) | Workspace owner |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:** idx_workspaces_owner_id ON workspaces(owner_id)

### 3. workspace_members
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Auto-generated |
| workspace_id | UUID | NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE | FK to workspace |
| user_id | UUID | NOT NULL REFERENCES users(id) ON DELETE CASCADE | FK to user |
| role | VARCHAR(50) | NOT NULL DEFAULT 'member' | owner, admin, member |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |

**Constraints:** UNIQUE(workspace_id, user_id)
**Indexes:** idx_workspace_members_user_id ON workspace_members(user_id)

### 4. pages
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Auto-generated |
| title | VARCHAR(255) | NOT NULL DEFAULT 'Untitled' | Page title |
| content | JSONB | DEFAULT '{}'::jsonb | Page content (blocks) |
| workspace_id | UUID | NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE | FK to workspace |
| parent_id | UUID | NULLABLE REFERENCES pages(id) ON DELETE CASCADE | Parent page (nesting) |
| created_by | UUID | NOT NULL REFERENCES users(id) | Page creator |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Indexes:** 
- idx_pages_workspace_id ON pages(workspace_id)
- idx_pages_parent_id ON pages(parent_id)
- idx_pages_created_by ON pages(created_by)

### 5. blocks
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY DEFAULT gen_random_uuid() | Auto-generated |
| page_id | UUID | NOT NULL REFERENCES pages(id) ON DELETE CASCADE | FK to page |
| parent_id | UUID | NULLABLE REFERENCES blocks(id) ON DELETE CASCADE | Parent block |
| type | VARCHAR(50) | NOT NULL | Block type (see below) |
| content | JSONB | DEFAULT '{}'::jsonb | Block content |
| position | INTEGER | NOT NULL DEFAULT 0 | Order within parent |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update time |

**Block Types:**
- paragraph: { "text": "string", "marks": [] }
- heading1: { "text": "string" }
- heading2: { "text": "string" }
- heading3: { "text": "string" }
- bullet_list: { "items": ["string"] }
- numbered_list: { "items": ["string"] }
- todo: { "text": "string", "checked": boolean }
- code: { "text": "string", "language": "string" }
- quote: { "text": "string" }
- divider: {}
- image: { "url": "string", "caption": "string" }

**Indexes:**
- idx_blocks_page_id ON blocks(page_id)
- idx_blocks_parent_id ON blocks(parent_id)
- idx_blocks_position ON blocks(page_id, position)

---

## API Endpoints

### Base URL: http://localhost:3001/api

### Auth Routes

#### POST /auth/register
Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST /auth/login
Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### GET /auth/me
Headers: Authorization: Bearer <token>
Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar_url": null
}
```

### Workspace Routes

#### GET /workspaces
Headers: Authorization: Bearer <token>
Response (200):
```json
[
  {
    "id": "uuid",
    "name": "My Workspace",
    "description": "Workspace description",
    "role": "owner",
    "memberCount": 3,
    "createdAt": "2026-01-01T00:00:00Z"
  }
]
```

#### POST /workspaces
Headers: Authorization: Bearer <token>
Request:
```json
{
  "name": "New Workspace",
  "description": "Workspace description"
}
```
Response (201):
```json
{
  "id": "uuid",
  "name": "New Workspace",
  "description": "Workspace description",
  "owner_id": "user-uuid",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### GET /workspaces/:id
Headers: Authorization: Bearer <token>
Response (200):
```json
{
  "id": "uuid",
  "name": "Workspace",
  "description": "...",
  "owner_id": "user-uuid",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### PUT /workspaces/:id
Headers: Authorization: Bearer <token>
Request:
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```
Response (200):
```json
{
  "id": "uuid",
  "name": "Updated Name",
  "description": "Updated description"
}
```

#### DELETE /workspaces/:id
Headers: Authorization: Bearer <token>
Response (204): No content

### Page Routes

#### GET /workspaces/:workspaceId/pages
Headers: Authorization: Bearer <token>
Response (200):
```json
[
  {
    "id": "uuid",
    "title": "Page Title",
    "parent_id": null,
    "created_by": "user-uuid",
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-01T00:00:00Z"
  }
]
```

#### POST /workspaces/:workspaceId/pages
Headers: Authorization: Bearer <token>
Request:
```json
{
  "title": "New Page",
  "parent_id": null
}
```
Response (201):
```json
{
  "id": "uuid",
  "title": "New Page",
  "content": {},
  "workspace_id": "workspace-uuid",
  "parent_id": null,
  "created_by": "user-uuid",
  "created_at": "2026-01-01T00:00:00Z"
}
```

#### GET /pages/:id
Headers: Authorization: Bearer <token>
Response (200):
```json
{
  "id": "uuid",
  "title": "Page Title",
  "content": {},
  "workspace_id": "workspace-uuid",
  "parent_id": null,
  "created_by": "user-uuid",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z"
}
```

#### PUT /pages/:id
Headers: Authorization: Bearer <token>
Request:
```json
{
  "title": "Updated Title",
  "content": { ... }
}
```
Response (200):
```json
{
  "id": "uuid",
  "title": "Updated Title",
  "content": { ... }
}
```

#### DELETE /pages/:id
Headers: Authorization: Bearer <token>
Response (204): No content

### Block Routes

#### GET /pages/:pageId/blocks
Headers: Authorization: Bearer <token>
Response (200):
```json
[
  {
    "id": "uuid",
    "page_id": "page-uuid",
    "parent_id": null,
    "type": "heading1",
    "content": { "text": "Hello World" },
    "position": 0,
    "created_at": "2026-01-01T00:00:00Z"
  }
]
```

#### POST /pages/:pageId/blocks
Headers: Authorization: Bearer <token>
Request:
```json
{
  "type": "paragraph",
  "content": { "text": "New paragraph" },
  "parent_id": null,
  "position": 0
}
```
Response (201):
```json
{
  "id": "uuid",
  "page_id": "page-uuid",
  "type": "paragraph",
  "content": { "text": "New paragraph" },
  "position": 0
}
```

#### PUT /blocks/:id
Headers: Authorization: Bearer <token>
Request:
```json
{
  "content": { "text": "Updated text" },
  "position": 1
}
```
Response (200):
```json
{
  "id": "uuid",
  "type": "paragraph",
  "content": { "text": "Updated text" },
  "position": 1
}
```

#### DELETE /blocks/:id
Headers: Authorization: Bearer <token>
Response (204): No content

---

## Frontend Pages

### 1. Login Page (/login)
- Email input (type="email", required)
- Password input (type="password", required)
- Submit button
- Link to Register page
- Error display for invalid credentials

### 2. Register Page (/register)
- Name input (type="text", required)
- Email input (type="email", required)
- Password input (type="password", required, minlength=8)
- Confirm password input
- Submit button
- Link to Login page
- Validation errors

### 3. Dashboard Page (/dashboard)
- Header with user name and logout button
- "Create Workspace" button
- Grid of workspace cards:
  - Workspace name (clickable → /workspace/:id)
  - Description
  - Member count
  - Role badge (owner/admin/member)

### 4. Workspace Page (/workspace/:id)
- Sidebar:
  - Workspace name header
  - "New Page" button
  - List of pages (hierarchical)
- Main area:
  - Page title (editable)
  - List of blocks
  - "Add Block" button with type selector
- Block rendering:
  - Each block type renders differently
  - Click to edit inline

### 5. Page Editor Component
- Title input at top
- Block list (rendered by type)
- Floating toolbar for block actions:
  - Add block above/below
  - Change block type
  - Delete block

---

## Project Structure

```
notion-clone/
├── backend/
│   ├── src/
│   │   ├── index.ts          # Express app entry
│   │   ├── routes/
│   │   │   ├── auth.ts       # /api/auth/*
│   │   │   ├── workspaces.ts # /api/workspaces/*
│   │   │   ├── pages.ts      # /api/pages/*
│   │   │   └── blocks.ts     # /api/blocks/*
│   │   ├── middleware/
│   │   │   └── auth.ts       # JWT verification
│   │   ├── db/
│   │   │   └── knex.ts       # Knex setup
│   │   └── types/
│   │       └── index.ts      # TypeScript interfaces
│   ├── migrations/           # SQL migration files
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx           # Router setup
│   │   ├── main.tsx          # Entry point
│   │   ├── api/
│   │   │   └── axios.ts      # Axios instance + interceptors
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Workspace.tsx
│   │   ├── components/
│   │   │   ├── Block.tsx     # Block renderer
│   │   │   ├── BlockList.tsx
│   │   │   └── WorkspaceCard.tsx
│   │   └── hooks/
│   │       └── useAuth.ts    # Auth state hook
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── SPEC.md                   # This file
```

---

## Acceptance Criteria

### Backend
- [ ] Server starts on port 3001
- [ ] /health returns 200
- [ ] User can register and login
- [ ] JWT tokens work for protected routes
- [ ] All CRUD operations work for workspaces, pages, blocks
- [ ] Proper error handling (404, 401, 400, 500)

### Frontend
- [ ] Dev server starts on port 5173
- [ ] Can register new account
- [ ] Can login and see dashboard
- [ ] Can create workspace
- [ ] Can view workspace with pages
- [ ] Can create and edit pages
- [ ] Can add, edit, delete blocks
- [ ] Logout clears session

### Database
- [ ] All 5 tables created with correct columns
- [ ] Foreign keys work (cascade delete)
- [ ] Indexes exist for performance
- [ ] Migrations run without errors
