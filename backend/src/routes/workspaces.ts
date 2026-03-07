import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/knex';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware to verify token
const authMiddleware = async (req: Request, res: Response, next: Function) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    const user = await db('users').where({ id: decoded.userId }).first();
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// GET /workspaces
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const workspaces = await db('workspaces')
      .join('workspace_members', 'workspaces.id', 'workspace_members.workspace_id')
      .where('workspace_members.user_id', user.id)
      .select(
        'workspaces.id',
        'workspaces.name',
        'workspaces.description',
        'workspaces.created_at',
        'workspace_members.role'
      );

    // Get member counts
    const workspacesWithCounts = await Promise.all(
      workspaces.map(async (ws) => {
        const memberCount = await db('workspace_members')
          .where({ workspace_id: ws.id })
          .count('* as count')
          .first();
        return {
          ...ws,
          memberCount: Number(memberCount?.count || 0),
          createdAt: ws.created_at,
        };
      })
    );

    res.json(workspacesWithCounts);
  } catch (error) {
    console.error('Get workspaces error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /workspaces
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    // Create workspace
    const [workspace] = await db('workspaces')
      .insert({ name, description, owner_id: user.id })
      .returning(['id', 'name', 'description', 'owner_id', 'created_at']);

    // Add owner as member
    await db('workspace_members').insert({
      workspace_id: workspace.id,
      user_id: user.id,
      role: 'owner',
    });

    res.status(201).json(workspace);
  } catch (error) {
    console.error('Create workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /workspaces/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Check membership
    const membership = await db('workspace_members')
      .where({ workspace_id: id, user_id: user.id })
      .first();

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const workspace = await db('workspaces').where({ id }).first();
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    res.json(workspace);
  } catch (error) {
    console.error('Get workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /workspaces/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;
    const { name, description } = req.body;

    // Check ownership or admin
    const membership = await db('workspace_members')
      .where({ workspace_id: id, user_id: user.id })
      .first();

    if (!membership || !['owner', 'admin'].includes(membership.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [updated] = await db('workspaces')
      .where({ id })
      .update({ name, description, updated_at: new Date() })
      .returning(['id', 'name', 'description', 'owner_id', 'created_at', 'updated_at']);

    res.json(updated);
  } catch (error) {
    console.error('Update workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /workspaces/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { id } = req.params;

    // Check ownership
    const workspace = await db('workspaces').where({ id }).first();
    if (!workspace) {
      return res.status(404).json({ error: 'Workspace not found' });
    }

    if (workspace.owner_id !== user.id) {
      return res.status(403).json({ error: 'Only owner can delete workspace' });
    }

    await db('workspaces').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Delete workspace error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
