import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/knex';

const router = Router({ mergeParams: true });
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

// GET /workspaces/:workspaceId/pages
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { workspaceId } = req.params;

    // Check membership
    const membership = await db('workspace_members')
      .where({ workspace_id: workspaceId, user_id: user.id })
      .first();

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const pages = await db('pages')
      .where({ workspace_id: workspaceId })
      .select('id', 'title', 'parent_id', 'created_by', 'created_at', 'updated_at')
      .orderBy('created_at', 'asc');

    res.json(pages);
  } catch (error) {
    console.error('Get pages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /workspaces/:workspaceId/pages
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { workspaceId } = req.params;
    const { title, parent_id } = req.body;

    // Check membership
    const membership = await db('workspace_members')
      .where({ workspace_id: workspaceId, user_id: user.id })
      .first();

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [page] = await db('pages')
      .insert({
        title: title || 'Untitled',
        content: {},
        workspace_id: workspaceId,
        parent_id: parent_id || null,
        created_by: user.id,
      })
      .returning(['id', 'title', 'content', 'workspace_id', 'parent_id', 'created_by', 'created_at']);

    res.status(201).json(page);
  } catch (error) {
    console.error('Create page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
