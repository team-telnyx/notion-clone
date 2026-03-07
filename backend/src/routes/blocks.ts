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

// Helper to check page access
const checkPageAccess = async (pageId: string, userId: string) => {
  const page = await db('pages').where({ id: pageId }).first();
  if (!page) return null;

  const membership = await db('workspace_members')
    .where({ workspace_id: page.workspace_id, user_id: userId })
    .first();

  return membership ? page : null;
};

// GET /pages/:id
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = String(req.params.id);

    const page = await checkPageAccess(id, user.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    res.json(page);
  } catch (error) {
    console.error('Get page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /pages/:id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = String(req.params.id);
    const { title, content } = req.body;

    const page = await checkPageAccess(id, user.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    const [updated] = await db('pages')
      .where({ id })
      .update({
        title: title !== undefined ? title : page.title,
        content: content !== undefined ? content : page.content,
        updated_at: new Date(),
      })
      .returning(['id', 'title', 'content', 'workspace_id', 'parent_id', 'created_by', 'created_at', 'updated_at']);

    res.json(updated);
  } catch (error) {
    console.error('Update page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /pages/:id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = String(req.params.id);

    const page = await checkPageAccess(id, user.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    await db('pages').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Delete page error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /pages/:pageId/blocks
router.get('/:pageId/blocks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const pageId = String(req.params.pageId);

    const page = await checkPageAccess(pageId, user.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    const blocks = await db('blocks')
      .where({ page_id: pageId })
      .orderBy('position', 'asc');

    res.json(blocks);
  } catch (error) {
    console.error('Get blocks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /pages/:pageId/blocks
router.post('/:pageId/blocks', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const pageId = String(req.params.pageId);
    const { type, content, parent_id, position } = req.body;

    const page = await checkPageAccess(pageId, user.id);
    if (!page) {
      return res.status(404).json({ error: 'Page not found or access denied' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Block type is required' });
    }

    const [block] = await db('blocks')
      .insert({
        page_id: pageId,
        type,
        content: content || {},
        parent_id: parent_id || null,
        position: position || 0,
      })
      .returning(['id', 'page_id', 'parent_id', 'type', 'content', 'position', 'created_at']);

    res.status(201).json(block);
  } catch (error) {
    console.error('Create block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /blocks/:id
router.put('/block/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = String(req.params.id);
    const { content, position } = req.body;

    const block = await db('blocks').where({ id }).first();
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Check access via page
    const page = await checkPageAccess(block.page_id, user.id);
    if (!page) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [updated] = await db('blocks')
      .where({ id })
      .update({
        content: content !== undefined ? content : block.content,
        position: position !== undefined ? position : block.position,
        updated_at: new Date(),
      })
      .returning(['id', 'page_id', 'parent_id', 'type', 'content', 'position', 'created_at', 'updated_at']);

    res.json(updated);
  } catch (error) {
    console.error('Update block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /blocks/:id
router.delete('/block/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const id = String(req.params.id);

    const block = await db('blocks').where({ id }).first();
    if (!block) {
      return res.status(404).json({ error: 'Block not found' });
    }

    // Check access via page
    const page = await checkPageAccess(block.page_id, user.id);
    if (!page) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await db('blocks').where({ id }).del();
    res.status(204).send();
  } catch (error) {
    console.error('Delete block error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
